## Clear files and folders.
> Contributed By: Tim Branyen (@tbranyen)

### Overview

Inside your `grunt.js` file, add a section named `clean`.

Due to the destructive nature of this task, we have implemented several sanity checks but always be cautious of the paths you clean.

#### Parameters

This task only accepts an array of paths to be removed. Each path is processed seperately and supports [grunt.template](https://github.com/cowboy/grunt/blob/master/docs/api_template.md).

#### Config Examples

``` javascript
clean: ["path/to/dir/one", "path/to/dir/two"]
```

As an alternative, you can add specific targets to your clean config,
which can then be called as 'grunt clean:build', 'grunt clean:release' etc.

``` javascript
clean: {
  build: ["path/to/dir/one", "path/to/dir/two"],
  release: ["path/to/another/dir/one", "path/to/another/dir/two"]
}
```