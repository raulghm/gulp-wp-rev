'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var wpRev = require('./');

it('should write unicorns', function (cb) {
	var stream = wpRev();

	stream.on('data', function (file) {
		assert.strictEqual(file.contents.toString(), 'unicorns');
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/file.ext',
		contents: new Buffer('unicorns')
	}));

	stream.end();
});
