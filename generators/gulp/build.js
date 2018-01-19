var gulp = require('gulp');
var msbuild = require('gulp-msbuild');
var nugetRestore = require('gulp-nuget-restore');
var assemblyInfo = require('gulp-dotnet-assembly-info');
var config = require('../../package.json');

gulp.task('nuget', function() {
  return gulp
    .src('./packages.config')
    .pipe(nugetRestore({ additionalArgs: ['-PackagesDirectory', '../packages'] }));
});

gulp.task('assemblyInfo', function() {
  return gulp
    .src(['**/AssemblyInfo.cs', '!node_modules/**'])
    .pipe(
      assemblyInfo({
        title: config.dnnModule.friendlyName,
        description: config.description,
        version: config.version,
        fileVersion: config.version,
        company: config.dnnModule.owner.organization,
        copyright: function() {
          return (
            'Copyright ' +
            new Date().getFullYear() +
            ' by ' +
            config.dnnModule.owner.organization
          );
        }
      })
    )
    .pipe(gulp.dest('.'));
});

gulp.task('build', ['nuget', 'assemblyInfo'], function() {
  return gulp.src('./<%= moduleName %>.csproj').pipe(
    msbuild({
      toolsVersion: 14.0,
      targets: ['Clean', 'Build'],
      errorOnFail: true,
      stdout: true,
      verbosity: 'minimal',
      properties: {
        DeployOnBuild: false,
        Configuration: 'Release'
      }
    })
  );
});
