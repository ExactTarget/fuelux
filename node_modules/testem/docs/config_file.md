Testem Configuration File
=========================

This document will go into more detail about the Testem configuration file and list in glorious detail all of its available options. The config file is in either JSON format or YAML format and can be called any of the following

* `testem.json`
* `.testem.json`
* `testem.yml`
* `.testem.yml`

The file is looked for in the user's current directory.

An Example
----------

Here's an example `testem.json` file

    {
        "framework": "mocha",
        "src_files": [
            "src/*.js",
            "tests/*_tests.js"
        ]
    }

Configuration Options
---------------------

* **framework** - the test frawework that you are using, in the browser, in the case that you are not also using the `test_page` option. The possible values at the moment are `jasmine`, `qunit`, `mocha`, and `buster`.
* **src_files** - the location of your source files. This should be the code that you author directly, and not generated source files. So, if you are writing in CoffeeScript or TypeScript, this should be your `.coffee` or `.ts` files. If you are writing in Javascript, this would just be your `.js` files, but if you have a compile step for your JS, this would be the `.js` file pre-compilation. The files matched here are what Testem watches for modification (the *watch list*) so that it promptly re-runs the tests when any of them are saved.
* **serve_files** - the location of the source files to be served to the browser. If don't have a compilation step, don't set this option, and it will default to *src_files*. If you have a compilation step, you should set this to the `*.js` file(s) that result from the compilation.
* **test_page** - if you want to use a custom test page to run your tests, put its path here. In most cases, when you use this option, the *src_files* option becomes unnecessary because Testem simply adds all requested files into the watch list. You will also make sure that you include the `/testem.js` script in your test page if you use this option - simply include it with a script tag just below the include for your test framework, i.e. `jasmine.js`.
* **launchers** - this option allows you to set up custom process launchers which can be used to run Node programs and indeed any kind of process within Testem. 