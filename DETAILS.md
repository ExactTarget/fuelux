Additional details to supplement the brief nature of the README file.

## Table of contents

 * [Compiling code](#compiling-code)
 * [Running docs locally](#running-docs-locally)
 * [Contributors](#contributors)
 * [Travis CI](#travis-ci)
 * [Edge Servers](#edge-servers)
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

* Download a .zip archive of the [latest release](http://www.fuelcdn.com/fuelux/3.13.0/fuelux.zip).

## AMD support

We recommend only loading the controls you need (eg `fuelux/checkbox`).

If using AMD (such as [RequireJS](http://requirejs.org)), reference the FuelUX directory in your paths configuration, wherever it is located:
```javascript
require.config({
    paths: {
        'fuelux': 'http://www.fuelcdn.com/fuelux/3.13.0/'
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

### Install Dependencies

In terminal from root directory of fuelux repo:

1. `npm install`
2. `bower install`

### Grunt tasks

Run `grunt --help` or [check out the Gruntfile](https://github.com/ExactTarget/fuelux/blob/master/Gruntfile.js) to see all possible grunt tasks. When contributing, these are the grunt tasks you will be most likely to use:

#### Serving - `grunt serve`
Starts a watch server for automated javascript validation and basic tests (JSHint, simplified QUnit) allowing for prototyping at [http://localhost:8000/](http://localhost:8000/) (not good for unit testing because server catastrophically fails if unit test fails).

#### Serving - `grunt servefast`
Starts a watch server allowing for prototyping at [http://localhost:8000/](http://localhost:8000/) visual review of tests at [http://localhost:8000/test/](http://localhost:8000/test/).

#### Testing - `grunt`
Runs JSHint and full suite of QUnit tests.

#### Building dist - `grunt dist`
This builds the dist directory (compiling your CSS and JS). If you are going to issue a pull request, you should not include changes to the dist directory that are generated from this grunt task.


### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Running docs locally

1. If necessary, [install Jekyll](http://jekyllrb.com/docs/installation) (requires v2.3.x).
  - **Windows users:** Read [this unofficial guide](http://jekyll-windows.juthilo.com/) to get Jekyll up and running without problems.
2. Install the Ruby-based syntax highlighter, [Rouge](https://github.com/jneen/rouge), with `gem install rouge`.
3. From the root `/fuelux` directory, run `jekyll serve` in the command line.
4. Open <http://localhost:9001> in your browser, and voilà.

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

Periodically pull requests may fail Travis CI build integration testing with a false negative. If you suspect this is the case you can restart the test via the command line (see below).

[Travis](https://travis-ci.org/) downloads the `node_modules` folder from the "[Edge](https://fuelux-dev.herokuapp.com)" server (["fuelux-edge"](https://fuelux-edge.herokuapp.com)) hosted on [Heroku](https://www.heroku.com). If you add or update a dependency in `package.json`, you will need to also update `package.json` in `master` locally and push it to [Heroku](https://www.heroku.com) for the dependency errors to be resolved in [Travis](https://travis-ci.org/).

### Install Travis CI Client

Travis requires ruby and the [appropriate ruby gem](https://github.com/travis-ci/travis.rb#installation).

### Restarting a Travis CI Build
#### From the Browser
1. On the Pull Request page on Github, click on the "details" link in the Travis CI build area
1. Click "Login with Github" at the top right of the page
1. Click the "Restart Build" button (circular button with an arrow going in a circle)


#### From the Command Line
1. Login to Travis
    In the terminal, issue the following command (You'll need to use your Github credentials):
    ```
    travis login --org
    ```
1. Acquire build number
    In the terminal, issue the following command:
    ```
    travis history
    ```

1. Restart Build using the build number you obtained from `travis history`
    In the terminal, issue the following command:
    ```
    travis restart 9999
    ```

## Edge servers

We have an "Edge Server" on Heroku named "fuelux-dev". If you have permissions to the ExactTarget org on Heroku, you can get information on cloning the `fuelux-dev` remote from its [app page](https://dashboard.heroku.com/orgs/exacttarget/apps/fuelux-dev/deploy/heroku-git) on [Heroku](https://www.heroku.com). If you do not have permissions and believe you should, please contact one of the FuelUX project maintainers.

A build of master is available at `https://fuelux-dev.herokuapp.com/dist/js/fuelux.js` and `https://fuelux-dev.herokuapp.com/dist/css/fuelux.css`.

_These files should be considered unstable as this is our dev server_

To create your own edge server, setup a github web hook on Heroku for this repository and put the app into development mode with `heroku config:set NPM_CONFIG_PRODUCTION=false`.
