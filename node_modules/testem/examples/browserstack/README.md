BrowserStack Integration
========================

Run your tests on various browsers hosted on Browserstack!

Instructions
------------

1. Get a [BrowserStack](browserstack.com) account.
2. Create a file named `.browserstack.json` in the top of your home directory. This JSON formatted file will contain 3 properties:
    * **username** - your BrowserStack username
    * **password** - your BrowserStack password
    * **key** - your BrowserStack API key, found on the [automated brower testing api page](http://www.browserstack.com/automated-browser-testing-api) given you are logged in to BrowerStack.
3. Install [browserstack-cli](https://github.com/dbrans/browserstack-cli) via `npm install browserstack-cli -g`.
4. Run the command `testem ci -l bs_chrome` to test out the setup with just the Chrome browser hosted BrowserStack.
5. Run `testem ci` to run it on all the listed browsers - see `testem launchers` for the full list.

