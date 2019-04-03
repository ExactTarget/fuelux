<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

Archive Statement:

As of March 2019, this repository is read-only as Salesforce has archived the FuelUX open-source UI framework and will no longer be supported.

Salesforce has introduced a new programming model for the Lightning Component Framework called [Lightning Web Components](https://trailhead.salesforce.com/en/content/learn/projects/quick-start-lightning-web-components) which you are encouraged to check out instead. This programming model is designed for building fast components using modern JavaScript and Web Standards.

-----

- [Sanity Checks](#sanity-checks)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Obtaining Fuel UX](#obtaining-fuel-ux)
	- [NPM](#npm)
	- [Bower](#bower)
	- [Volo](#volo)
	- [Github](#github)
- [Using](#using-fuel-ux)
	- [Required fuelux class](#required-fuelux-class)
	- [Required Dependencies](#required-dependencies)
	- [What's included](#whats-included)
	- [AMD support](#amd-support)
- [Bugs and Feature Requests](#bugs-and-feature-requests)
- [Previous releases](#previous-releases)
- [Community](#community)
- [Philosophy](#philosophy)
	- [Copyright and License](#copyright-and-license)

<!-- /TOC -->

# Sanity Checks

[![Greenkeeper badge](https://badges.greenkeeper.io/ExactTarget/fuelux.svg)](https://greenkeeper.io/)
[Fuel UX](http://getfuelux.com/)
[![Bower version](https://badge.fury.io/bo/fuelux.svg)](http://badge.fury.io/bo/fuelux)
[![npm version](https://badge.fury.io/js/fuelux.svg)](https://www.npmjs.com/package/fuelux)
[![Build Status](https://api.travis-ci.org/ExactTarget/fuelux.svg?branch=master)](http://travis-ci.org/ExactTarget/fuelux)
[![devDependency Status](https://david-dm.org/exacttarget/fuelux/dev-status.svg)](https://david-dm.org/exacttarget/fuelux#info=devDependencies)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/fuelux.svg)](https://saucelabs.com/u/fuelux)

Fuel UX extends [Bootstrap 3](https://github.com/twbs/bootstrap) with additional lightweight JavaScript controls. It is actively maintained by [members of Salesforce Marketing Cloud,](https://github.com/orgs/ExactTarget/people) with the support and involvement of the community.

More thorough documentation and guides available at <http://getfuelux.com>

# Documentation

Fuel UX documentation is built with [Jekyll](http://jekyllrb.com) and publicly hosted on GitHub Pages at <http://getfuelux.com>. More details on setting up Jekyll and running docs locally can be found [in our CONTRIBUTING.md documentation](https://github.com/exacttarget/fuelux/blob/master/CONTRIBUTING.md#running-gh-pages-locally).

# Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) first.

# Obtaining Fuel UX

NPM is the recommended method for obtaining Fuel UX.
```
npm install fuelux
```

You can also use on of the following methods:
- [Bower](https://github.com/bower/bower) `bower install fuelux` (update with `bower update fuelux`).
- [Volo](https://github.com/volojs/volo) `volo add fuelux` (update with `volo add -f fuelux`).
- Clone via git `git clone https://github.com/ExactTarget/fuelux/`
  - Cloning the repository ensures you can apply future updates to Fuel UX easily, but requires to you manage its [dependencies](#dependencies) on your own.
- Download a [.zip archive](http://www.fuelcdn.com/fuelux/3.17.0/fuelux.zip).

# Using Fuel UX

Fuel UX can be used with an existing page via CDN or installed in a project.

Read the [Getting started page](http://getfuelux.com/getting-started.html) for more detailed information on the framework contents, templates, examples, and more.

## Required fuelux class

Add `fuelux` class to the portion of the page using Fuel UX, usually the body.
```
<body class="fuelux">
```

## Required Dependencies
Fuel UX is dependent upon [Bootstrap 3](https://github.com/twbs/bootstrap) and [jQuery](https://github.com/jquery/jquery). If you installed by cloning the repo or by downloading a .zip archive, you'll also want to grab these dependencies, as it won't work without them.
- [jQuery](https://github.com/jquery/jquery)
- [Bootstrap 3](https://github.com/twbs/bootstrap)

For other methods of managing dependencies consider [AMD support via require](#amd-support).

Ensure all the dependencies are included on the page (eg, such as using the CDN as shown below).
```
<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
<link href="//www.fuelcdn.com/fuelux/3.17.0/css/fuelux.min.css" rel="stylesheet">

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.1/js/bootstrap.min.js"></script>
<script src="//www.fuelcdn.com/fuelux/3.17.0/js/fuelux.min.js"></script>

```


## What's included
The code you want is in `dist/`. We provide compiled CSS and JS (like `fuelux.*`), as well as compiled and minified CSS and JS (like `fuelux.min.*`) in the `dist` folder. Icons are provided as fonts.
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


## AMD support

We recommend only loading the controls you need (eg `fuelux/checkbox`).

If using AMD (such as [RequireJS](http://requirejs.org)), reference the FuelUX directory in your paths configuration, wherever it is located:
```javascript
require.config({
    paths: {
        'fuelux': 'http://www.fuelcdn.com/fuelux/3.17.0/'
        //...
    }
});
```
Then list any individual fuel ux controls needed as dependencies within your application modules:
```javascript
define(function(require) {
    var spinbox = require('fuelux/spinbox');
    //...
});
```
In instances where you require every module from Fuel UX, you can use `fuelux/all` instead of listing each module individually.

Fuel UX also supports placing components in their own `<script>` tags. Be sure to [check component dependencies in the controls documentation](http://getfuelux.com/javascript.html) and put modules in the correct order if you load them in this method. Errors will appear in the console if you have not loaded dependencies correctly ((Repeater)[http://getfuelux.com/javascript.html#repeater-dependencies] and [Scheduler](http://getfuelux.com/javascript.html#scheduler-dependencies) are the only components with dependencies currently).


# Bugs and Feature Requests

Have a bug or a feature request? Please first review the [open issues](https://github.com/ExactTarget/fuelux/issues), then search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/ExactTarget/fuelux/issues/new).

For additional assistance connect with the [community](#community).


# Previous releases

[Documentation for v2.6](http://getfuelux.com/2.6/) has been made available for the time being while folks transition to Bootstrap 3. You can download 2.6 updates (bug fixes only) from the [fuelux2 branch](https://github.com/ExactTarget/fuelux/tree/fuelux2).

# Community

- Implementation help may be found at Stack Overflow (tagged [`fuelux`](http://stackoverflow.com/questions/tagged/fuelux)).
- Follow [@FuelUX on Twitter](https://twitter.com/fuelux).

# Philosophy
Our aim is to provide a suite of related but independent projects that help web developers integrate, manage, and customize quality libraries and utilities to more efficiently develop, maintain, test, and distribute their projects.  Any improvements or fixes we make to the open source projects, we use will be contributed upstream if they are useful to the rest of the community.

Thank you to all those that have submitted issues and contributed to this library.

## Copyright and License

Copyright &copy; 2012-2014 Salesforce Marketing Cloud, Inc.

View [BSD-3 license](https://github.com/ExactTarget/fuelux/blob/master/LICENSE).
