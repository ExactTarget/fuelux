grunt-saucelabs
---------------------

[![Build Status](https://api.travis-ci.org/axemclion/grunt-saucelabs.png?branch=master)](https://travis-ci.org/axemclion/grunt-saucelabs)
[![Selenium Test Status](https://saucelabs.com/buildstatus/grunt-sauce)](https://saucelabs.com/u/grunt-sauce)

A Grunt task for running qunit and jasmine tests using Sauce Labs' Cloudified Browsers.

[Grunt](http://gruntjs.com/) is a task-based command line build tool for JavaScript projects, based on nodejs.
[QUnit](http://qunitjs.com/) is a powerful, easy-to-use JavaScript unit test suite used by the jQuery, jQuery UI and jQuery Mobile projects and is capable of testing any generic JavaScript code, including itself!
[Sauce Labs](https://saucelabs.com/) offers browser environments on the cloud for testing code.

About the tool
--------------
The [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit) task runs qunit based test suites on [PhantomJS](http://phantomjs.org/).
The `saucelabs-qunit` task is very similar but runs the test suites on the cloudified browser environment provided by Sauce Labs. This ensures that subject of the test runs across different browser environment.
The task also uses [Sauce Connect](https://saucelabs.com/docs/connect) to establish a tunnel between Sauce Labs browsers and the machine running Grunt to load local pages. This is typically useful for testing pages on localhost that are not publically accessible on the internet.
The `saucelabs-jasmine` runs jasmine tests in the Sauce Labs browser. The `saucelabs-jasmine` task requires `jasmine-1.3.0`.

Usage
------
This task is available as a [node package](https://npmjs.org/package/grunt-saucelabs) and can be installed as `npm install grunt-saucelabs`. It can also be included as a devDependency in package.json in your node project.

To use the task in `grunt.js`, load the npmTask.


```javascript
grunt.loadNpmTasks('grunt-saucelabs');

```

In the `grunt.initConfig`, add the configuration that looks like the following

```javascript
'saucelabs-qunit': {
  all: {
      options: {
      username: 'saucelabs-user-name', // if not provided it'll default to ENV SAUCE_USERNAME (if applicable)
      key: 'saucelabs-key', // if not provided it'll default to ENV SAUCE_ACCESS_KEY (if applicable)
      urls: ['array or URLs to to load for QUnit'],
      concurrency: 'Number of concurrent browsers to test against. Will default to the number of overall browsers specified. Check your plan (free: 2, OSS: 3) and make sure you have got sufficient Sauce Labs concurrency.',
      tunneled: 'true (default) / false; false if you choose to skip creating a Sauce connect tunnel.',
      tunnelTimeout: 'A numeric value indicating the time to wait before closing all tunnels',
      testTimeout: 'Milliseconds to wait before timeout for qunit test per page',
      testInterval: 'Milliseconds between retries to check if the tests are completed',
      testReadyTimeout: 'Milliseconds to wait until the test-page is ready to be read',
      detailedError: 'false (default) / true; if true log detailed test results when a test error occurs',
      testname: 'Name of the test',
      tags: ['Array of tags'],
      browsers: [{
        browserName: 'opera'
      }],
      onTestComplete: function(){
        // Called after a qunit unit is done, per page, per browser
        // Return true or false, passes or fails the test
        // Returning undefined does not alter the test result

        // For async return, call
        var done = this.async();
        setTimeout(function(){
          // Return to this test after 1000 milliseconds
          done(/*true or false changes the test result, undefined does not alter the result*/);
        }, 1000);
      }
    }
  }
}

```

The configuration of `saucelabs-jasmine` are exactly the same.
Note the options object inside a grunt target. This was introduced in grunt-saucelabs-* version 4.0.0 to be compatiable with grunt@0.4.0


The parameters are

* __username__ : The Sauce Labs username that will be used to connect to the servers. _Required_
* __key__ : The Sauce Labs secret key. Since this is a secret, this should not be checked into the source code and may be available as an environment variable. Grunt can access this using   `process.env.saucekey`. _Required_
* __urls__: An array or URLs that will be loaded in the browsers, one after another. Since SauceConnect is used, these URLs can also be localhost URLs that are available using the `server` task from grunt. _Required_
* __tunneled__: Defaults to true; Won't launch a Sauce Connect tunnel if set to false. _Optional_
* __testname__: The name of this test, displayed on the Sauce Labs dashboard. _Optional_
* __tags__: An array of tags displayed for this test on the Sauce Labs dashboard. This can be the build number, commit number, etc, that can be obtained from grunt. _Optional_
* __browsers__: An array of objects representing the [various browsers](https://saucelabs.com/docs/platforms) on which this test should run.  _Optional_
* __tunnelTimeout__: A numeric value indicating the time to wait before closing all tunnels (default: 120). _Optional_
* __testTimeout__ : Number of milliseconds to wait for qunit tests on each page before timeout and failing the test (default: 300000). _Optional_
* __testInterval__ : Number of milliseconds between each retry to see if a test is completed or not (default: 5000). _Optional_
* __testReadyTimeout__: Number of milliseconds to wait until the test-page is ready to be read (default: 5000). _Optional_
* __onTestComplete__ : A callback that is called everytime a qunit test for a page is complete. Runs per page, per browser configuration. A true or false return value passes or fails the test, undefined return value does not alter the result of the test. For async results, call `this.async()` in the function. The return of `this.async()` is a function that should be called once the async action is completed. _Optional_

A typical `test` task running from Grunt could look like `grunt.registerTask('test', ['server', 'qunit', 'saucelabs-qunit']);` This starts a server and then runs the Qunit tests first on PhantomJS and then using the Sauce Labs browsers.

Examples
--------
Some projects that use this task are as follows. You can take a look at their GruntFile.js for sample code

* [This project](https://github.com/axemclion/grunt-saucelabs/blob/master/Gruntfile.js)
* [Jquery-IndexedDB](https://github.com/axemclion/jquery-indexeddb/blob/master/GruntFile.js)
* [IndexedDBShim](https://github.com/axemclion/IndexedDBShim/blob/master/Gruntfile.js)

If you have a project that uses this plugin, please add it to this list and send a pull request. 

Integration with a CI system
--------------------------
Grunt tasks are usually run alongside a continuous integration system. For example, when using [Travis](https://travis-ci.org), adding the following lines in the package.json ensures that the task is installed with `npm install` is run. Registering Sauce Labs in test task using `grunt.registerTask('test', ['server', 'saucelabs-qunit']);` ensures that the CI environment runs the tests using `npm test`.
To secure the Sauce Key, the CI environment can be configured to provide the key as an environment variable instead of specifying it file. CI Environments like Travis provide [ways](http://about.travis-ci.org/docs/user/build-configuration/#Secure-environment-variables) to add secure variables in the initial configuration.
The [IndexedDBShim](http://github.com/axemclion/IndexedDBShim) is a project that uses this plugin in a CI environment. Look at the [.travis.yml](https://github.com/axemclion/IndexedDBShim/blob/master/.travis.yml) and the [grunt.js](https://github.com/axemclion/IndexedDBShim/blob/master/Gruntfile.js) for usage example.
