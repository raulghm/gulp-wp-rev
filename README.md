# gulp-wp-rev
[![NPM version][npm-image]][npm-url]

> gulp-wp-rev plugin for [gulp](https://github.com/wearefractal/gulp)

> Revisioning JS and CSS to scripts.php file on wordpress assets

Alternative gulpjs version for `grunt-wp-version` of https://github.com/roots/roots

## Usage

First, install `gulp-wp-rev` as a development dependency:

```shell
npm install --save-dev gulp-wp-rev
```

Then, add it to your `gulpfile.js`:

```javascript
var rev = require("gulp-wp-rev");

gulp.task('rev', function () {
    gulp.src('lib/scripts.php')
        .pipe(rev({
        	css: "assets/css/main.min.css",
        	cssHandle: "roots_main",
        	js: "assets/js/scripts.min.js",
        	jsHandle: "roots_scripts"
        }))
        .pipe(gulp.dest('lib'));
});

```

## API

### wp-rev(options)

#### options.css
Type: `String`  

css source file

#### options.js
Type: `String`  

js source file

#### options.cssHandle
Type: `String`  

Name used as a handle for the stylesheet.

#### options.jsHandle
Type: `String`  

Name used as a handle for the javascript.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-wp-rev
[npm-image]: https://badge.fury.io/js/gulp-wp-rev.png

[travis-url]: http://travis-ci.org/raulghm/gulp-wp-rev
[travis-image]: https://secure.travis-ci.org/raulghm/gulp-wp-rev.png?branch=master

[coveralls-url]: https://coveralls.io/r/raulghm/gulp-wp-rev
[coveralls-image]: https://coveralls.io/repos/raulghm/gulp-wp-rev/badge.png

[depstat-url]: https://david-dm.org/raulghm/gulp-wp-rev
[depstat-image]: https://david-dm.org/raulghm/gulp-wp-rev.png
