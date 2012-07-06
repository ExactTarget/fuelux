## Compile handlebars templates to JST file
> Contributed By: Tim Branyen (@tbranyen)

### Overview

Inside your `grunt.js` file, add a section named `handlebars`. This section specifies the files to compile and the options used with [handlebars](http://handlebarsjs.com/).

##### files ```object```

This defines what files this task will process and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template](https://github.com/cowboy/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

Note: Values are precompiled to the namespaced JST array in the order passed.

##### options ```object```

This controls how this task operates and should contain key:value pairs, see options below.

#### Options

##### namespace ```string```

The namespace in which the resulting JST templates are assigned to.

#### Config Example

``` javascript
handlebars: {
  compile: {
    options: {
      namespace: "JST"
    },
    files: {
      "path/to/result.js": "path/to/source.handlebar",
      "path/to/another.js": ["path/to/sources/*.handlebar", "path/to/more/*.handlebar"]
    }
  }
}
```