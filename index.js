var	through = require("through2"),
	gutil = require("gulp-util");
	fs = require('fs');
	crypto = require('crypto');

var md5 = function(str) {
  var hash = crypto.createHash('md5');
  hash.update(fs.readFileSync(str));
  return hash.digest('hex');
};

module.exports = function(options) {
	"use strict";

	var o = options || {};

	function foo(file, enc, callback) {

		// Do nothing if no contents
		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {
			// accepting streams is optional
			this.emit("error",
				new gutil.PluginError("gulp-foo", "Stream content is not supported"));
			return callback();
		}

		// check if file.contents is a `Buffer`
		if (file.isBuffer()) {

			file.contents = new Buffer(String(file.contents));

			var regexCss = new RegExp("(wp_enqueue_style\\('" + o.cssHandle + "',(\\s*[^,]+,){2})\\s*[^\\)]+\\);");
			var regexJs = new RegExp("(wp_register_script\\('" + o.jsHandle + "',(\\s*[^,]+,){2})\\s*[^\\)]+\\);");

			var hashCss = md5(o.css);
			var hashJs = md5(o.js);

			file.contents = new Buffer(String(file.contents).replace(regexCss, "$1 '" + hashCss + "');"));
			file.contents = new Buffer(String(file.contents).replace(regexJs, "$1 '" + hashJs + "');"));

			this.push(file);

		}
		return callback();
	}

	return through.obj(foo);
};
