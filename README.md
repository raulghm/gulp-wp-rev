# gulp-wp-rev
<p align="left">
  <a href="https://www.npmjs.com/package/gulp-wp-rev"><img src="https://img.shields.io/npm/v/gulp-wp-rev.svg?style=flat-square"></a>
  <a href="https://github.com/raulghm/gulp-wp-rev/stargazers"><img src="http://img.shields.io/npm/dm/gulp-wp-rev.svg?style=flat-square"></a>
</p>

> gulp-wp-rev plugin for [gulp](https://github.com/wearefractal/gulp)

Revisioning CSS/JS appending a hash in you assets of wordpress theme.

`styles.css?ver=1` → `styles.css?ver=bd0622b828f9346876088cd617566fa5`

<img src="example/demo.gif" alt="demo">

## Usage

First, install `gulp-wp-rev` as a development dependency:

```shell
npm install --save-dev gulp-wp-rev
```

Then, add it to your `gulpfile.js`:

```javascript
var wpRev = require('gulp-wp-rev');

gulp.task('rev', function() {
	gulp.src('./wp-content/themes/raulghm-theme/lib/scripts.php')
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
	.pipe(gulp.dest('./wp-content/themes/raulghm-theme/lib'));
});
```

## API

### wp-rev(options)

#### options
Type: `Array` of `Object`s. 

Each object describes a resource and has three attributes:

#### options[*].handle
Type: `String`  

Name used as the handle in WordPress

#### options[*].file
Type: `String`  

Name of the file source.

#### options[*].type
Type: `String`  

Type of resource, either `js` or `css`.


## License

MIT © [raulghm](https://github.com/raulghm)
