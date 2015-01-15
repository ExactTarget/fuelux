#[Fuel UX](http://getfuelux.com/)
[![Bower version](https://badge.fury.io/bo/fuelux.svg)](http://badge.fury.io/bo/fuelux)
[![Build Status](https://api.travis-ci.org/ExactTarget/fuelux.png?branch=master)](http://travis-ci.org/ExactTarget/fuelux)
[![devDependency Status](https://david-dm.org/exacttarget/fuelux/dev-status.svg)](https://david-dm.org/exacttarget/fuelux#info=devDependencies)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/fuelux.svg)](https://saucelabs.com/u/fuelux)

Fuel UX extends [Bootstrap 3](https://github.com/twbs/bootstrap) with additional lightweight JavaScript controls. It is actively maintained by [members of Salesforce Marketing Cloud,](https://github.com/orgs/ExactTarget/people) with the support and involvement of the community.

To get started, check out <http://getfuelux.com>!

## Table of contents

 * [Quick start](#quick-start)
 * [Bugs and feature requests](#bugs-and-feature-requests)
 * [Documentation](#documentation)
 * [Contributing](#contributing)
 * [Developing](#developing)
 * [Community](#community)
 * [Copyright and license](#copyright-and-license)

## Quick start

Fuel UX can be used with an existing page via CDN or installed in a project.

Read the [Getting started page](http://getfuelux.com/getting-started.html) for more detailed information on the framework contents, templates, examples, and more.

### Use

Add `fuelux` class to the portion of the page using Fuel UX as seen [here](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#using-fuel-ux).

Ensure all the dependencies are included on the page (eg, such as using the CDN as shown below).
```
<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
<link href="//www.fuelcdn.com/fuelux/3.5.0/css/fuelux.min.css" rel="stylesheet">

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.1/js/bootstrap.min.js"></script>
<script src="//www.fuelcdn.com/fuelux/3.5.0/js/fuelux.min.js"></script>

```

### Install
A few ways available to install.

- Request files from [the Fuel UX CDN](http://www.fuelcdn.com/fuelux/3.5.0/)
- [Download the latest release](https://github.com/exacttarget/fuelux/archive/3.4.0.zip).
- Clone the repo: `git clone https://github.com/exacttarget/fuelux.git`.
- Install with [Bower](http://bower.io): `bower install fuelux`.
- Install with [Volo](https://github.com/volojs/volo): `volo add fuelux`.

More details for the above can be found [here](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#downloading-code).

#### What's included

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
We provide compiled CSS and JS (like `fuelux.*`), as well as compiled and minified CSS and JS (like `fuelux.min.*`) in the `dist` folder. Supporting icons are provided as fonts.

### Dependencies
Fuel UX is dependent upon [Bootstrap 3](https://github.com/twbs/bootstrap) and [jQuery](https://github.com/jquery/jquery). If you installed by cloning the repo or by downloading a .zip archive, you'll also want to grab these things, as it won't work without them.
- [jQuery](https://github.com/jquery/jquery)
- [Bootstrap 3](https://github.com/twbs/bootstrap)

For other methods of managing dependencies consider [AMD support via require](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#umd/amd-support).

## Bugs and Feature Requests

Have a bug or a feature request? Please first review the [open issues](https://github.com/ExactTarget/fuelux/issues), then search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/ExactTarget/fuelux/issues/new).

For additional assistance connect with the [community](#community).

## Documentation

Fuel UX documentation is built with [Jekyll](http://jekyllrb.com) and publicly hosted on GitHub Pages at <http://getfuelux.com>. More details on seting up Jekyll and running docs locally can be found [here](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#running-docs-locally).

### Previous releases

[Documentation for v2.6](http://getfuelux.com/2.6/) has been made available for the time being while folks transition to Bootstrap 3. You can download 2.6 updates (bug fixes only) from the [fuelux2 branch](https://github.com/ExactTarget/fuelux/tree/fuelux2).

## Contributing
Before writing code, we suggest you [search for issues](https://github.com/ExactTarget/fuelux/issues?state=open) or [create a new one](https://github.com/ExactTarget/fuelux/issues/new) to confirm where your contribution fits into
our roadmap.

Please do not edit or commit files in the `dist` directory. You'll find source files in the respective `js`, `less`, and `fonts` directory. Project maintainers will commit files in the `dist` directory from time to time. Details on compiling CSS and JavasScript can be found [here](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#compiling-code).

Prior to submitting a pull request, please run `grunt` to lint & test your code. All pull requests are validated via [Travis CI](https://travis-ci.org/). If the tests fail unexpectedly feel free to [trigger a restart](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#travis-ci).

Take care to maintain the existing coding style (tabs, clarity over brevity, declarative markup, semicolons, etc).

Please review the [Salesforce Marketing Cloud style guide](https://github.com/ExactTarget/javascript) if you have any questions.

## Developing

Be sure to add unit tests for any new or changed functionality.

To serve the test page and lint your changes run `grunt serve` while developing. View the test page at [http://localhost:8000/test/](http://localhost:8000/test/). The `serve` task will run lint and unit tests against saved code.

While grunt can run the included unit tests via PhantomJS, this isn't a substitute for running tests across a variety of browsers and environments. Please be sure to test in as many of the browsers listed in `sauce_browsers.yml` as you can before contributing.

Read more about [contributing to FuelUX](https://github.com/ExactTarget/fuelux/wiki/Contributing-to-Fuel-UX)

## Community

Keep track of development and community news.

- Fuel UX, API's, and building with other Salesforce Marketing Cloud products visit [Code@](https://code.exacttarget.com/).
- Implementation help may be found at Stack Overflow (tagged [`fuelux`](http://stackoverflow.com/questions/tagged/fuelux)).
- Follow [@EtFuel on Twitter](https://twitter.com/etfuel).

### Philosophy
Our aim is to provide a suite of related but independent projects that help web developers integrate, manage, and customize quality libraries and utilities to more efficiently develop, maintain, test, and distribute their projects.  Any improvements or fixes we make to the open source projects, we use will be contributed upstream if they are useful to the rest of the community.

|Project Maintainers (a-z) | |
|:----|----:|
|Stephen James | [![tweetllama on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/tweetllama) [![interactivellama on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/interactivellama)|
|Kevin Parkerson  | [![kevinparkerson on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/kevinparkerson) [![kevinparkerson on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/kevinparkerson)|
|Stephen Williams | [![swilliamsui on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/swilliamsui) [![swilliamset on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/swilliamset)|
|Dave Woodward | [![futuremint on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/futuremint) [![futuremint on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/futuremint)|

|Creator | |
|:----|----:|
|Adam Alexander | [![adamalex on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/adamalex) [![adamalex on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/adamalex) |

Special thanks to [major contributors](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#contributors) and [active contributors](https://github.com/ExactTarget/fuelux/graphs/contributors).

And thank you to all those that have submitted issues and contributed to this library.

## Copyright and License

Copyright &copy; 2012-2014 Salesforce Marketing Cloud, Inc.

View [BSD-3 license](https://github.com/ExactTarget/fuelux/blob/master/LICENSE).


[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/8b519d39e18063752f24876583a6526b "githalytics.com")](http://githalytics.com/ExactTarget/fuelux)
