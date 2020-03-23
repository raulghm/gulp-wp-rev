# gulp-wprev
<p align="left">
  <a href="https://www.npmjs.com/package/gulp-wprev"><img src="https://img.shields.io/npm/v/gulp-wprev.svg?style=flat-square"></a>
</p>

> gulp-wprev plugin for [gulp](https://github.com/gulpjs/gulp)

Revisioning CSS/JS appending a hash in you assets of WordPress theme.

`styles.css?ver=1` → `styles.css?ver=bd0622b828f9346876088cd617566fa5`

<img src="example/demo.gif" alt="demo">

# Installation/Usage

1. First, install `gulp-wprev` as a development dependency:

```shell
npm install --save-dev gulp-wprev
```

2. Then, add it to your `gulpfile.js`:

```javascript
var wpRev = require('gulp-wprev');

gulp.task('rev', function() {
	gulp.src('./wp-content/themes/my-wordpress-theme/lib/scripts.php')
	.pipe(wpRev([
		{
			handle: 'my-styles',
			file: './style.css',
			type: 'css'
		},
		{
			handle: 'vendor-scripts',
			file: './vendor.js',
			type: 'js'
		},
		{
			handle: 'my-scripts',
			file: './scripts.js',
			type: 'js'
		},
	]))
	.pipe(gulp.dest('./wp-content/themes/my-wordpress-theme/lib'));
});
```
# Configuration

`wpRev(options)`

## Basic configuration

#### options
Type: `Array`

An array of objects, where each object describes a resource and has three attributes:

#### options[*].handle
Type: `String`  

Name used as the handle in WordPress

#### options[*].filename
Type: `String`  

Name of the file source.

#### options[*].filetype
Type: `String`  

Type of resource, either `js` or `css`.

## Advanced configuration
If you would like to change the depth of the regular expression's recursion pattern (e.g. use of `()`, `[]` and `{}` in your WordPress PHP file), you can use an slighlty adjusted `options` parameter, as described below. By default, it's set to `4` and can handle 4 levels of encapsulation per type.
For example, a string of code used as a parameter in the `wp_enqueue_*` call in your PHP file like `(([(({ $something }))]))` would be fine (4 levels of `()`, 1 level of `[]` and 1 level of `{}`).

*WARNING*: For performance reasons it's not recommended to increase the amount of depth to more than 4, because of the huge regex pattern string and execution it will take. If you use more than 4 levels of a certain encapsulation type, it's recommended to refactor your PHP code instead.

#### options
Type: `Object`

Object with the following options:

#### options.depth
Type: `Integer`
Default: `4` (minimum `1`)

The amount of encapsulation depth to support in your `wp_enqueue_*`/`wp_register_*` calls.

#### options.assets
Type: `Array`

An array of objects, where each object describes a resource and has three attributes:

#### options.assets[*].handle
Type: `String`  

Name used as the handle in WordPress

#### options.assets[*].filename
Type: `String`  

Name of the file source.

#### options.assets[*].filetype
Type: `String`  

Type of resource, either `js` or `css`.


## Contributors

[@raulghm](https://github.com/raulghm)
[@vHeemstra](https://github.com/vheemstra)
