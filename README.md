#FuelUX [![Build Status](https://api.travis-ci.org/ExactTarget/fuelux.png?branch=master)](http://travis-ci.org/ExactTarget/fuelux) [![Selenium Test Status](https://saucelabs.com/buildstatus/fuelux)](https://saucelabs.com/u/fuelux) [![devDependency Status](https://david-dm.org/ExactTarget/fuelux/dev-status.svg)](https://david-dm.org/ExactTarget/fuelux#info=devDependencies)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/fuelux.svg)](https://saucelabs.com/u/fuelux)

FuelUX extends [Bootstrap 3](https://github.com/twbs/bootstrap) with additional lightweight JavaScript controls. It is maintained by [members of ExactTarget, a salesforce.com company,](https://github.com/orgs/ExactTarget/members) with the support and involvement of the community.

All functionality is covered by the [live documentation](http://exacttarget.github.com/fuelux) and unit tests.

## Quick start

Do one of the following to start using FuelUX:

* Download the latest release **(need link)**
* Clone the repo `git clone https://github.com/ExactTarget/fuelux/`
* Install with dependencies via [Bower](https://github.com/bower/bower): `bower install fuelux`

[jQuery](http://jquery.com/) and [Bootstrap 3](http://getbootstrap.com/) are required dependencies and are not bundled into this repository.


## What's included

```
fuelux/
├── css/
│   ├── fuelux.css
│   ├── fuelux.min.css
├── js/
│   ├── fuelux.js
│   └── fuelux.min.js
└── fonts/
    ├── fuelux.eot
    ├── fuelux.svg
    ├── fuelux.ttf
    └── fuelux.woff
```

We provide compiled CSS and JS (`bootstrap.*`), as well as compiled and minified CSS and JS (`fuelux.min.*`) and an icon font. If cloning the repo, compiled FuelUX files for production use are located in `/dist/`.

### JavaScript Controls

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
* **Scheduler** - composite form control to quickly schedule events with support for [moment.js](https://github.com/moment/moment)
* **Search** - input for integrated search
* **Selectlist** - extends button dropdown with the ability to set and retrieve the selected item
* **Spinbox** - provides convenient numeric input with increment and decrement buttons
* **Tree** - renders data in a tree, supporting caching and optional multi-selection
* **Wizard** - displays a multi-step process to be completed in a specific order

### UMD/AMD Support

In a hurry? Counting characters over bytes? `fuelux/all` can be loaded to bring in all FuelUX controls via AMD. Though we recommend only loading the controls you need. If using AMD (such as [RequireJS](http://require.js.org)), reference the FuelUX directory in your paths configuration, wherever it is located:
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

On a side note, FuelUX now supports placing components in their own `<script>` tags. Be sure to put modules in the correct order if loading them in this method.

## Bugs and feature requests

Have a bug or a feature request? Please first review the [open issues](https://github.com/ExactTarget/fuelux/issues), then search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/ExactTarget/fuelux/issues/new).

## Documentation

### Live documentation and demos

View the [live documentation and demos](http://exacttarget.github.com/fuelux).

### ExactTarget Developer Community

View [FuelUX documentation](http://code.exacttarget.com/devcenter/fuel-ux) on [Code@](http://code.exacttarget.com/devcenter/home)

### Documentation for previous releases

Documentation for v2.6.x has been made available for the time being at **(need link)** while folks transition to Bootstrap 3.

Previous releases and their documentation are also available for download. **(need link)**

## Compiling CSS and JavaScript

FuelUX is lightweight to give you a fast, dependable foundation to build upon. It uses [Grunt](http://gruntjs.com/) with convenient methods for working with the library. It's how we compile our code, run tests, and more. To use it, install the required dependencies as directed, and then run some Grunt commands.

### Install Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Navigate to the root `/bootstrap` directory, then run `npm install`. npm will look at [package.json](https://github.com/twbs/bootstrap/blob/master/package.json) and automatically install the necessary local dependencies listed there.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with NPM? Don't have node installed?** NPM stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Grunt commands to start with

#### Build - `grunt`
Run `grunt` to run tests locally and compile the CSS and JavaScript into `/dist`. **Uses [Less](http://lesscss.org/) and [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Tests - `grunt test`
Runs [JSHint](http://jshint.com) and [QUnit](http://qunitjs.com/) tests headlessly in [PhantomJS](http://phantomjs.org/) (used for CI).

#### Watch - `grunt watch`
This is a convenience method for watching just Less files and automatically building them whenever you save.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Issues and feature requests

The [issue tracker](https://github.com/ExactTarget/fuelux/issues) is
the preferred channel for bug reports, features requests and submitting pull requests.

You can visit [questions tagged FuelUX](https://code.exacttarget.com/tags/fuelux) in our ExactTarget Developer Community.

You can also visit [UserVoice community](https://fuelux.uservoice.com) and post a comment or suggest features. We will maintain of backlog of feature we are considering adding in a [backlog](https://github.com/ExactTarget/fuelux/blob/3.0.0-wip/BACKLOG.md).

## Contributing
Before writing code, we suggest you [search for issues](https://github.com/ExactTarget/fuelux/issues?state=open) or [create a new one](https://github.com/ExactTarget/fuelux/issues/new) to confirm where your contribution fits into
our roadmap.

In lieu of a formal style guide, take care to maintain the existing coding style: tabs, clarity over conciseness, semicolons, etc. Be sure to add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

Read more about [contributing to FuelUX](https://github.com/ExactTarget/fuelux/wiki/Contributing-to-Fuel-UX)

Please do not edit files in the `dist` directory as they are generated via grunt. You'll find source code in the respective `js`, `less`, and `fonts` directory.

While grunt can run the included unit tests via PhantomJS, this isn't a substitute for running tests across a variety of browsers and environments. Please be sure to view the test page at [http://localhost:8000/test/](http://localhost:8000/test/) in as many of the browsers listed in `\sauce_browsers.yml` as you can before contributing.

## The FuelUX philosophy

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
