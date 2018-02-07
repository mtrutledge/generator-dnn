var gulp = require('gulp');

require('require-dir')('./_BuildScripts/gulp'); 

gulp.task('default', ['build', 'package'], function() { 
    return null;
});