We use [Niffy](https://segment.com/blog/perceptual-diffing-with-niffy/) for regression testing. Niffy is built on top of Nightmare, and Mocha + Chai.

Niffy compares the current code with the contents of the reference folder.

The regression tests require an express server to be spun up and render handlebars templates on the server side so that what is served to the page is static HTML. This is because Fuel UX is declarative and some components either initialize on page load or on user interaction (eg. checkbox). In order to accomplish this, the component has to be rendered and ready on pageload when Fuel UX scrapes the page looking for components to initialize.

The Fuel UX Handlebars templates are used to accomplish this.

The test/regression folder has a separate file for each Fuel UX asset.

The regression tests will look at either the local dev code (from `js/*` or `dist/css/fuelux.css`) or will look at the reference code in `reference/dist/`. Ideally the reference code will match the last prod release. Upon Fuel UX release the code from `/dist/` is copied into `/reference/dist/`.

If a change intends to change the look of an asset, those changes should be manually copied into the reference directory. The reason this was done was that otherwise we would have to "ignore" failing tests when you made a change that changed the look and feel. Now since you will be manually copying the changes into the reference folder, you are intentionally changing the output of reference and when you run the tests they will merely be making sure they match. Further changes tested against this new output will make ensure that the change did not revert.