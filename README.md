#[Fuel UX](http://getfuelux.com/)
[![Bower version](https://badge.fury.io/bo/fuelux.svg)](http://badge.fury.io/bo/fuelux)
[![Build Status](https://api.travis-ci.org/ExactTarget/fuelux.png?branch=master)](http://travis-ci.org/ExactTarget/fuelux)
[![devDependency Status](https://david-dm.org/exacttarget/fuelux/dev-status.svg)](https://david-dm.org/exacttarget/fuelux#info=devDependencies)
[![Selenium Test Status](https://saucelabs.com/browser-matrix/fuelux.svg)](https://saucelabs.com/u/fuelux)

Fuel UX extends [Bootstrap 3](https://github.com/twbs/bootstrap) with additional lightweight JavaScript controls. It is actively maintained by [members of ExactTarget, a salesforce.com company,](https://github.com/orgs/ExactTarget/people) with the support and involvement of the community.

All functionality is covered by the [live documentation](http://getfuelux.com/) and [unit tests](#automated-testing-status).

## Table of contents

 * [Quick Start](#quick-start)
 * [Documentation](#documentation)
 * [Bugs and Feature Requests](#bugs-and-feature-requests)
 * [Grunting](#grunting)
 * [Contributing](#contributing)
 * [Developing](#developing)
 * [Philosophy and Authors](#philosophy-and-authors)
 * [Copyright and License](#copyright-and-license)

## [Quick Start](http://getfuelux.com/getting-started.html#quickstart)

Get Fuel UX by doing one of the following:

- [Reference on the CDN](http://www.fuelcdn.com/fuelux/3.1.0/)
- Clone the repo: `git clone https://github.com/ExactTarget/fuelux`
- Install with [Bower](http://bower.io): `bower install fuelux`
- Install with [volo](https://github.com/volojs/volo): `volo add fuelux`
- [Download the latest release](http://www.fuelcdn.com/fuelux/3.1.0/fuelux.zip)

## Documentation

### Live Docs and Demos

View [live documentation and demos](http://getfuelux.com) for more in-depth getting started guide and documentation.

### Dependencies
Fuel UX is dependent upon [Bootstrap 3](https://github.com/twbs/bootstrap) and [jQuery](https://github.com/jquery/jquery). If you installed by cloning the repo or by downloading a .zip archive, you'll also want to grab these things, as it just won't work without them.
- [jQuery](https://github.com/jquery/jquery)
- [Bootstrap 3](https://github.com/twbs/bootstrap)


### What's Included

Downloading the zip of FuelUX provides the following directories and files, which are grouped according to file type:
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
In the git repo, we provide compiled CSS and JS (like `fuelux.*`), as well as compiled and minified CSS and JS (like `fuelux.min.*`) in the `dist` folder.

### UMD/AMD Support

We recommend only loading the controls you need (eg `fuelux/checkbox`).

If using AMD (such as [RequireJS](http://requirejs.org)), reference the FuelUX directory in your paths configuration, wherever it is located:
```javascript
require.config({
    paths: {
        'fuelux': 'http://www.fuelcdn.com/fuelux/3.1.0/'
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
In instances where you require every module from fuel ux, you can use <code>fuelux/all</code> instead of listing each module individually.

Fuel UX also supports placing components in their own <code>&lt;script&gt;</code> tags. Be sure to <a href="http://getfuelux.com/javascript.html">check component dependencies in the controls documentation</a> and put modules in the correct order if you load them in this method. Errors will appear in the console if you have not loaded dependencies correctly (<a href="http://getfuelux.com/javascript.html#repeater-dependencies">Repeater</a> <a href="http://getfuelux.com/javascript.html#scheduler-dependencies">Scheduler</a> are the only components with dependencies currently).

## Bugs and Feature Requests

Have a bug or a feature request? Please first review the [open issues](https://github.com/ExactTarget/fuelux/issues), then search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/ExactTarget/fuelux/issues/new).

You can visit [Code@](https://code.exacttarget.com/) for general information and search [FuelUX tagged questions on StackOverflow](http://stackoverflow.com/questions/tagged/fuelux).

### Previous Releases


[Documentation for v2.6](http://getfuelux.com/2.6/) has been made available for the time being while folks transition to Bootstrap 3. You can download 2.6 updates (bug fixes only) from the [fuelux2 branch](https://github.com/ExactTarget/fuelux/tree/fuelux2).

## Grunting

FuelUX is lightweight to give you a fast dependable foundation to build upon. It uses [Grunt](http://gruntjs.com/) with convenient methods for working with the library. It's how we compile our code, run tests, and more. To use it, install the required dependencies as directed, and then run some Grunt tasks.

### Install Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Make sure you're in the root of the fuel directory, then run `npm install`. npm will look at [package.json](https://github.com/exacttarget/fuelux/blob/master/package.json) and automatically install the necessary local dependencies listed there.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with npm? Don't have node installed?** npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Grunt Tasks

Run `grunt --help` or [check out the Gruntfile](https://github.com/ExactTarget/fuelux/blob/master/Gruntfile.js) to see all possible grunt tasks. When contributing, these are the two grunt tasks you will be most likely to use:

#### Testing - `grunt`
Run `grunt` to run tests locally. Runs against JSHint and QUnit and starts a node express server to allow for visual testing.

#### Serving - `grunt serve`
Starts a watched server and runs basic test (JSHint, simplified QUnit) as well as does validation testing.

#### Compiling - `grunt release`
_If you have forked the repo for personal use, you will also probably find this tasks useful._

This builds the dist directory (compiling your CSS and JS). If you are going to issue a pull request, you should not include changes to the dist directory that are generated from this grunt task.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Contributing
Before writing code, we suggest you [search for issues](https://github.com/ExactTarget/fuelux/issues?state=open) or [create a new one](https://github.com/ExactTarget/fuelux/issues/new) to confirm where your contribution fits into
our roadmap.

Please do not edit or commit files in the `dist` directory. You'll find source files in the respective `js`, `less`, and `fonts` directory. Project maintainers will commit files in the `dist` directory from time to time.

Prior to submitting a pull request, please run `grunt` to lint & test your code.

Take care to maintain the existing coding style (tabs, clarity over brevity, declarative markup, semicolons, etc).

Please review the [ExactTarget JavaScript style guide](https://github.com/ExactTarget/javascript) if you have any questions.

## Developing

Be sure to add unit tests for any new or changed functionality.

To serve the test page and lint your changes run `grunt serve` while developing. View the test page at [http://localhost:8000/test/](http://localhost:8000/test/). The `serve` task will run lint and unit tests against saved code.

While grunt can run the included unit tests via PhantomJS, this isn't a substitute for running tests across a variety of browsers and environments. Please be sure to test in as many of the browsers listed in `sauce_browsers.yml` as you can before contributing.

Read more about [contributing to FuelUX](https://github.com/ExactTarget/fuelux/wiki/Contributing-to-Fuel-UX)

##Philosophy and Authors

### The Fuel UX Philosophy
Our aim is to provide a suite of related but independent projects that help web developers integrate, manage, and customize quality libraries and utilities to more efficiently develop, maintain, test, and distribute their projects.  Any improvements or fixes we make to the open source projects, we use will be contributed upstream if they are useful to the rest of the community.

|Project Maintainers (a-z)&nbsp;&nbsp;&nbsp;&nbsp; | |
|:----|----:|
|Stephen James | [![tweetllama on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/tweetllama) [![interactivellama on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/interactivellama)|
|Kevin Parkerson  | [![kevinparkerson on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/kevinparkerson) [![kevinparkerson on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/kevinparkerson)|
|Dave Woodward | [![futuremint on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/futuremint) [![futuremint on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/futuremint)|


|Major Contributors (a-z)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | |
|:----|----:|
|Matt Beard |[![mbeard on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/mbeard) |
|Bryan Kohlmeier |[![bkohlmeier on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/bkohlmeier) |
|Dustin McCormick | [![djmccormick on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/djmccormick) [![djmccormick on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/djmccormick)|
|Christopher McCulloh | [![@cmcculloh on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/cmcculloh) [![cormacmccarthy on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/cormacmccarthy) [![cmcculloh on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/cmcculloh)|
|Ryan Moore | [![rbmoore on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/rbmoore)|
|Scott Plumlee | [![scottplumlee on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/scottplumlee) [![plumlee on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/plumlee)|
|Marvin Pribble | [![marvinpribble on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/marvinpribble)|
|Steven Rogers | [![soldoutactivist on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/soldoutactivist)|
|*Alex Vernacchia (current)* | [![vernacchia on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/vernacchia) [![vernak2539 on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/vernak2539)|
|*David Waltz (current)* | [![dwaltz on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/dwaltz)|

|Original Author&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | |
|:----|----:|
|Adam Alexander |[![adamalex on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/adamalex) [![adamalex on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/adamalex) |

And thank you to all those that have submitted issues and contributed to this library.

## Copyright and License

Copyright &copy; 2012-2014 ExactTarget, Inc.

View [BSD-3 license](https://github.com/ExactTarget/fuelux/blob/master/LICENSE).


[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/8b519d39e18063752f24876583a6526b "githalytics.com")](http://githalytics.com/ExactTarget/fuelux)
