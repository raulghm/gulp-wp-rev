'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var wpRev = require('gulp-wp-rev');

gulp.task('rev', function () {
	gulp.src('./wp-content/themes/raulghm-theme/lib/scripts.php')
	.pipe(wpRev({
		css: 'src/styles/styles.css',
		cssHandle: 'my_assets',
		js: 'src/scripts/scripts.js',
		jsHandle: 'my_assets'
	}))
	.pipe(gulp.dest('./wp-content/themes/raulghm-theme/lib'));
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
