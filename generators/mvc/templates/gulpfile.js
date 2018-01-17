var gulp = require('gulp'),
    msbuild = require('gulp-msbuild'),
    nugetRestore = require('gulp-nuget-restore'),    
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    assemblyInfo = require('gulp-dotnet-assembly-info'),
    config = require('./package.json'),
    zip = require('gulp-zip'),
    filter = require('gulp-filter'),
    markdown = require('gulp-markdown'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    path = require('path'),
    es = require('event-stream');

gulp.task('nuget', function () {
    return gulp
    .src('./packages.config')
    .pipe(nugetRestore({additionalArgs: ["-PackagesDirectory", "../packages"]}));
});

gulp.task('assemblyInfo', function () {
    return gulp
        .src(['**/AssemblyInfo.cs', '!node_modules/**'])
        .pipe(assemblyInfo({
            title: config.dnnModule.friendlyName,
            description: config.description,
            version: config.version,
            fileVersion: config.version,
            company: config.dnnModule.owner.organization,
            copyright: function (value) {
                return 'Copyright ' + new Date().getFullYear() + ' by ' + config.dnnModule.owner.organization;
            }
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('build', ['nuget', 'assemblyInfo'], function () {
    var outDir = path.join(__dirname, config.dnnModule.pathToAssemblies);

    return gulp.src('./<%= moduleName %>.csproj')
        .pipe(msbuild({
            toolsVersion: 14.0,
            targets: ['Clean', 'Build'],
            errorOnFail: true,
            stdout: true,
			verbosity: 'minimal',
            properties: {
				DeployOnBuild: false,
                Configuration: 'Release',
                OutputPath: outDir
            }
        }));
});

gulp.task('packageInstall', ['build'], function(){
    var packageName = config.dnnModule.fullName + '_' + config.version;

	var resourceZip = gulp.src(['**/*.cshtml'
				, '**/*.ascx'
				, '**/*.asmx'
				, '**/*.css'
				, '**/*.html'
				, '**/*.htm' 
				, '**/*.resx'
				, '**/*.aspx'
				, '**/*.js'
				, '**/*.txt'
				, '**/*.png'
				, '**/*.gif'
				, '**/*.jpg'
				, '**/*.svg'
				, '!' + '/**/web.config',
				, '!' + '/**/gulpfile.js',
				, '!' + '/**/{bin,bin/**}',
				, '!' + '/**/{obj,obj/**}',
				, '!' + '/**/{packages,packages/**}'
				, '!' + '/**/{node_modules,node_modules/**}'
				, '!' + '/**/{_PublishedWebsites,_PublishedWebsites/**}'], {
            base: '.'
          }).pipe(zip('Resources.zip'));

		  return es.merge(
        gulp.src(['**/<%= namespace%>.<%= moduleName %>.dll'
			, '**/<%= moduleName %>.dnn'
			, '**/*.SqlDataProvider'
			, '!' + '/**/{obj,obj/**}',
			, '!' + '/**/{_PublishedWebsites,_PublishedWebsites/**}'
		]),
        gulp.src(config.dnnModule.pathToSupplementaryFiles + '/License.md')
        .pipe(markdown())
        .pipe(rename('License.txt')),
        gulp.src(config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.md')
        .pipe(markdown())
        .pipe(rename('ReleaseNotes.txt')),
		resourceZip
      )
      .pipe(zip(packageName + '_Install.zip'))
      .pipe(gulp.dest(config.dnnModule.packagesPath));
});

gulp.task('packageSource', ['build'], function() {
    var packageName = config.dnnModule.fullName + '_' + config.version;

    var resourceZip = gulp.src(['**/*.*'
            , '!' + '/**/{License.txt,ReleaseNotes.txt, *-lock.json}',
            , '!' + '/**/{_Packages,_Packages/**}',
            , '!' + '/**/{bin,bin/**}',
            , '!' + '/**/{obj,obj/**}',
            , '!' + '/**/{packages,packages/**}'
            , '!' + '/**/{node_modules,node_modules/**}'
            , '!' + '/**/{_PublishedWebsites,_PublishedWebsites/**}'
            ], {
          base: '.'
        })
        .pipe(zip('Resources.zip'));
		
		return es.merge(
		gulp.src(['**/<%= namespace %>.<%= moduleName %>.dll'
			, '**/<%= moduleName %>.dnn'
			, '**/*.SqlDataProvider'
			, '!' + '/**/{obj,obj/**}',
			, '!' + '/**/{_PublishedWebsites,_PublishedWebsites/**}'
		]),
        gulp.src(config.dnnModule.pathToSupplementaryFiles + '/License.md')
        .pipe(markdown())
        .pipe(rename('License.txt')),
        gulp.src(config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.md')
        .pipe(markdown())
        .pipe(rename('ReleaseNotes.txt')),
		resourceZip
      )
      .pipe(zip(packageName + '_Source.zip'))
      .pipe(gulp.dest(config.dnnModule.packagesPath));
});

gulp.task('package', ['packageInstall', 'packageSource'], function () {
    return null;
})

gulp.task('default', ['build', 'package'], function() { 
    return null;
});

function fileTest(file) {
    var res = false;
    for (var i = config.dnnModule.excludeFilter.length - 1; i >= 0; i--) {
        res = res | file.relative.startsWith(config.dnnModule.excludeFilter[i]);
    };
    return !res;
}

function startsWith(str, strToSearch) {
    return str.indexOf(strToSearch) === 0;
}