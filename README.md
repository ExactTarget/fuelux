Fuel UX - Live Documentation
======

### Setup
* To install bower globally, `npm install --g bower`
* To install bower dependencies, `bower install`
* To update bower dependencies, run `bower update`
* To update a specific bower dependency, `bower update fuelux`
* To get the proper ruby version (2.1.1) [See the rvm docs](https://rvm.io/rvm/install) for steps
* To install bundler, run `gem install bundler`
* To install jekyll, run `bundle install`
* To serve a jekyll site and watch, run `jekyll serve --watch`
** If that doesn't work, try `bundle exec jekyll serve --watch`

### Local Development FAQ
* _config.yml contains config values related to the `{{site}}` variables used throughout the gh-pages site.
** If you are editing local JS or CSS, you will need to uncomment the local `url` var in this file (`url:  http://0.0.0.0:4000/`)


### Notes
* Any h tag with an id will automagically be given a little link thing to its left that people can use to link back to the documentation. The more h tags have ids, the more reference-able our documentation will be.
* The fusion folder breaks each section down into its own page. Doing this exposes individual control documentation to other web sites.
