Additional details to supplement the brief nature of the README file.

## Table of contents

 * [Using Fuel UX](#using-fuel-ux)
 * [Downloading code](#downloading-code)
 * [AMD support](#amd-support)
 * [Compiling code](#compiling-code)
 * [Running docs locally](#running-docs-locally)
 * [Contributors](#contributors)
 * [Travis CI](#travis-ci)

## Using Fuel UX

Fuel UX can be applied to a section of your your HTML or the entire page by adding the `fuelux` wrapper class (eg. [checkbox](http://getfuelux.com/javascript.html#checkbox)):

```html
<body class="fuelux">
<!-- .... -->
<div class="checkbox">
  <label class="checkbox-custom" data-initialize="checkbox" id="myCustomCheckbox">
    <input class="sr-only" type="checkbox" value="">
    <span class="checkbox-label">Custom checkbox unchecked on page load</span>
  </label>
</div>
<!-- .... -->
</body>
```

## Downloading code
Fuel UX can be obtained in any of the following ways:

* Request files from [the Fuel UX CDN](http://www.fuelcdn.com/fuelux/3.4.0/)
* Using [Bower](https://github.com/bower/bower) (ensures you get all the [dependencies](#dependencies)):

   ```
   bower install fuelux
   ```
   Update with `bower update fuelux`.

* Using [Volo](https://github.com/volojs/volo) (ensures you get all the [dependencies](#dependencies)):

   ```
   volo add fuelux

   ```
   Update with `volo add -f fuelux`.

* Clone the Git repository:
   ```
   git clone https://github.com/ExactTarget/fuelux/
   ```

   Cloning the repository ensures you can apply future updates to Fuel UX easily, but requires to you manage its [dependencies](#dependencies) on your own.

* Download a .zip archive of the [latest release](http://www.fuelcdn.com/fuelux/3.4.0/fuelux.zip).

## AMD support

We recommend only loading the controls you need (eg `fuelux/checkbox`).

If using AMD (such as [RequireJS](http://requirejs.org)), reference the FuelUX directory in your paths configuration, wherever it is located:
```javascript
require.config({
    paths: {
        'fuelux': 'http://www.fuelcdn.com/fuelux/3.4.0/'
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

## Compiling code

Fuel UX is lightweight to give you a fast dependable foundation to build upon. It uses [Grunt](http://gruntjs.com/) with convenient methods for working with the library. It's how we compile our code, run tests, and more. To use it, install the required dependencies as directed, and then run some Grunt tasks.

### Install grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Make sure you're in the root of the fuel directory, then run `npm install`. npm will look at [package.json](https://github.com/exacttarget/fuelux/blob/master/package.json) and automatically install the necessary local dependencies listed there.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with npm? Don't have node installed?** npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Grunt tasks

Run `grunt --help` or [check out the Gruntfile](https://github.com/ExactTarget/fuelux/blob/master/Gruntfile.js) to see all possible grunt tasks. When contributing, these are the grunt tasks you will be most likely to use:

#### Testing - `grunt`
Runs JSHint and full suite of QUnit tests.

#### Serving - `grunt serve`
Starts a watch server for automated javascript validation and basic tests (JSHint, simplified QUnit) allowing for visual review of tests at http://localhost:8000/test/.

#### Compiling - `grunt release`
_If you have forked the repo for personal use, you will also find this task useful._

This builds the dist directory (compiling your CSS and JS). If you are going to issue a pull request, you should not include changes to the dist directory that are generated from this grunt task.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Running docs locally

1. If necessary, [install Jekyll](http://jekyllrb.com/docs/installation) (requires v2.3.x).
  - **Windows users:** Read [this unofficial guide](http://jekyll-windows.juthilo.com/) to get Jekyll up and running without problems.
2. Install the Ruby-based syntax highlighter, [Rouge](https://github.com/jneen/rouge), with `gem install rouge`.
3. From the root `/bootstrap` directory, run `jekyll serve` in the command line.
4. Open <http://localhost:9001> in your browser, and voilà.

Learn more about using Jekyll by reading its [documentation](http://jekyllrb.com/docs/home/).

## Contributors

Giving credit where credit is due.

|Major Contributors (a-z) | |
|:----|----:|
|Adam Alexander |[![adamalex on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/adamalex) [![adamalex on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/adamalex) |
|Matt Beard |[![mbeard on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/mbeard) |
|Bryan Kohlmeier |[![bkohlmeier on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/bkohlmeier) |
|Dustin McCormick | [![djmccormick on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/djmccormick) [![djmccormick on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/djmccormick)|
|Christopher McCulloh | [![@cmcculloh on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/cmcculloh) [![cmcculloh on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/cmcculloh) [![cormacmccarthy on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/cormacmccarthy)|
|Scott Plumlee | [![scottplumlee on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/scottplumlee) [![plumlee on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/plumlee)|
|Marvin Pribble | [![marvinpribble on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/marvinpribble)|
|Ryan Moore | [![rbmoore on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/rbmoore)|
|Steven Rogers | [![soldoutactivist on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/soldoutactivist)|
|*Alex Vernacchia (current)* | [![vernacchia on Twitter](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertobird-sm.png)](http://twitter.com/vernacchia) [![vernak2539 on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/vernak2539)|
|*David Waltz (current)* | [![dwaltz on Github](https://raw.githubusercontent.com/ExactTarget/fuelux/gh-pages/invertocat-sm.png)](http://github.com/dwaltz)|

## Travis CI

Pull requests are validate via [Travis CI](https://travis-ci.org/).

Periodically pull requests may fail Travis CI build integration testing with a false negative. If you suspect this is the case you can restart the test via the command line.

### Install Travis CI Client

Travis requires ruby and the [appropriate ruby gem](https://github.com/travis-ci/travis.rb#installation).

### Acquire build number

Restarting the build requires a build number.

1. Click the "details" link in the failed build request.

2. Copy the number in red button on the far right of the Travis dashboard.

### Restart test

With Travis installed and the build number acquired now run the following command.

```
travis restart 9999
```

