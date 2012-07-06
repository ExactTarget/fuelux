var grunt = require("grunt");

grunt.initConfig({
  options: {
    task: {
      param: "default",
      setting: "set",
      global: "set",
      subtask: {
        setting: "subtask"
      }
    }
  },

  task: {
    subtask: {
      options: {
        param: "override all"
      }
    }
  }
});

grunt.loadTasks("../tasks");

exports.options = {
  main: function(test) {
    test.expect(4);

    var options = grunt.helper("options", {nameArgs: "task:subtask"});
    var options_with_default = grunt.helper("options", {nameArgs: "task:subtask"}, {required: "default"});

    var expectA = "set";
    var resultA = options.global;
    test.equal(expectA, resultA, "should get params from global options.task key");

    var expectB = "subtask";
    var resultB = options.setting;
    test.equal(expectB, resultB, "should let params from global options.task.subtask override options.task");

    var expectC = "override all";
    var resultC = options.param;
    test.equal(expectC, resultC, "should allow task options key to override all others");

    var expectD = "default";
    var resultD = options_with_default.required;
    test.equal(expectD, resultD, "should allow helper to define default values");

    test.done();
  }
};