Using Testem with Jenkins
=========================

This document details the steps for using Testem with Jenkins. It assumes that you have installed Testem, have setup Testem to work in the top level of your project, and that you already have a working Jenkins installation set up.

Step 1: Install the TAP Plugin
------------------------------

In the Jenkins web console, go to "Manage Jenkins" in the top level side bar menu and then select "Manage Plugins". Select the "Available" tab and find the "TAP Plugin" in this long list of plugins, check the box next to it and then hit the "Install without restart" button, you'll wait several seconds for it to download the plugin and install it.

Step 2: Create a New Job
------------------------

For your project, create a "New Job" in Jenkins. In the first screen, choose a "Job name" and select "Build a free-style software project". 

Setup your Source Code Management and Build triggers, this is dependent on what version control tool you use. *Sorry, but you are on your own for this part.*

Hit "Add build step" and select "Execute shell" - or "Execute Windows batch command" if you are on Windows. In the "Command" text area, paste this code

    testem ci > tests.tap
    
Under "Post-build Actions", check "Publish TAP Results", then in "Test results" put `tests.tap`.

Finally, hit the "Save" button.

Now click "Build Now" to test the build. ***Good luck!***

Troubleshooting
---------------

If you hit a snag, try running `testem ci` on the command line first. `testem ci -l` will show you the list of browsers that are available in your system - all of which it will use. You could restrict the set of browsers to include via either whitelisting or blacklisting. For whitelisting, this is how to only run tests on IE9 and Firefox

    testem ci -b IE9,Firefox
    
For blacklisting, this is how to run on all available browsers except Opera(sorry Opera)

    testem ci -s Opera

    
