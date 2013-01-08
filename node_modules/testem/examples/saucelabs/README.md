SauceLab Integration
========================

Run your tests on various browsers hosted on SauceLabs!

Instructions
------------

1. Get a [SauceLabs](https://saucelabs.com/) account.
2. Create a file named `.saucelabs.json` in the top of your home directory. This JSON formatted file will contain 2 properties:
    * **username** - your SauceLabs username
    * **api_key** - your SauceLabs API/Access key.
3. Install [saucelauncher](https://github.com/airportyh/saucelauncher) via `npm install saucelauncher -g`.
4. Run `testem ci` to run it on all the listed browsers - see `testem launchers` for the full list.

