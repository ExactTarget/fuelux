# grunt-contrib (*currently in alpha*)

A collection of general use grunt tasks. All tasks are designed with cross platform support in mind and dependencies that can easily be managed through npm.

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

#### [`yuidoc`](/gruntjs/grunt-contrib/blob/master/docs/yuidoc.md)
Compile YUIDoc Documentation.

## Included Helpers
### [`options`](/gruntjs/grunt-contrib/blob/master/docs/helpers.md#options)
Unified options retrieval, will be replaced with grunt's built-in `this.options` in the near future.

## Bugs

Help us squash them by submitting an issue that describes how you encountered it; please be as specific as possible including operating system, node, grunt, and grunt-contrib versions.

## Contributing

#### Checklist

1. Ensure your task meets the submission guidelines.
2. Ensure your task follows the code style guide.
3. Submit your pull request against `master`, unless otherwise instructed.
4. Ensure your pull request only touches what your changing and that it's squashed (ie `git rebase`).

#### Submission Guidelines

* task should work out of box, cross platform, with a simple `npm install`
* task should fill a general need and ideally be pure JavaScript
* task should include tests that cover, at minimal, its basic features
* task should be linted by running `grunt` at root of project
* task should use any built-in helpers first for consistency

#### Code Style Guide

* code should be indented with 2 spaces
* double quotes should be used where feasible
* commas should be followed by a single space (function params, etc)
* variable declaration should include `var`, [no multiple declarations](http://benalman.com/news/2012/05/multiple-var-statements-javascript/)

#### Tests

* tests should be added to the config in `test/grunt.js`
* see existing tests for guidance

*Currently, testing with grunt is a bit cumbersome--this will be addressed in a future release.*

#### Running Tests
```bash
npm install grunt -g
npm install
npm test
```

## Release History

see [CHANGELOG](/gruntjs/grunt-contrib/blob/master/CHANGELOG).

## License
Copyright (c) 2012 "Cowboy" Ben Alman & contributors.
Licensed under the MIT license.