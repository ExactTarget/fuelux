# Releasing Fuel UX

** Read this entire document including [Release Notes Prerequisites](#prerequisites-1). You may need SauceLabs, FuelCDN, NPM, Twitter, Browserstack, Aloha SSO, and TravisCI credentials in order to release. **

## Prerequisites 

### github_changelog_generator
Complete the prerequisites for the [generating release notes](#generate-release-notes).

### Saucelabs
You will need `SAUCE_API_KEY.yml`. Get it from someone on the team. You could try contacting sjames@salesforce.com, mbeard@salesforce.com, cmcculloh@salesforce.com as a last resort.

### FuelCDN
You will need `FUEL_CDN.yml` file, as well as ssh keys. Contact another maintainer for credentials/keys.

### NPM
You will need to authorize your machine to do npm publishing using `npm adduser`. Contact another maintainer for credentials.

### QA
- [ ] Test
  - [ ] `npm install`
  - [ ] `grunt test`
  - [ ] `grunt saucelabs` Best to find out if they pass or not now as opposed to in the middle of a release.
    * **WILL NOT WORK ON VPN**
    * If some environments fail, you can comment out the passing environments temporarily in `sauce_browsers.yml` while you debug
    * If some environments fail, start your server with `grunt servefast` and use Browserstack to investigate.
  - [ ] Generate test distribution package for use on the Fuel UX Site
    - [ ] `grunt dist`
    - [ ] Copy the created `dist/` directory to the fuelux-site project, replacing `node_modules/fuelux/dist/`
  - [ ] Test on Fuel UX Site
    - [ ] `gulp release`
    - [ ] Check all known affected controls on [dev instance of Fuel UX site on Heroku](http://fuelux-dev.herokuapp.com)
      * Scroll to the bottom of each page scanning for visual errors
      * Make sure right-hand nav functions correctly
      * Click on the "base" example of each control on the control pages and make sure it functions
      * Pay special attention to any controls that were modified in the release, look at each example and interact with it to make sure there are no obvious issues

## Release

- [ ] 1. Update GitHub issue tracker for release. Use clear, obvious language for pull request titles. Modify if necessary.
      - [ ] 1a. Create a milestone in GitHub for the next version.
      - [ ] 1b. Assign any remaining open tickets to the milestone you just created (or, if appropriate, assign them to the backlog).
      - [ ] 1c. Mark the current release milestone as closed.

- [ ] 2. Log off of VPN (or saucelabs will probably fail)

- [ ] 3. `grunt release`
    This grunt task:
      * Creates a new release branch from remote master.
      * Builds dist.
      * Updates the `package.json`, `bower.json`, and markdown files with the version. This will build and run all tests on the `dist` folder (including SauceLabs cross browser testing). 
      * Adds modified release files. 
      * Commits with version number.
      * Adds version tag.
      * Pushes to origin (`git push origin 3.x`).
      * Publishes tag to Github. The tag commit should exist in the major.x branch.
      * Upload contents of `dist` folder to Fuel CDN server via SFTP (`mv dist x.x.x && scp -i ~/.ssh/fuelcdn -r x.x.x/ [user@domain]:/[id]/fuelux/ && mv x.x.x dist`).
      * Pushes 3.x to master if nothing new has been merged in.
      * Runs `npm publish` using the fuelux profile 
      * (with prompt) Runs Ruby Gem described below for Release Notes.
- [ ] 4. Create Release Notes for release and publish
        ![Draft release, copy/paste output from Ruby Gem, Publish](http://i.imgur.com/WQHN3Y6.gif)
- [ ] 5. Update getfuelux.com
      - [ ] 4a. Checkout the `gh-pages` branch.
      - [ ] 4b. Run `bower update`. 
      - [ ] 4c. Commit
      - [ ] 4d. Push to `upstream`.

- [ ] 6. Update Fuel UX Site
- [ ] 7. [Update MC Theme] (https://github.com/ExactTarget/fuelux-mctheme/wiki/How-to-release-a-new-version)
- [ ] 8. Update Rucksack
- [ ] 9. Update Fusion
- [ ] 10. Announce
      - [ ] 10a. Tweet via @FuelUX account
      - [ ] 10b. Post to Chatter in the Fuel UX Group

## Generate Release Notes

Release notes are generated automagically using [this Ruby gem](https://skywinder.github.io/github-changelog-generator/). 

### Prerequisites
- [ ] Create a [GitHub token](#creating-a-github-token) for the changelog generator, be sure to make note of the token that is created, because you'll need it :smile: 
- [ ] Copy `GITHUB_TOKEN.json.template` to `GITHUB_TOKEN.json` (`GITHUB_TOKEN.json` is git ignored)
- [ ] Fill the `token` variable in GITHUB_TOKEN.json with the token you just created.
- [ ] Install Ruby
- [ ] [Install the gem](https://skywinder.github.io/github-changelog-generator/#installation) `[sudo] gem install github_changelog_generator`

#### Creating a GitHub token

GitHub only allows only 50 unauthenticated requests per hour. 
Therefore, it's recommended to run this script with authentication by using a **token**.

Here's how:

- [Generate a token here](https://github.com/settings/tokens/new?description=GitHub%20Changelog%20Generator%20token) - you only need "repo" scope for private repositories

### Creating Release Notes

Creating [release notes](https://github.com/exacttarget/fuelux/tags) can either be done as part of the release (by saying yes to the prompt) or manually afterwards.

#### During Release
- [ ] Say "yes" when prompted.

#### Manually
- [ ] Run `grunt prompt:generatelogsmanually`

Release notes will be placed in `CHANGELOG.md`. There is a bug with the changelog_generator (or a mis-configuration or something) that makes it mess up and include links for basically every issue ever. 
- [ ] Delete all issues listed for all previous releases leaving just the issues for the current release. 
- [ ] Copy and paste the remaining issues into a New Release on Github titled after the release number, prepended with a `v` (eg "v3.15.7")



## Integrate
Each time a release is done, it must be integrated into the following properties:

* [Fuel UX](https://github.com/ExactTarget/fuelux)
* [MC Theme](https://github.com/ExactTarget/fuelux-mctheme)
* [Rucksack](https://github.com/ExactTarget/rucksack)
* [Fuel UX Fusion](https://github.exacttarget.com/uxarchitecture/fusion-fuel)
* [Components](https://github.exacttarget.com/uxarchitecture/fuelux-components)
* [Site](https://github.exacttarget.com/uxarchitecture/fuelux-site)
