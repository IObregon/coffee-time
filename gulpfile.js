var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('default', ['lint'], function(){

});

gulp.task('lint', function(){
	return gulp.src(['./*.js', './config/*.js', './models/*.js', './public/**/*.js', './test/*.js', '!node_modules/**'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});