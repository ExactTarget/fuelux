# grunt-contrib

A collection of general use grunt tasks (*currently in alpha*).

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-contrib');
```

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Included Tasks
#### [`clean`](/gruntjs/grunt-contrib/blob/master/docs/clean.md)
Clear files and folders.

#### [`coffee`](/gruntjs/grunt-contrib/blob/master/docs/coffee.md)
Compile CoffeeScript files into JavaScript.

#### [`compress`](/gruntjs/grunt-contrib/blob/master/docs/compress.md)
Compress files and folders using gzip or zip.

#### [`copy`](/gruntjs/grunt-contrib/blob/master/docs/copy.md)
Copy files into another directory.

#### [`handlebars`](/gruntjs/grunt-contrib/blob/master/docs/handlebars.md)
Compile handlebars templates to JST file.

#### [`jade`](/gruntjs/grunt-contrib/blob/master/docs/jade.md)
Compile Jade templates to HTML.

#### [`jst`](/gruntjs/grunt-contrib/blob/master/docs/jst.md)
Compile underscore templates to JST file.

#### [`less`](/gruntjs/grunt-contrib/blob/master/docs/less.md)
Compile LESS files to CSS.

#### [`mincss`](/gruntjs/grunt-contrib/blob/master/docs/mincss.md)
Minify CSS files.

#### [`requirejs`](/gruntjs/grunt-contrib/blob/master/docs/requirejs.md)
Optimize RequireJS projects using r.js.

#### [`stylus`](/gruntjs/grunt-contrib/blob/master/docs/stylus.md)
Compile Stylus files into CSS.

## Included Helpers
### [`options`](/gruntjs/grunt-contrib/blob/master/docs/helpers.md#options)
Unified options retrieval

## Contributing

#### Configuration
In order to ensure a consistent configuration style, task submissions should retreive their optional parameters with the included grunt helper, [options](/gruntjs/grunt-contrib/blob/master/docs/helpers.md#options).

#### Testing
Tests must be included with your submission.  New tasks can be added to the config in `test/grunt.js`, please see existing tests for guidance.  *Currently, testing with grunt is a bit cumbersome--this will be addressed in a future release.*

#### Running Tests
```bash
npm install grunt -g
npm install
npm test
```

## Release History
* (Until v1.0.0, this will only be updated when major or breaking changes are made)*

* 2012/06/28 - v0.0.9 - Cleanup release with copy task addition (thanks @ctalkington!)
* 2012/06/12 - v0.0.7 - Add RequireJS task.
* 2012/06/03 - v0.0.5 - Cleanup release with zip task addition.
* 2012/05/01 - v0.0.1 - Alpha release.

## License
Copyright (c) 2012 "Cowboy" Ben Alman & contributors.
Licensed under the MIT license.
