### Before writing code
1. [confirm issue is new](https://github.com/ExactTarget/fuelux/issues)
  - if not, get involved in previous report of issue
1. [create a new issue](https://github.com/ExactTarget/fuelux/issues/new)
  - this way, we can give feedback/direction as early as possible to ensure the most successful outcome for your hard work

### Writing code
* do not edit or commit files in the `dist` directory
  - project maintainers will commit files in the `dist` directory from time to time
  - details on compiling CSS and JavasScript can be found [here](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#compiling-code)
* source files are in respective `js`, `less`, and `fonts` directories
* conform to [Salesforce Marketing Cloud style guide](https://github.com/ExactTarget/javascript)
* if you are new to git, please review [our git commit conventions](https://github.com/ExactTarget/fuelux/wiki/Fuel-UX-Git-and-GitHub-Conventions)


1. [fork this repository](https://github.com/ExactTarget/fuelux/fork)
2. clone locally
3. `npm install`
4. create new branch, named after the GH Issue you are resolving
5. add unit tests for new or changed functionality
  - unit tests are found in `/test`
5. make your changes
6. `grunt test` to lint and unit test your changes
7. `grunt servefast` and visit `http://localhost:8000/test/` for information on failing unit tests
1. [sync your fork](https://help.github.com/articles/syncing-a-fork/) with the upstream repo
1. commit your changes
  - **do not commit files within ````/dist````**
  - commit unit tests and code separately, unit tests first so we can see them fail and then pass
  - write meaningful commit messages (NO WIP!)

### Submitting Pull Requests
All pull requests are validated via [Travis CI](https://travis-ci.org/). If the tests fail and you feel it is a Travis issue, you can [trigger a restart](https://github.com/exacttarget/fuelux/blob/master/DETAILS.md#travis-ci).

While grunt can run the included unit tests via PhantomJS, this isn't a substitute for running tests across a variety of browsers and environments. Please be sure to test in as many of the browsers listed in `sauce_browsers.yml` as you can before contributing.

1. run `grunt test` to lint & test your code
1. if necessary, rebase and squash to as few commits as practical
1. push to your forked repo
1. submit a pull request to master
- for help, visit GitHub's [using pull requests](https://help.github.com/articles/using-pull-requests)
1. Follow your pull request answering questions and making adjustments as appropriate until it is merged
