var gulp = require('gulp');
var webpack = require('webpack');

require('require-dir')('./_BuildScripts/gulp'); 

gulp.task('build-client', function(cb){

    webpack( require('./_BuildScripts/webpack.config.js'), function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		cb();
    });
});

gulp.task('default', gulp.series(['nuget', 'assemblyInfo', 'build-client', 'build', 'package'], function(done) { 
    done();
    return null;
}));