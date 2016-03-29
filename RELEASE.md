# Releasing Fuel UX

It is highly recommended that you have a look at the Wiki page on [How to release a new version](https://github.com/ExactTarget/fuelux/wiki/How-to-release-a-new-version).


## Build



## QA

1. Import release into Fuel UX site (drop release into /node_modules/)
1. Run `gulp release` to push to dev
1. Go through ever single page on http://fuelux-dev.herokuapp.com
    * Scroll to the bottom of each page scanning for visual errors
    * Make sure right-hand nav functions correctly
    * Click on the "base" example of each control on the control pages and make sure it functions
    * Pay special attention to any controls that were modified in the release, look at each example and interact with it to make sure there are no obvious issues

## Deploy

## Integrate
Each time a release is done, it must be integrated into the following properties:

* [Fuel UX](https://github.com/ExactTarget/fuelux)
* [MC Theme](https://github.com/ExactTarget/fuelux-mctheme)
* [Rucksack](https://github.com/ExactTarget/rucksack)
* [Fuel UX Fusion](https://github.exacttarget.com/uxarchitecture/fusion-fuel)
* [Components](https://github.exacttarget.com/uxarchitecture/fuelux-components)
* [Site](https://github.exacttarget.com/uxarchitecture/fuelux-site)
