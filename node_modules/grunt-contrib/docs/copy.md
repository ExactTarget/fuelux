## Copy files into another directory
> Contributed By: [Chris Talkington](/ctalkington) (@ctalkington)

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

This option adjusts the folder structure when copied to the destination directory.

##### flatten ```boolean```

This option performs a flat copy that dumps all the files into the root of the destination directory, overwriting files if they exist.

##### processName ```function```

This option accepts a function that adjusts the filename of the copied file. Function is passed filename and should return a string.

``` javascript
options: {
  processName: function(filename) {
    if (filename == "test.jpg") {
      filename = "newname.jpg";
    }
    return filename;
  }
}
```

##### processContent ```function```

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

##### processContentExclude ```string```

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.

#### Config Example

``` javascript
copy: {
  dist: {
    files: {
      "path/to/directory": "path/to/source/*", // includes files in dir
      "path/to/directory": "path/to/source/**", // includes files in dir and subdirs
      "path/to/project-<%= pkg.version %>": "path/to/source/**", // variables in destination
      "path/to/directory": ["path/to/sources/*.js", "path/to/more/*.js"] // include JS files in two diff dirs
    }
  }
}
```