# grunt-recess

[Grunt][grunt] task to lint and minify CSS and LESS, using the Twitter [RECESS][recess] module:

> Developed at Twitter to support our internal styleguide, RECESS is a simple, attractive code quality tool for CSS built on top of LESS.

> Incorporate it into your development process as a linter, or integrate it directly into your build system as a compiler, RECESS will keep your source looking clean and super manageable.


## Getting Started

If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install --save-dev grunt-recess
```

[grunt]: http://gruntjs.com
[Getting Started]: https://github.com/gruntjs/grunt/wiki/Getting-started


## Documentation


### Example usage


#### Lint

```javascript
recess: {
	dist: {
		src: ['src/main.css']
	}
}
```


#### Lint and compile

```javascript
recess: {
	dist: {
		options: {
			compile: true
		},
		files: {
			'dist/main.css': ['src/main.less']
		}
	}
}
```

A destination is only needed when `compile: true`. It won't output any warnings in this mode.
You can also specify `.less` files and they will be compiled.


#### Lint, compile and concat

```javascript
recess: {
	dist: {
		options: {
			compile: true
		},
		files: {
			'dist/combined.css': [
				'src/main.css',
				'src/component.css'
			]
		}
	}
}
```

You can specify multiple source files to concat them.


### Options

```javascript
// Default
compile: false 				// Compiles CSS or LESS. Fixes white space and sort order.
compress: false				// Compress your compiled code
noIDs: true					// Doesn't complain about using IDs in your stylesheets
noJSPrefix: true			// Doesn't complain about styling .js- prefixed classnames
noOverqualifying: true		// Doesn't complain about overqualified selectors (ie: div#foo.bar)
noUnderscores: true			// Doesn't complain about using underscores in your class names
noUniversalSelectors: true	// Doesn't complain about using the universal * selector
prefixWhitespace: true		// Adds whitespace prefix to line up vender prefixed properties
strictPropertyOrder: true	// Complains if not strict property order
zeroUnits: true				// Doesn't complain if you add units to values of 0
```


## Tests

Grunt currently doesn't have a way to test tasks directly. You can test this task by running `grunt` and check that it passes on the valid files and fails on the invalid.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)


[recess]: https://github.com/twitter/recess
