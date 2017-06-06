We use [Niffy](https://segment.com/blog/perceptual-diffing-with-niffy/) for regression testing. Niffy is built on top of Nightmare, and Mocha + Chai.

Niffy compares the current code with the contents of the reference folder.

The test/regression folder has a separate file for each Fuel UX asset. Each file includes either the Fuel UX JS & CSS from the previous release, or the current JS & CSS from the project depending on whether the `serve-reference` query param is set to `true`.

If a change intends to change the look of an asset, those changes should be manually copied into the reference directory. The reason this was done was that otherwise we would have to "ignore" failing tests when you made a change that changed the look and feel. Now since you will be manually copying the changes into the reference folder, you are intentionally changing the output of reference and when you run the tests they will merely be making sure they match. Further changes tested against this new output will make ensure that the change did not revert.