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
  * Datepicker - _combines input and dropdown for easy selection of dates_
  * Pillbox - _manages selected items with color-coded text labels_
  * Radio - _consistent cross-browser cross-platform look and feel for radio elements_
  * Search - _combines input and button for integrated search interaction_
  * Select - _extends button dropdown with the ability to set and retrieve the selected item_
  * Spinner - _provides convenient numeric input with increment and decrement buttons_
  * Tree - _renders data in a tree, supporting caching and optional multi-selection_
  * Wizard - _displays a multi-step process to be completed in a specific order_
<p>
* Smart Dropdowns - _dropdown automatically decides whether it should be placed above or below the clicked element (can also force position). Add `data-direction="auto|up|down"` to element that has `data-toggle="dropdown"`_

* One-step installation and updates through [volo](https://github.com/volojs/volo)
* [AMD](http://requirejs.org/docs/whyamd.html) compatibility for modular structure and deployment optimization
* [Grunt](https://github.com/cowboy/grunt)-based build script to easily create custom distribution files
* Namespaced CSS (just add a `fuelux` class) for safe use on existing sites

## Getting Started

### volo

You can install FuelUX using volo. You will want to pass the `-amdoff` flag to volo to tell it not to try and amdify the project:

`volo add -amdoff fuelux`

### Git

* `git clone git://github.com/ExactTarget/fuelux.git`
* Default Fuel UX files for production use are located in the [dist](https://github.com/ExactTarget/fuelux/tree/master/dist) directory
* To customize, modify the JS and LESS files under [src](https://github.com/ExactTarget/fuelux/tree/master/src) then run `grunt` to regenerate your [dist](https://github.com/ExactTarget/fuelux/tree/master/dist) directory (more below)

### Styles
Be sure to add the fuelux stylesheet to your page's head tag, along with the responsive stylesheet if desired:
```html
<link href="//www.fuelcdn.com/fuelux/2.4.1/css/fuelux.min.css" rel="stylesheet" type="text/css">
<link href="//www.fuelcdn.com/fuelux/2.4.1/css/fuelux-responsive.css" rel="stylesheet" type="text/css">
```

### AMD

If using AMD (such as [RequireJS](http://require.js.org)) reference the fuelux directory in your paths configuration, wherever it is located:
```javascript
require.config({
    paths: {
        'fuelux': 'http://www.fuelcdn.com/fuelux/2.4.1/'
        //...
    }
});
```
Then list any individual fuelux controls needed as dependencies within your application modules:
```javascript
define(function(require) {
	var spinner = require('fuelux/spinner');
	//...
});
```
Alternatively, 'fuelux/all' can be used as a dependency to bring in all available controls at once.

### Non-AMD

If you'd prefer not to use AMD, simply add the loader script to the head tag of your page:
```html
<script src="http://www.fuelcdn.com/fuelux/2.4.1/loader.min.js" type="text/javascript"></script>
```

## Documentation and Examples

### Live docs and demos

Hosted on GitHub pages: http://exacttarget.github.com/fuelux

### Rich documentation

Hosted on our [Developer Community](http://code.exacttarget.com/devcenter/home): http://code.exacttarget.com/devcenter/fuel-ux

## Issues and Feature Requests

### Search for questions tagged "Fuel UX" on our developer community

https://code.exacttarget.com/tags/fuelux

### Search for or report a bug

Use GitHub issues: https://github.com/ExactTarget/fuelux/issues

### View the roadmap and suggest new ideas

Visit our UserVoice community: https://fuelux.uservoice.com

## Release History

_Fuel UX is semantically versioned: <http://semver.org>_

Release history can be found [here](https://github.com/ExactTarget/fuelux/wiki/Release-History).


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
