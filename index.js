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
      cb(new gutil.PluginError('@vheemstra/gulp-wprev', 'Streaming not supported'));
      return;
    }

    // check if file.contents is a `Buffer`
    if (file.isBuffer()) {

      file.contents = new Buffer(String(file.contents));

      var assets = [];
      var recursion_of_type_depth = 4;
      if (Object.prototype.toString.call(options) === '[object Array]') {
        assets = options;
      } else {
        assets = options.assets;
        if (options.depth && 0 < options.depth) {
          recursion_of_type_depth = Math.max(1, options.depth);
        }
      }

      if (assets.length > 0) {

        // Prepare patterns for better matching PHP with recursion of (), [] and {}
        // NOTE: Because Javascript doesn't support recursive subpattern matching,
        //       we have to produce the recursion in the RegEx pattern to a certain depth.
        var patterns = {
          'non-recursive-required': '(,(?:[^,\\)\\(\\{\\}\\[\\]]|(?:\\(\\)|\\([^\\)]+\\))|(?:\\{\\}|\\{[^\\}]+\\})|(?:\\[\\]|\\[[^\\]]+\\]))*)Y',
          'non-recursive-optional': '(,(?:[^,\\)\\(\\{\\}\\[\\]]|(?:\\(\\)|\\([^\\)]+\\))|(?:\\{\\}|\\{[^\\}]+\\})|(?:\\[\\]|\\[[^\\]]+\\]))*Y)?',
          'recursive-required': '(,(?:[^,\\)\\(\\{\\}\\[\\]]|(?:\\(\\)|\\(X\\))|(?:\\{\\}|\\{X\\})|(?:\\[\\]|\\[X\\]))*)Y',
          'recursive-optional': '(,(?:[^,\\)\\(\\{\\}\\[\\]]|(?:\\(\\)|\\(X\\))|(?:\\{\\}|\\{X\\})|(?:\\[\\]|\\[X\\]))*Y)?',
          'recursion': '(?:[^\\)\\(\\{\\}\\[\\]]|(?:\\(\\)|\\(X\\))|(?:\\{\\}|\\{X\\})|(?:\\[\\]|\\[X\\]))+',
          'last-recursion': '(?:[^\\)\\(\\{\\}\\[\\]]|(?:\\(\\)|\\([^\\)]+\\))|(?:\\{\\}|\\{[^\\}]+\\})|(?:\\[\\]|\\[[^\\]]+\\]))+',
        };
        var number_of_required_attrs = 1;
        var number_of_optional_attrs = 3;
        var attr_to_replace = 3;
        var r_begin = '^(\\s*wp_(?:register|enqueue)_TYPE\\s*\\(\\s?([\'"])HANDLE\\2\\s*)';
        var r_attrs = 'Y';
        var r_end = '(\\);)';

        // Fill in attributes
        for (var i = 0; i < number_of_required_attrs; i++) {
          if (recursion_of_type_depth <= 1) {
            r_attrs = r_attrs.replace(/Y/g, patterns['non-recursive-required']);
          } else {
            r_attrs = r_attrs.replace(/Y/g, patterns['recursive-required']);
          }
        }
        for (var i = 0; i < number_of_optional_attrs; i++) {
          if (recursion_of_type_depth <= 1) {
            r_attrs = r_attrs.replace(/Y/g, patterns['non-recursive-optional']);
          } else {
            r_attrs = r_attrs.replace(/Y/g, patterns['recursive-optional']);
          }
        }
        r_attrs = r_attrs.replace(/Y/g, '');

        // Fill in recursion
        if (recursion_of_type_depth > 1) {
          for (var j = 1; j < (recursion_of_type_depth - 1); j++) {
            r_attrs = r_attrs.replace(/X/g, patterns['recursion']);
          }
          r_attrs = r_attrs.replace(/X/g, patterns['last-recursion']);
        }

        // Combine regex parts
        var regex = r_begin + r_attrs + r_end;

        for (var i = 0; i < assets.length; i++) {
          if (assets[ i ].handle && assets[ i ].filename && assets[ i ].filetype) {
            var filetype = '';
            switch (assets[ i ].filetype) {
              case 'css':
                filetype = 'style';
                break;
              case 'js':
                filetype = 'script';
                break;
              default:
                break;
            }
            if (0 < filetype.length) {
              // Prepare replacement
              var hash = md5(assets[ i ].filename);
              var handle = assets[ i ].handle;
              var old_filecontents = file.contents;
              var new_filecontents = file.contents;

              // Perform replacement
              var r = new RegExp(regex.replace('TYPE', filetype).replace('HANDLE', handle), 'gm');
              var s = [];
              var needle = '';
              var replacement = '';
              while (s = r.exec(old_filecontents)) {
                needle = new RegExp('^' + s[0].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'm');
                replacement = '';

                if (attr_to_replace > 0) {
                  // Add beginning
                  replacement = replacement + s[1];

                  if (attr_to_replace <= number_of_required_attrs) {
                    // Add required attributes before
                    for (var j = 1; j < attr_to_replace; j++) {
                      replacement = replacement + s[ 2 + j ];
                    }

                    // Add replacement
                    replacement = replacement + ', \'' + hash + '\'';

                    // Add required attributes after
                    for (var j = (attr_to_replace + 1); j <= number_of_required_attrs; j++) {
                      replacement = replacement + s[ 2 + j ];
                    }

                    // Add outer most optional group
                    if ('undefined' !== typeof s[ 2 + number_of_required_attrs + 1 ] ) {
                      replacement = replacement + s[ 2 + number_of_required_attrs + 1 ];
                    }
                  } else if (attr_to_replace <= (number_of_required_attrs + number_of_optional_attrs) ) {
                    // Add required attributes
                    for (var j = 1; j <= number_of_required_attrs; j++) {
                      replacement = replacement + s[ 2 + j ];
                    }

                    var g = 2 + attr_to_replace;

                    // Add optional attributes before
                    if (attr_to_replace > (number_of_required_attrs + 1)) {
                      var str = '';
                      if ('undefined' !== typeof s[ g ]) {
                        str = s[ 2 + number_of_required_attrs + 1 ].substring(0, (s[ 2 + number_of_required_attrs + 1 ].length - s[ g ].length) );
                      } else {
                        str = s[ 2 + number_of_required_attrs + 1 ];
                      }
                      replacement = replacement + str;
                    }

                    // Fill in dependencies parameter if missing
                    if ('undefined' === typeof s[ g - 1 ]) {
                      replacement = replacement + ', array()';
                    }

                    // Add replacement
                    replacement = replacement + ', \'' + hash + '\'';
                    
                    // Add next outer most optional group
                    if ('undefined' !== typeof s[ g + 1 ]) {
                      replacement = replacement +  s[ g + 1 ];
                    }
                  }

                  // Add ending
                  if ('undefined' !== typeof s[ 2 + number_of_required_attrs + number_of_optional_attrs + 1 ]) {
                    // Add next outer most optional group
                    replacement = replacement + s[ 2 + number_of_required_attrs + number_of_optional_attrs + 1 ];
                  }
                }

                // Replace in new contents
                new_filecontents = new Buffer(String(new_filecontents).replace(needle, replacement));
              }

              // Set new contents of file
              file.contents = new Buffer(String(new_filecontents));
            }
          }
        }
      }

      this.push(file);
    }

    cb();
  });
};
