# grunt-recess

[Grunt][grunt] task to lint and minify CSS or LESS, using the Twitter [RECESS][recess] module:

> Developed at Twitter to support our internal styleguide, RECESS is a simple, attractive code quality tool for CSS built on top of LESS.

> Incorporate it into your development process as a linter, or integrate it directly into your build system as a compiler, RECESS will keep your source looking clean and super manageable.


## Getting Started

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-recess`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-recess');
```


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
		src: ['src/main.less'],
		dest: 'dist/main.css',
		options: {
			compile: true
		}
	}
}
```

`dest` is only needed when `compile: true`, it won't output any warnings in this mode.
You can also specify `.less` files and they will be compiled.


#### Lint, compile and concat

```javascript
recess: {
	dist: {
		src: [
			'src/main.css',
			'src/component.css'
		],
		dest: 'dist/combined.css',
		options: {
			compile: true
		}
	}
}
```

You can specify more than one `src` to concat the files.


### Options

```javascript
// Default
compile: false,
compress: false,
noIDs: true,
noJSPrefix: true,
noOverqualifying: true,
noUnderscores: true,
noUniversalSelectors: true,
prefixWhitespace: true,
strictPropertyOrder: true,
zeroUnits: true
```


## Tests

Grunt currently doesn't have a way to test tasks directly. You can test this task by running `grunt` and check that it passes on the valid files and fails on the invalid.


## Contribute

In lieu of a formal styleguide, take care to maintain the existing coding style.


## License

MIT License
(c) [Sindre Sorhus](http://sindresorhus.com)


[grunt]: https://github.com/cowboy/grunt
[recess]: https://github.com/twitter/recess
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md