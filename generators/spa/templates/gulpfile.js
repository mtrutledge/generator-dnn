var gulp = require('gulp');
var webpack = require('webpack');

require('require-dir')('./_BuildScripts/gulp'); 

gulp.task('build-client', function(cb){

    webpack( require('./_BuildScripts/webpack.config.js'), function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		cb();
    });
});

gulp.task('default', ['build-client', 'build', 'package'], function() { 
    return null;
});