'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var wpRev = require('gulp-wp-rev');

gulp.task('rev', function () {
	gulp.src('./wp-content/themes/my-wordpress-theme/lib/scripts.php')
	.pipe(wpRev([
		{
			handle: 'my_assets',
			filename: 'src/styles/styles.css',
			filetype: 'css'
		},
		{
			handle: 'my_assets',
			filename: 'src/scripts/scripts.js',
			filetype: 'js',
		}
	]))
	.pipe(gulp.dest('./wp-content/themes/my-wordpress-theme/lib'));
});

gulp.task('build', function (callback) {
	runSequence(
		'rev',
		function (error) {
			if (error) {
				console.log(error.message);
			} else {
				console.log('Build finished successfully :)');
			}
			callback(error);
		});
});
