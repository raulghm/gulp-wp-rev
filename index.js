'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');
var crypto = require('crypto');
var md5 = function(str) {
  var hash = crypto.createHash('md5');
  hash.update(fs.readFileSync(str));
  return hash.digest('hex');
};

module.exports = function (options) {
	options = options || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-wp-rev', 'Streaming not supported'));
			return;
		}

		// check if file.contents is a `Buffer`
		if (file.isBuffer()) {

			file.contents = new Buffer(String(file.contents));

			if (options.css && options.cssHandle) {
        var regexCss = new RegExp("(wp_(?:register|enqueue)_style\\(\\s?'" + options.cssHandle + "',(\\s*[^,]+,){2})\\s*[^,]+(,\\s*[^\\)]+)?\\);");
				var hashCss = md5(options.css);
				file.contents = new Buffer(String(file.contents).replace(regexCss, "$1 '" + hashCss + "'$3);"));
			}

			if (options.js && options.jsHandle) {
				var regexJs = new RegExp("(wp_(?:register|enqueue)_script\\(\\s?'" + options.jsHandle + "',(\\s*[^,]+,){2})\\s*[^,]+(,\\s*[^\\)]+)?\\);");
				var hashJs = md5(options.js);
				file.contents = new Buffer(String(file.contents).replace(regexJs, "$1 '" + hashJs + "'$3);"));
			}

			this.push(file);
		}

		cb();
	});
};
