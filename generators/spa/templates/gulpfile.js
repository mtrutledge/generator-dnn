var gulp = require('gulp');

require('require-dir')('./gulp'); 

gulp.task('build-client', function(cb){

    webpack( require('./config/webpack.config.js'), function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		cb();
    });
});

gulp.task('default', ['build-client', 'build', 'package'], function() { 
    return null;
});