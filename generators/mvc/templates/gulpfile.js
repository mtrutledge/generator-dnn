var gulp = require('gulp'),
    msbuild = require('gulp-msbuild'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    assemblyInfo = require('gulp-dotnet-assembly-info'),
    config = require('./package.json'),
    zip = require('gulp-zip'),
    filter = require('gulp-filter'),
    merge = require('merge2'),
    markdown = require('gulp-markdown'),
    rename = require('gulp-rename'),
    manifest = require('gulp-dnn-manifest'),
    path = require('path')

gulp.task('assemblyInfo', function () {
    return gulp
        .src(['**/AssemblyInfo.cs', '!node_modules/**'])
        .pipe(assemblyInfo({
            title: config.dnn.friendlyName,
            description: config.description,
            version: config.version,
            fileVersion: config.version,
            company: config.dnn.owner.organization,
            copyright: function (value) {
                return 'Copyright ' + new Date().getFullYear() + ' by ' + config.dnn.owner.organization;
            }
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('build', ['assemblyInfo'], function () {
    var outDir = path.join(__dirname, config.dnn.pathToAssemblies);
    return gulp.src('./<%= moduleName %>.csproj')
        .pipe(msbuild({
            toolsVersion: 14.0,
            targets: ['Clean', 'Build'],
            errorOnFail: true,
            stdout: true,
            properties: {
                Configuration: 'Release',
                OutputPath: outDir
            }
        }));
});

// TODO: Create the packageinstall and packagesource tasks
gulp.task('packageInstall', ['build'], function() {
    var packageName = '<%= moduleName %>_' + config.version;
    var dirFilter = filter(fileTest);
    return merge(
        merge(
          gulp.src([
            '**\*.cshtml',
            '**\*.ascx',
            '**\*.asmx',
            '**\*.css',
            '**\*.html',
            '**\*.htm',
            '**\*.resx',
            '**\*.aspx',
            '**\*.js',
            '**\*.txt',
            '**\images\**'
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
        gulp.src(config.dnnModule.pathToSupplementaryFiles + '/*.dnn')
        .pipe(manifest(config)),
        gulp.src([config.dnnModule.pathToAssemblies + '/*.dll',
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

gulp.task('package', ['packageInstall', 'packageSource'], function () {
    return null;
})

gulp.task('default', ['build'], function() { });

function fileTest(file) {
    var res = false;
    for (var i = config.dnn.excludeFilter.length - 1; i >= 0; i--) {
        res = res | file.relative.startsWith(config.dnn.excludeFilter[i]);
    };
    return !res;
}

function startsWith(str, strToSearch) {
    return str.indexOf(strToSearch) === 0;
}