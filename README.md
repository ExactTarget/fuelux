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


Fuel UX extends [Bootstrap 3](https://github.com/twbs/bootstrap) with additional lightweight JavaScript controls. It has been sunsetted and is no longer maintained.

# Documentation

Fuel UX documentation has been archived. You can find it in the gh-pages-archive branch. If you need it you are welcome to check out that branch and build it with [Jekyll](http://jekyllrb.com). More details on setting up Jekyll and running docs locally can be found [in our CONTRIBUTING.md documentation](https://github.com/exacttarget/fuelux/blob/master/CONTRIBUTING.md#running-gh-pages-locally). No one who originally worked on this has any lasting memory or expertise about how to do anything with this and any requests for help will be ignored.

# Contributing

Contributions are no longer accepted.

# Obtaining Fuel UX

It is recommended that you do not use Fuel UX. However, if you are determined to do so, NPM is a method for obtaining Fuel UX.
```
npm install fuelux
```

You can also use on of the following methods:
- [Bower](https://github.com/bower/bower) `bower install fuelux` (update with `bower update fuelux`).
- [Volo](https://github.com/volojs/volo) `volo add fuelux` (update with `volo add -f fuelux`).
- Clone via git `git clone https://github.com/ExactTarget/fuelux/`
  - Cloning the repository ensures you can apply future updates to Fuel UX easily, but requires to you manage its [dependencies](#dependencies) on your own.
- Download a [.zip archive](http://www.fuelcdn.com/fuelux/3.17.1/fuelux.zip).

# Using Fuel UX

Fuel UX can be used with an existing page via CDN or installed in a project.

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
<link href="//www.fuelcdn.com/fuelux/3.17.1/css/fuelux.min.css" rel="stylesheet">

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.1/js/bootstrap.min.js"></script>
<script src="//www.fuelcdn.com/fuelux/3.17.1/js/fuelux.min.js"></script>

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
        'fuelux': 'http://www.fuelcdn.com/fuelux/3.17.1/'
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

Fuel UX also supports placing components in their own `<script>` tags. Errors will appear in the console if you have not loaded dependencies correctly.


# Bugs and Feature Requests

Have a bug or a feature request? Feel free to write the code and use the code you write. Pull and feature requests will be ignored.


# Previous releases

You can download 2.6 updates (bug fixes only) from the [fuelux2 branch](https://github.com/ExactTarget/fuelux/tree/fuelux2).

# Community

- Implementation help might be found at Stack Overflow (tagged [`fuelux`](http://stackoverflow.com/questions/tagged/fuelux)).

Thank you to all those that worked on, submitted issues, and contributed to this library.

## Copyright and License

Copyright &copy; 2012-2014 Salesforce Marketing Cloud, Inc.

View [BSD-3 license](https://github.com/ExactTarget/fuelux/blob/master/LICENSE).
