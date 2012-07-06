## Copy files into another directory
> Contributed By: Chris Talkington (@ctalkington)

### Configuration

Inside your `grunt.js` file add a section named `copy`. This section specifies the files to copy.

#### Parameters

##### files ```object```

This defines what files this task will copy and should contain key:value pairs.

The key (destination) should be an unique path (supports [grunt.template](https://github.com/cowboy/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

##### options ```object```

This controls how this task operates and should contain key:value pairs, see options below.

#### Options

##### basePath ```string```

This option adjusts copied filenames to be relative to provided path.

##### stripString ```string```

This option removes the provided string from filenames when copied.

#### Config Example

``` javascript
copy: {
  dist: {
    options: {
      basePath: "path/to"
    },
    files: {
      "path/to/directory": "path/to/source/*", // includes files in dir
      "path/to/directory": "path/to/source/**", // includes files in dir and subdirs
      "path/to/project-<%= pkg.version %>": "path/to/source/**", // variables in destination
      "path/to/directory": ["path/to/sources/*.js", "path/to/more/*.js"] // include JS files in two diff dirs
    }
  }
}
```