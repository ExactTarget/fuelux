#[Fuel UX](http://getfuelux.com/)
[![slack channel](https://fuelux-slack.herokuapp.com/badge.svg)](https://fuelux-slack.herokuapp.com/)
[![Bower version](https://badge.fury.io/bo/fuelux.svg)](http://badge.fury.io/bo/fuelux)
[![npm version](https://badge.fury.io/js/fuelux.svg)](https://www.npmjs.com/package/fuelux)
[![Build Status](https://api.travis-ci.org/ExactTarget/fuelux.svg?branch=master)](http://travis-ci.org/ExactTarget/fuelux)
[![devDependency Status](https://david-dm.org/exacttarget/fuelux/dev-status.svg)](https://david-dm.org/exacttarget/fuelux#info=devDependencies)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/fuelux.svg)](https://saucelabs.com/u/fuelux)

Fuel UX extends [Bootstrap 3](https://github.com/twbs/bootstrap) with additional lightweight JavaScript controls. It is actively maintained by [members of Salesforce Marketing Cloud,](https://github.com/orgs/ExactTarget/people) with the support and involvement of the community.

To get started, check out <http://getfuelux.com>!

## Table of contents

 * [Using](#using)
 * [Bugs and feature requests](#bugs-and-feature-requests)
 * [Documentation](#documentation)
 * [Contributing](#contributing)
 * [Developing](#developing)
 * [Community](#community)
 * [Copyright and license](#copyright-and-license)

## Using

Fuel UX can be used with an existing page via CDN or installed in a project.

Read the [Getting started page](http://getfuelux.com/getting-started.html) for more detailed information on the framework contents, templates, examples, and more.

### Use

Add `fuelux` class to the portion of the page using Fuel UX as seen [here](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#using-fuel-ux).

Ensure all the dependencies are included on the page (eg, such as using the CDN as shown below).
```
<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
<link href="//www.fuelcdn.com/fuelux/3.13.0/css/fuelux.min.css" rel="stylesheet">

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.1/js/bootstrap.min.js"></script>
<script src="//www.fuelcdn.com/fuelux/3.13.0/js/fuelux.min.js"></script>

```

#### The code you want is in `dist`
A few ways available to install.

- Request files from [the Fuel UX CDN](http://www.fuelcdn.com/fuelux/3.13.0/)
- Install with [NPM](https://www.npmjs.com/package/fuelux): `npm install fuelux`.
- [Download the latest release](https://github.com/exacttarget/fuelux/archive/3.4.0.zip).
- Clone the repo: `git clone https://github.com/exacttarget/fuelux.git`.
- Install with [Bower](http://bower.io): `bower install fuelux`.
- Install with [Volo](https://github.com/volojs/volo): `volo add fuelux`.

More details for the above can be found [here](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#downloading-code).

#### What's included

We provide compiled CSS and JS (like `fuelux.*`), as well as compiled and minified CSS and JS (like `fuelux.min.*`) in the `dist` folder. Supporting icons are provided as fonts.
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
### Before writing code
* [confirm issue is new](https://github.com/ExactTarget/fuelux/issues), if not, get involved in previous report of issue.
* [create a new issue](https://github.com/ExactTarget/fuelux/issues/new) to confirm where your contribution fits into
our roadmap.

### Writing code
* Do not edit or commit files in the `dist` directory. *Project maintainers will commit files in the `dist` directory from time to time. Details on compiling CSS and JavasScript can be found [here](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#compiling-code).*
* Source files are in respective `js`, `less`, and `fonts` directories. 
* Conform to [Salesforce Marketing Cloud style guide](https://github.com/ExactTarget/javascript).
* Add and/or update unit tests for any new or changed functionality.
* Test your code at [http://localhost:8000/](http://localhost:8000/). (start using `grunt servefast`)
* Run unit tests with `grunt test` or in browser at [http://localhost:8000/test/](http://localhost:8000/test/) (you'll need to `grunt servefast` to keep server from quitting on failed unit tests to troubleshoot in browser).

### Submitting Pull Requests
All pull requests are validated via [Travis CI](https://travis-ci.org/). If the tests fail and you feel it is a Travis issue, you can [trigger a restart](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#travis-ci).

While grunt can run the included unit tests via PhantomJS, this isn't a substitute for running tests across a variety of browsers and environments. Please be sure to test in as many of the browsers listed in `sauce_browsers.yml` as you can before contributing.

* Run `grunt` to lint & test your code.
* Write meaningful commit messages.
* Submit a pull request from your github fork, mentioning the issue your changes fix.
* Follow your pull request answering questions and making adjustments as appropriate until it is merged.

Read more about [contributing to FuelUX](https://github.com/ExactTarget/fuelux/wiki/Contributing-to-Fuel-UX)

## Community

- Implementation help may be found at Stack Overflow (tagged [`fuelux`](http://stackoverflow.com/questions/tagged/fuelux)).
- Follow [@FuelUX on Twitter](https://twitter.com/fuelux).

### Philosophy
Our aim is to provide a suite of related but independent projects that help web developers integrate, manage, and customize quality libraries and utilities to more efficiently develop, maintain, test, and distribute their projects.  Any improvements or fixes we make to the open source projects, we use will be contributed upstream if they are useful to the rest of the community.

|Project Maintainers (a-z) | |
|:----|----:|
|Stephen James | [![tweetllama on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/tweetllama) [![interactivellama on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/interactivellama)|
|Christopher McCulloh | [![@cmcculloh on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/cmcculloh) [![cmcculloh on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/cmcculloh) [![cormacmccarthy on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/cormacmccarthy)|
|Kevin Parkerson  | [![kevinparkerson on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/kevinparkerson) [![kevinparkerson on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/kevinparkerson)|
|Stephen Williams | [![swilliamsui on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/swilliamsui) [![swilliamset on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/swilliamset)|
|Dave Woodward | [![futuremint on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/futuremint) [![futuremint on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/futuremint)|

Special thanks to [major contributors](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#contributors) and [active contributors](https://github.com/ExactTarget/fuelux/graphs/contributors).

And thank you to all those that have submitted issues and contributed to this library.

## Copyright and License

Copyright &copy; 2012-2014 Salesforce Marketing Cloud, Inc.

View [BSD-3 license](https://github.com/ExactTarget/fuelux/blob/master/LICENSE).
