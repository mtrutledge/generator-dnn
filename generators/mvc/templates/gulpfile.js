var gulp = require('gulp'),
    msbuild = require('gulp-msbuild'),
    nugetRestore = require('gulp-nuget-restore'),    
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    assemblyInfo = require('gulp-dotnet-assembly-info'),
    config = require('./package.json'),
    zip = require('gulp-zip'),
    filter = require('gulp-filter'),
    merge = require('merge2'),
    markdown = require('gulp-markdown'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    path = require('path')

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

gulp.task('package-test', function() {
    var packageName = config.dnnModule.fullName + '_' + config.version;

    var jsFilter = filter(['**/js/*.js', '!**/js/*.min.js'], { restore: true });
    var cssFilter = filter(['**/*.css'], { restore: true });

    return merge(
        merge(
        gulp.src([
        config.dnnModule.pathToPublish + '/**/{*.png,*.gif,*.svn,*.jpg}',
        config.dnnModule.pathToPublish + '/**/*.cshtml',
        config.dnnModule.pathToPublish + '/**/{*.aspx,*.ascx,*.asmx}',
        config.dnnModule.pathToPublish + '/**/*.css',
        config.dnnModule.pathToPublish + '/**/{*,htm,*.html}',
        config.dnnModule.pathToPublish + '/**/*.resx',
        config.dnnModule.pathToPublish + '/**/*.js',
        config.dnnModule.pathToPublish + '/**/*.txt',
        '!' + config.dnnModule.pathToPublish + '/**/web.config',
        '!' + config.dnnModule.pathToPublish + '/**/gulpfile.js',
        '!' + config.dnnModule.pathToPublish + '/**/{bin,bin/**}',
        '!' + config.dnnModule.pathToPublish + '/**/{Providers,Providers/**}'
    ])
    .pipe(cssFilter)
    .pipe(cleanCSS())
    .pipe(cssFilter.restore)
    .pipe(jsFilter)
    .pipe(uglify().on('error', gutil.log))
    .pipe(jsFilter.restore)
    )
    .pipe(zip('Resources.zip')),//.pipe(gulp.dest(config.dnnModule.packagesPath)),

    gulp.src([
        config.dnnModule.pathToPublish + '/**/<%= moduleName %>.dll',
        config.dnnModule.pathToPublish + '/Providers/**/*.SqlDataProvider',
        config.dnnModule.pathToPublish + '/License.txt',
        config.dnnModule.pathToPublish + '/ReleaseNotes.txt'
    ]),
    gulp.src(config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.md')
    .pipe(markdown())
    .pipe(rename('ReleaseNotes.txt'))
    )
    .pipe(zip(packageName + '_Install.zip'))
    .pipe(gulp.dest(config.dnnModule.packagesPath));
});

gulp.task('packageInstall', ['build'], function() {
    var packageName = config.dnnModule.fullName + '_' + config.version;
    var dirFilter = filter(fileTest);
    return merge(
        merge(
          gulp.src([
            '**/*.cshtml',
            '**/*.ascx',
            '**/*.asmx',
            '**/*.css',
            '**/*.html',
            '**/*.htm',
            '**/*.resx',
            '**/*.aspx',
            '**/*.js',
            '**/*.txt',
            '**/images/**'
            ], {
            base: '.'
          })
          .pipe(dirFilter),
          gulp.src(['**/*.css'], {
            base: '.'
          })
          .pipe(cleanCSS())
          .pipe(dirFilter),
          gulp.src(['**/js/*.js', '!**/js/*.min.js'], {
            base: '.'
          })
          .pipe(uglify().on('error', gutil.log)),
          gulp.src(['**/js/*.min.js'], {
            base: '.'
          })
        )
        .pipe(zip('Resources.zip')),
        gulp.src([config.dnnModule.pathToAssemblies + '/<%= moduleName %>.dll',
          config.dnnModule.pathToScripts + '/*.SqlDataProvider',
          config.dnnModule.pathToSupplementaryFiles + '/License.txt',
          config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.txt'
        ]),
        gulp.src(config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.md')
        .pipe(markdown())
        .pipe(rename('ReleaseNotes.txt'))
      )
      .pipe(zip(packageName + '_Install.zip'))
      .pipe(gulp.dest(config.dnnModule.packagesPath));
});

gulp.task('packageSource', ['build'], function() {
    var packageName = config.dnnModule.fullName + '_' + config.version;
    var dirFilter = filter(fileTest);
    return merge(
        gulp.src(['**/*.cshtml',
            '**/*.ascx',
            '**/*.asmx',
            '**/*.css',
            '**/*.xsl',
            '**/*.html',
            '**/*.htm',
            '**/*.resx',
            '**/*.xml"',
            '**/*.aspx',
            '**/*.js',
            '**/*.txt"',
            '**/images/**',
            '**/*.cs',
            '**/*.cs.designer',
            '**/*.csproj',
            '**/*.targets',
            '**/*.sln',
            config.dnnModule.pathToSupplementaryFiles + '**/*.*'
        ], {
          base: '.'
        })
        .pipe(dirFilter)
        .pipe(zip('Resources.zip')),
        gulp.src([config.dnnModule.pathToAssemblies + '/<%= moduleName %>.dll',
          config.dnnModule.pathToScripts + '/*.SqlDataProvider',
          config.dnnModule.pathToSupplementaryFiles + '/License.txt',
          config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.txt'
        ])
      )
      .pipe(zip(packageName + '_Source.zip'))
      .pipe(gulp.dest(config.dnnModule.packagesPath));
});

gulp.task('package', ['packageInstall', 'packageSource'], function () {
    return null;
})

gulp.task('default', ['build'], function() { 
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