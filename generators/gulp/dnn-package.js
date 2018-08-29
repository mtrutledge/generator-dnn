var gulp = require('gulp');
var config = require('../../package.json');
var zip = require('gulp-zip');
var markdown = require('gulp-markdown');
var rename = require('gulp-rename');
var es = require('event-stream');

gulp.task('packageInstall', ['build'], function() {
  var packageName = config.dnnModule.fullName + '_' + config.version;

  var resourceZip = gulp
    .src(
      [
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
        '**/*.png',
        '**/*.gif',
        '**/*.jpg',
        '**/*.svg',
        '!/**/web.config',
        '!/**/gulpfile.js',
        '!/**/{_BuildScripts,_BuildScripts/**}',
        '!/**/{_Packages,_Packages/**}',
        '!/**/{bin,bin/**}',
        '!/**/{obj,obj/**}',
        '!/**/{packages,packages/**}',
        '!/**/{node_modules,node_modules/**}',
        '!/**/{_PublishedWebsites,_PublishedWebsites/**}'
      ],
      {
        base: '.'
      }
    )
    .pipe(zip('Resources.zip'));

  return es
    .merge(
      gulp.src([
        '**/<%= namespace%>.<%= moduleName %>.dll',
        '**/<%= moduleName %>.dnn',
        '**/*.SqlDataProvider',
        '!/**/gulpfile.js',
        '!/**/{_BuildScripts,_BuildScripts/**}',
        '!/**/{_Packages,_Packages/**}',
        '!/**/{bin,bin/**}',
        '!/**/{obj,obj/**}',
        '!/**/{packages,packages/**}',
        '!/**/{node_modules,node_modules/**}',
        '!/**/{_PublishedWebsites,_PublishedWebsites/**}'
      ]),
      gulp
        .src(config.dnnModule.pathToSupplementaryFiles + '/License.md')
        .pipe(markdown())
        .pipe(rename('License.txt')),
      gulp
        .src(config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.md')
        .pipe(markdown())
        .pipe(rename('ReleaseNotes.txt')),
      resourceZip
    )
    .pipe(zip(packageName + '_Install.zip'))
    .pipe(gulp.dest(config.dnnModule.packagesPath));
});

gulp.task('packageSource', ['build'], function() {
  var packageName = config.dnnModule.fullName + '_' + config.version;

  var resourceZip = gulp
    .src(
      [
        '**/*.*',
        '!/**/{License.txt,ReleaseNotes.txt, *-lock.json}',
        '!/**/{_Packages,_Packages/**}',
        '!/**/{bin,bin/**}',
        '!/**/{obj,obj/**}',
        '!/**/{packages,packages/**}',
        '!/**/{node_modules,node_modules/**}',
        '!/**/{_PublishedWebsites,_PublishedWebsites/**}'
      ],
      {
        base: '.'
      }
    )
    .pipe(zip('Resources.zip'));

  return es
    .merge(
      gulp.src([
        '**/<%= namespace %>.<%= moduleName %>.dll',
        '**/<%= moduleName %>.dnn',
        '**/*.SqlDataProvider',
        '!/**/{obj,obj/**}',
        '!/**/{_PublishedWebsites,_PublishedWebsites/**}'
      ]),
      gulp
        .src(config.dnnModule.pathToSupplementaryFiles + '/License.md')
        .pipe(markdown())
        .pipe(rename('License.txt')),
      gulp
        .src(config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.md')
        .pipe(markdown())
        .pipe(rename('ReleaseNotes.txt')),
      resourceZip
    )
    .pipe(zip(packageName + '_Source.zip'))
    .pipe(gulp.dest(config.dnnModule.packagesPath));
});

gulp.task('package', ['packageInstall', 'packageSource'], function() {
  return null;
});
