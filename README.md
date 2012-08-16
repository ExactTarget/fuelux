# FuelUX [![Build Status](https://secure.travis-ci.org/ExactTarget/fuelux.png?branch=master)](http://travis-ci.org/ExactTarget/fuelux)

_Base FuelUX styles and controls_

**_FuelUX is under development in preparation for initial release and is not yet intended for production use._**

FuelUX extends Twitter Bootstrap with additional lightweight JavaScript controls and provides simple workflows for installation into web projects, customization, update management, and deployment optimization.

## Features

FuelUX provides all of the styles and plugins from the revolutionary [Twitter Bootstrap](http://twitter.github.com/bootstrap) project, with the following additions:

* One-step installation and updates through [volo](https://github.com/volojs/volo)
* [AMD](http://requirejs.org/docs/whyamd.html) compatibility for modular structure and deployment optimization
* [Grunt](https://github.com/cowboy/grunt)-based build script to easily create custom distribution files
* Namespaced CSS (just add a `fuelux` class) for safe use on existing sites
* Additional FuelUX controls (with unit tests)
  * Combobox - _combines input and dropdown for easy and flexible data selection_
  * Pillbox - _manages selected items with color-coded text labels_
  * Datagrid - _renders data in a table with paging, sorting, and serching_
  * Search control - _combines input and button for integrated search interaction_

## Getting Started
* `git clone git://github.com/ExactTarget/fuelux.git`
* Default FuelUX files for production use are located in the [dist](https://github.com/ExactTarget/fuelux/tree/master/dist) directory
* To customize, modify the JS and LESS files under [src](https://github.com/ExactTarget/fuelux/tree/master/src) then run `grunt` to regenerate your [dist](https://github.com/ExactTarget/fuelux/tree/master/dist) directory (more below)

## Documentation and Examples
_(Under development)_

## Release History
`2.0.0` _(Under development)_ First public release of FuelUX

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

### Important notes
Please don't edit files in the `dist` directory as they are generated via grunt. You'll find source code in the `src` directory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.

More about [Installing grunt and PhantomJS](https://github.com/ExactTarget/fuelux/wiki/Installing-grunt-and-PhantomJS)

## The FuelUX Philosophy

Our aim is to provide a suite of related but independent projects that help web developers integrate, manage, and customize quality libraries and utilities to more efficiently develop, maintain, test, and distribute their projects.  Any improvements or fixes we make to the open source projects we use will be contributed upstream if they are useful to the rest of the community.

## Acknowledgements

We are grateful to the maintainers, contributors, and sponsors of the following technologies which make FuelUX possible:

* [jQuery](http://jquery.com) (Library for DOM, events, animation, and AJAX)

* [Twitter Bootstrap](http://twitter.github.com/bootstrap) (Modern UI components and interactions)

* [LESS](http://lesscss.org) and [recess](http://twitter.github.com/recess) (Stylesheet definition and management)

* [RequireJS](http://requirejs.org) and [volo](https://github.com/volojs/volo) (Tools for managing modular JavaScript)

* [grunt](https://github.com/cowboy/grunt) (Build tool for JavaScript projects)

##Authors

**Adam Alexander**

+ http://twitter.com/adamalex
+ http://github.com/adamalex

**Matt Beard**

+ http://github.com/mbeard

**Bryan Kohlmeier**

+ http://github.com/bkohlmeier

**Kevin Parkerson**

+ http://github.com/kevinparkerson

**Christopher McCulloh**

+ http://github.com/cmcculloh

## Copyright and license

Copyright (c) 2012 ExactTarget

Licensed under the MIT License (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the COPYING file.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.