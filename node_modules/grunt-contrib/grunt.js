module.exports = function(grunt) {
  grunt.initConfig({
    lint: {
      all: ["tasks/*.js"]
    }
  });

  grunt.registerTask("default", "lint");
  grunt.loadTasks("tasks");
};