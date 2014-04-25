[![Fuel UX](https://s3.amazonaws.com/fuelux/logo-gray.png)](http://exacttarget.github.com/fuelux)

Fuel UX extends Twitter Bootstrap with additional lightweight JavaScript controls.
Other benefits include easy installation into web projects, integrated scripts for customizing Bootstrap and FuelUX,
simple updates, and solid optimization for deployment. All functionality is covered by live documentation and unit tests.

[![Selenium Test Status](https://saucelabs.com/browser-matrix/fuelux.svg)](https://saucelabs.com/u/fuelux)

[![Build Status](https://api.travis-ci.org/ExactTarget/fuelux.png?branch=master)](http://travis-ci.org/ExactTarget/fuelux) [![Selenium Test Status](https://saucelabs.com/buildstatus/fuelux)](https://saucelabs.com/u/fuelux) [![devDependency Status](https://david-dm.org/ExactTarget/fuelux/dev-status.svg)](https://david-dm.org/ExactTarget/fuelux#info=devDependencies)

## Features

FuelUX provides all of the styles and plugins from [Twitter Bootstrap](https://github.com/twbs/bootstrap), the most popular front-end framework for developing responsive, mobile first projects on the web, with the following additional JavaScript controls [view the demo](http://exacttarget.github.com/fuelux):

* **Checkbox** - consistent cross-browser cross-platform look and feel for checkbox elements
* **Combobox** - combines input and dropdown for flexible data selection
* **Datepicker** - combines input and dropdown to select a date
* **Infinite Scroll** - Load content when reaching a set amount of content read or with a call to action
* **Intelligent Dropdown** - Dropdown that decide whether it should be placed above or below the clicked element as well as force position. 
* **Loader** - fully css-driven loading animation for visual indication of wait times
* **Pillbox** - manage tags with color-coded text labels
* **Radio** - consistent cross-browser cross-platform look and feel for radio elements
* **Repeater** - A scrollable, sortable, searchable interface for data (replaces datagrid)
* **Repeater Views** - Use the provided views to customize a list of data or write your own
* **Scheduler** - composite form control to quickly schedule events
* **Search** - input for integrated search
* **Selectlist** - extends button dropdown with the ability to set and retrieve the selected item
* **Spinbox** - provides convenient numeric input with increment and decrement buttons
* **Tree** - renders data in a tree, supporting caching and optional multi-selection
* **Wizard** - displays a multi-step process to be completed in a specific order

####With the following benefits

* **One-step installation** and dependency installation via [Bower](https://github.com/bower/bower), the front-end package manager.
* **Use only what you need.** FuelUX javascript components are wrapped in UMD (Universal Module Definition) which are modules patterns that work everywhere whether you are using [AMD](http://requirejs.org/docs/whyamd.html) or just `<script>` tags. However, AMD provides support for a modular structure and deployment optimization.
* **Create your own custom distribution files** Generate your own `dist` fodler with [Grunt](https://github.com/cowboy/grunt)-based build tasks.
* **Namespaced CSS** (just add a `fuelux` parent class) for safe use on existing sites.
* Include [moment.js](https://github.com/moment/moment) for additional date functionality.

## Getting Started

### Bower

You can install FuelUX and it's dependencies with [Bower](https://github.com/bower/bower). `bower install fuelux`

### Git

* `git clone git://github.com/ExactTarget/fuelux.git`
* Default FuelUX files for production use are located in the [dist](https://github.com/ExactTarget/fuelux/tree/master/dist) directory
* To customize, modify the [Javascript folder](https://github.com/ExactTarget/fuelux/tree/master/js) and the [LESS folder](https://github.com/ExactTarget/fuelux/tree/master/less), then run `grunt` for the default task to regenerate your [dist](https://github.com/ExactTarget/fuelux/tree/master/dist) directory.

### AMD

If using AMD (such as [RequireJS](http://require.js.org)) reference the FuelUX directory in your paths configuration, wherever it is located:
```javascript
require.config({
    paths: {
        'fuelux': 'http://www.fuelcdn.com/fuelux/3.0.0/'
        //...
    }
});
```
Then list any individual fuelux controls needed as dependencies within your application modules:
```javascript
define(function(require) {
	var spinbox = require('fuelux/spinbox');
	//...
});
```
Alternatively, 'fuelux/all' can be used as a dependency of dependencies to bring in all available controls at once.

### Non-AMD (Browser globals)

FuelUX no longer requires a loader AMD shim. It uses [UMD](https://github.com/umdjs/umd/blob/master/jqueryPlugin.js) wrapping. Be sure to put modules in the correct order.

## Documentation and Examples

### Live docs and demos

View [live documentation and demos](http://exacttarget.github.com/fuelux) on GitHub pages.

### Rich documentation

View [FuelUX documentation](http://code.exacttarget.com/devcenter/fuel-ux) on our [Developer Community](http://code.exacttarget.com/devcenter/home)

## Issues and Feature Requests

### Search for questions tagged "FuelUX" on our developer community

Visit [questions tagged FuelUX](https://code.exacttarget.com/tags/fuelux) in our [ExactTarget Developer Community](https://code.exacttarget.com/).

### Search for or report a bug

Use [GitHub issues](https://github.com/ExactTarget/fuelux/issues) to report bugs.

### View the roadmap and suggest new ideas

Visit our [UserVoice community](https://fuelux.uservoice.com) and post a comment.

## Release History

FuelUX is [semantically versioned](http://semver.org). View the [release history ](https://github.com/ExactTarget/fuelux/wiki/Release-History) to learn more.


## Contributing
Before writing code, we suggest you [search for issues](https://github.com/ExactTarget/fuelux/issues?state=open)
or [create a new one](https://github.com/ExactTarget/fuelux/issues/new) to confirm where your contribution fits into
our roadmap.

In lieu of a formal style guide, take care to maintain the existing coding style: tabs, clarity over conciseness, etc. Be sure to add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

More about [Contributing to FuelUX](https://github.com/ExactTarget/fuelux/wiki/Contributing-to-Fuel-UX)

### Important notes
Please do not edit files in the `dist` directory as they are generated via grunt. You'll find source code in the respective `js`, `less`, and `fonts` directory.

While grunt can run the included unit tests via PhantomJS, this isn't a substitute for running tests across a variety of browsers and environments. Please be sure to view the test page at [http://localhost:8000/test/](http://localhost:8000/test/) in as many of the browsers listed in `\sauce_browsers.yml` as you can before contributing.

More about [Installing grunt and PhantomJS](https://github.com/ExactTarget/fuelux/wiki/Installing-grunt-and-PhantomJS)

## The FuelUX Philosophy

Our aim is to provide a suite of related but independent projects that help web developers integrate, manage, and customize quality libraries and utilities to more efficiently develop, maintain, test, and distribute their projects.  Any improvements or fixes we make to the open source projects we use will be contributed upstream if they are useful to the rest of the community.


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

**Stephen James**

+ http://twitter.com/tweetllama
+ http://github.com/interactivellama

**Christopher McCulloh**

+ http://github.com/cmcculloh

**David Waltz**

+ https://github.com/dwaltz

**Dustin McCormick**

+ http://twitter.com/djmccormick
+ http://github.com/djmccormick

**Alex Vernacchia**

+ http://twitter.com/vernacchia
+ http://github.com/vernak2539

**Scott Plumlee**

+ http://twitter.com/scottplumlee
+ http://github.com/plumlee

**Marvin Pribble**

+ http://github.com/marvinpribble

**Ryan Moore**

+ http://github.com/rbmoore

**Steven Rogers**

+ http://github.com/soldoutactivist

And thank you to all those that have submitted issues and contributed to this library.

## Acknowledgements

We are grateful to the maintainers, contributors, and sponsors of the following technologies which make FuelUX possible:

* [jQuery](http://jquery.com) (Library for DOM, events, animation, and AJAX)

* [Twitter Bootstrap](https://github.com/twbs/bootstrap) (Modern UI components and interactions)

* [LESS](http://lesscss.org) and [recess](http://twitter.github.com/recess) (Stylesheet definition and management)

* [RequireJS](http://requirejs.org) and [volo](https://github.com/volojs/volo) (Tools for managing modular JavaScript)

* [grunt](https://github.com/cowboy/grunt) (Build tool for JavaScript projects)

## Copyright and license

Copyright &copy; 2014 ExactTarget.

Licensed under the MIT License (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the COPYING file.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/8b519d39e18063752f24876583a6526b "githalytics.com")](http://githalytics.com/ExactTarget/fuelux)
