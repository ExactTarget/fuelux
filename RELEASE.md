# Releasing Fuel UX

** Read this entire document including [Release Notes Prerequisites](#prerequisites-1). You may need SauceLabs, FuelCDN, NPM, Twitter, Browserstack, Aloha SSO, and TravisCI credentials in order to release. **

## Prerequisites 

### github_changelog_generator
Complete the prerequisites for the [generating release notes](#generate-release-notes).

### Saucelabs
You will need `SAUCE_API_KEY.yml`. Try contacting the last person to do a release for this.

### FuelCDN
You will need `FUEL_CDN.yml` file, as well as ssh keys. Try contacting the last person to do a release for this.

You will also need to add the following to your `~/.ssh/config` file:
```
Host fuelux.upload.akamai.com
  HostkeyAlgorithms +ssh-dss
```

### NPM
You will need to authorize your machine to do npm publishing using `npm adduser`. Try contacting the last person to do a release for this.

### QA
- [ ] Test
  - [ ] `npm install`
  - [ ] `npm test`
  - [ ] `grunt saucelabs` Best to find out if they pass or not now as opposed to in the middle of a release.
    * **WILL NOT WORK ON VPN**
    * If some environments fail, you can comment out the passing environments temporarily in `sauce_browsers.yml` while you debug
    * If some environments fail, start your server with `grunt servefast` and use Browserstack to investigate.

## Release

- [ ] 1. Update GitHub issue tracker for release. Use clear, obvious language for pull request titles. Modify if necessary.
  - [ ] 1a. Create a milestone in GitHub for the next version.
  - [ ] 1b. Assign any remaining open tickets to the milestone you just created (or, if appropriate, assign them to the backlog).
  - [ ] 1c. Mark the current release milestone as closed.

- [ ] 2. Log off of VPN (or saucelabs will probably fail)

- [ ] 3. `npm run release`
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
  - [ ] 5a. Checkout the `gh-pages` branch.
  - [ ] 5b. Run `bower update`. 
  - [ ] 5c. Commit
  - [ ] 5d. Push to `upstream`.
- [ ] 8. Announce
  - [ ] 8a. Tweet via @FuelUX account
  - [ ] 8b. Post to Chatter in the Marketing Cloud Lightning UX group

## Generate Release Notes

Release notes are generated with internal script

### Creating Release Notes

Creating [release notes](https://github.com/exacttarget/fuelux/tags) can either be done as part of the release (by saying yes to the prompt) or manually afterwards.

#### During Release
- [ ] Say "yes" when prompted.

## Integrate
Each time a release is done, it must be integrated into the following properties:

* [Fuel UX](https://github.com/ExactTarget/fuelux)
* [Fuel UX Fusion](https://github.exacttarget.com/uxarchitecture/fusion-fuel)
* [Components](https://github.exacttarget.com/uxarchitecture/fuelux-components)
* [Site](https://github.exacttarget.com/uxarchitecture/fuelux-site)
