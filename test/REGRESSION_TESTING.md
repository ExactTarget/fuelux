# Overview
We use [Niffy](https://segment.com/blog/perceptual-diffing-with-niffy/) for regression testing. Niffy is built on top of Nightmare, and Mocha + Chai.

Niffy compares the current code with the contents of the reference folder.

The regression tests require an express server to be spun up and render handlebars templates on the server side so that what is served to the page is static HTML. This is because Fuel UX is declarative and some components either initialize on page load or on user interaction (eg. checkbox). In order to accomplish this, the component has to be rendered and ready on pageload when Fuel UX scrapes the page looking for components to initialize.

The Fuel UX Handlebars templates are used to accomplish this.

The test/regression folder has a separate file for each Fuel UX asset.

The regression tests will look at either the local dev code (from `js/*` or `dist/css/fuelux.css`) or will look at the reference code in `reference/dist/`. Ideally the reference code will match the last prod release. Upon Fuel UX release the code from `/dist/` is copied into `/reference/dist/`.

# Updating reference with intentional changes
If a change intends to change the look of an asset, you will need:

1. Make a build (`npm build`)
2. Run `npm test`
3. View the failures and ensure they are the expected failures (and that no non-expected failures occurred)
4. Run `npm updatereferences`
5. Run `npm test` again to make sure all pass

Further changes tested against this new output will now ensure that the new change does not revert.

# False Positives
Because of "visual noise" you can not set the Threshold to `0`. If you do, 2/3 of the time it will "fail" simply due to a few errant pixels of noise (around shadows or gradients etc).

Currently the visual buffer in TravisCI is set to 1024x768 (see `.travis.yml` file for this setting), which is 786,432 pixels. 0.001% of that is slightly less than eight pixels. Most visual noise we observed was about 3 pixels. Running a test on `http://localhost:8000/checkbox` where we set the top-left border-radius to 0px instead of 4px resulted in a 0.01% (79px) difference. 

If you get false positives more than 1% of the time, look at the number of pixels by which it is failing (When it fails it will tell you by what amount, something like "Error: 0.01% different, open /tmp/niffy/checkbox/diff.png") and change the threshold to the absolute minimum you can without risking false negatives. 

Do not ever set the threshold over `0.009%` as this will result in false negatives of the worst kind. You will have a change, it will tell you you don't have a change, and you won't be likely to ever notice the change unless you are specifically looking for it. Arrow buttons on spinboxes have previously had mis-rounded corners that no one noticed (but looked horrible _if_ you were actually looking at them) for over 6 months. It was just these sorts of subtle errors that we implemented visual regression testing to catch. The worst possible thing that could happen is that we set up visual regression testing intended to catch imperceptible errors and then _tell it to ignore imperceptible errors_. You have been warned.

# Debugging Travis CI
When TravisCI was erring out on Niffy, Woodward was able to run Travis locally through Docker:

1. [Install and setup Docker + Travis](https://docs.travis-ci.com/user/common-build-problems/#Troubleshooting-Locally-in-a-Docker-Image)
2. Copy/paste the following into terminal in a directory without a current fuelux clone:
```
git clone --depth=50 --branch=master https://github.com/exacttarget/fuelux

cd fuelux/

git fetch origin +refs/pull/1990/merge

git checkout -qf FETCH_HEAD

export DEBIAN_FRONTEND=noninteractive

sudo apt-get install libssl1.0.0

sudo -E apt-get -yq update &>> ~/apt-get-update.log

sudo -E apt-get -yq --no-install-suggests --no-install-recommends --force-yes install xvfb

sudo -E apt-get -yq --no-install-suggests --no-install-recommends --force-yes install xvfb

nvm install 6.8.1

npm install

./node_modules/bower/bin/bower update

export DISPLAY=':99.0'

Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &

npm test

```
