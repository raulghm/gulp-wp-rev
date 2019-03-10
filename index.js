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

			if (options && options.length > 0) {
				for (var i = 0; i < options.length; i++) {
					if (options[ i ].file && options[ i ].handle && options[ i ].type) {
						switch (options[ i ].type) {
							case 'css':
								var regexCss = new RegExp("(wp_(?:register|enqueue)_style\\(\\s?'" + options[ i ].handle + "',(\\s*[^,]+,){2})\\s*[^,]+(,\\s*[^\\)]+)?\\);");
								var hashCss = md5(options[ i ].file);
								file.contents = new Buffer(String(file.contents).replace(regexCss, "$1 '" + hashCss + "'$3);"));
								break;
							case 'js':
								var regexJs = new RegExp("(wp_(?:register|enqueue)_script\\(\\s?'" + options[ i ].handle + "',(\\s*[^,]+,\\s*.+,))\\s*'[a-zA-Z0-9]+'\\s*(,\\s*[^\\)]+)?\\);");
								var hashJs = md5(options[ i ].file);
								file.contents = new Buffer(String(file.contents).replace(regexJs, "$1 '" + hashJs + "'$3);"));
								break;
							default:
								break;
						}
					}
				}
			}

			this.push(file);
		}

		cb();
	});
};
