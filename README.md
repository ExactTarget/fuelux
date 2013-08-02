[![Fuel UX](https://s3.amazonaws.com/fuelux/logo-gray.png)](http://exacttarget.github.com/fuelux)

Fuel UX extends Twitter Bootstrap with additional lightweight JavaScript controls.
Other benefits include easy installation into web projects, integrated scripts for customizing Bootstrap and Fuel UX,
simple updates, and solid optimization for deployment. All functionality is covered by live documentation and unit tests.

[![Selenium Test Status](https://saucelabs.com/buildstatus/fuelux)](https://saucelabs.com/u/fuelux)

[![Build Status](https://secure.travis-ci.org/ExactTarget/fuelux.png?branch=master)](http://travis-ci.org/ExactTarget/fuelux)

## Features

Fuel UX provides all of the styles and plugins from the revolutionary [Twitter Bootstrap](http://twitter.github.com/bootstrap) project, with the following additions:

* Fuel UX JavaScript controls (with unit tests) [see them live](http://exacttarget.github.com/fuelux)
  * Checkbox - _consistent cross-browser cross-platform look and feel for checkbox elements_
  * Combobox - _combines input and dropdown for easy and flexible data selection_
  * Datagrid - _renders data in a table with paging, sorting, and searching_
  * Pillbox - _manages selected items with color-coded text labels_
  * Radio - _consistent cross-browser cross-platform look and feel for radio elements_
  * Search - _combines input and button for integrated search interaction_
  * Select - _extends button dropdown with the ability to set and retrieve the selected item_
  * Spinner - _provides convenient numeric input with increment and decrement buttons_
  * Tree - _renders data in a tree, supporting caching and optional multi-selection_
  * Wizard - _displays a multi-step process to be completed in a specific order_
<p>
* One-step installation and updates through [volo](https://github.com/volojs/volo)
* [AMD](http://requirejs.org/docs/whyamd.html) compatibility for modular structure and deployment optimization
* [Grunt](https://github.com/cowboy/grunt)-based build script to easily create custom distribution files
* Namespaced CSS (just add a `fuelux` class) for safe use on existing sites

## Getting Started
* `git clone git://github.com/ExactTarget/fuelux.git`
* Default Fuel UX files for production use are located in the [dist](https://github.com/ExactTarget/fuelux/tree/master/dist) directory
* To customize, modify the JS and LESS files under [src](https://github.com/ExactTarget/fuelux/tree/master/src) then run `grunt` to regenerate your [dist](https://github.com/ExactTarget/fuelux/tree/master/dist) directory (more below)

## Documentation and Examples

### Live docs and demos

Hosted on GitHub pages: http://exacttarget.github.com/fuelux

### Rich documentation

Hosted on our [Developer Community](http://code.exacttarget.com/devcenter/home): http://code.exacttarget.com/devcenter/fuel-ux

## Issues and Feature Requests

### Search for or report a bug

Use GitHub issues: https://github.com/ExactTarget/fuelux/issues

### View the roadmap and suggest new ideas

Visit our UserVoice community: https://fuelux.uservoice.com

## Release History

_Fuel UX is semantically versioned: <http://semver.org>_

### Version 2.3.1 `2013-08-02`

* Reset datagrid to first page on filter change
* Fix datagrid operation inside HTML form
* Fix datagrid header wrapping for narrow columns
* Improve datagrid class specificity for inner controls
* Fix datagrid race condition with next and previous buttons
* Improve datagrid fault tolerance around paging operations
* Improve sample datasource to handle null values when searching
* Fix select control value selection when value contains spaces
* Fix checkbox operation inside datagrid
* Fix checkbox operation inside form-inline
* Fix checkbox operation for IE8
* Fix tree text wrapping issue
* Fix spinner issue when passing a string as a value
* Fix button group operation inside wizard step
* Backport tooltip options fix from Bootstrap 3
* Upgrade Bootstrap from 2.3.0 to 2.3.2

### Version 2.3.0 `2013-02-18`

* Add custom filter support to datagrid
* Use select control for datagrid page size dropdown
* Add stepclick event to wizard to support canceling clicks on steps
* Improve rounded corners of combobox button to match Bootstrap
* Improve support for installation within Yeoman
* Upgrade Bootstrap from 2.2.2 to 2.3.0

### Version 2.2.1 `2013-02-13`

* Fix whitespace issue in wizard
* Improve encapsulation of AMD globals
* Introduce Testem for cross-browser testing
* Fix tree datasource reference for local development
* Upgrade unit tests to be compatible with jQuery 1.9

### Version 2.2.0 `2013-01-04`

* _New Control_ - checkbox
* _New Control_ - radio
* _New Control_ - select
* _New Control_ - tree
* _New Control_ - wizard
* Add stretchHeight option to datagrid
* Add reload method to datagrid
* Add enable and disable methods to search control
* Add enable and disable methods to combobox
* Add rich methods for getting/setting selected item to combobox
* Fix triggering of superfluous spinner events
* Upgrade Bootstrap from 2.2.1 to 2.2.2

### Version 2.1.1 `2012-11-10`

* Allow setting spinner value to zero
* Fix search control keyboard operation in IE8

### Version 2.1.0 `2012-10-31`

* Upgrade Bootstrap from 2.1.1 to 2.2.1

### Version 2.0.2 `2012-10-30`

* Ignore click on disabled search button
* Make cursor consistent on disabled spinner buttons
* Improve live docs to show disabled states where available
* Complete datagrid unit test coverage

### Version 2.0.1 `2012-10-05`

* Fix loader.js (used for non-AMD pages) to be synchronous

### Version 2.0.0 `2012-09-28`

* First public release of Fuel UX

## Contributing
Before writing code, we suggest you [search for issues](https://github.com/ExactTarget/fuelux/issues?state=open)
or [create a new one](https://github.com/ExactTarget/fuelux/issues/new) to confirm where your contribution fits into
our roadmap.

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

More about [Contributing to Fuel UX](https://github.com/ExactTarget/fuelux/wiki/Contributing-to-Fuel-UX)

### Important notes
Please don't edit files in the `dist` directory as they are generated via grunt. You'll find source code in the `src` directory!

While grunt can run the included unit tests via PhantomJS, this isn't a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in real browsers as well.

More about [Installing grunt and PhantomJS](https://github.com/ExactTarget/fuelux/wiki/Installing-grunt-and-PhantomJS)

## The Fuel UX Philosophy

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

**David Waltz**

+ https://github.com/dwaltz

**Dustin McCormick**

+ http://twitter.com/djmccormick
+ http://github.com/djmccormick

**Scott Plumlee**

+ http://twitter.com/scottplumlee
+ http://github.com/plumlee

**Marvin Pribble**

+ http://github.com/marvinpribble

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

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/8b519d39e18063752f24876583a6526b "githalytics.com")](http://githalytics.com/ExactTarget/fuelux)
