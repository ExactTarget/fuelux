/*global describe,before,it,after */
var config, should, request;

should = require('should');
request = require('request');

try {
  config = require('./config');
} catch (err) {

}

should.exist(config, "Missing config!\nYou need to set the SAUCE_USERNAME and SAUCE_ACCESS_KEY variables.\n");

var username, accessKey;
if(config.saucelabs) {
  username = config.saucelabs.username;
  accessKey = config.saucelabs.accessKey;
}

exports.getRemoteWdConfig = function() {
  return {
    host: "ondemand.saucelabs.com",
    port: 80,
    username: username,
    accessKey: accessKey
  };
};

exports.jobPassed = function(jobId, done) {
  var httpOpts = {
    url: 'http://' + username + ':' + accessKey + '@saucelabs.com/rest/v1/' + username + '/jobs/' + jobId,
    method: 'PUT',
    headers: {
      'Content-Type': 'text/json'
    },
    body: JSON.stringify({
          passed: true,
          'public': true,
          build: process.env.TRAVIS_JOB_ID || Math.round(new Date().getTime() / (1000*60))
        }),
    jar: false /* disable cookies: avoids CSRF issues */
  };

  request(httpOpts, function(err, res) {
    if(err)
      { console.log(err); }
    else
      { console.log("> job:", jobId, "marked as pass." ); }
    done(err);
  });
};

exports.jobUpdate = function(jobId, name, tags, done) {
  var httpOpts = {
    url: 'http://' + username + ':' + accessKey + '@saucelabs.com/rest/v1/' + username + '/jobs/' + jobId,
    method: 'PUT',
    headers: {
      'Content-Type': 'text/json'
    },
    body: JSON.stringify({
          name: name,
          tags: tags,
          "record-video": false
        }),
    jar: false /* disable cookies: avoids CSRF issues */
  };

  request(httpOpts, function(err, res) {
    if(err)
      { console.log(err); }
    else
      { console.log("> job:", jobId, "updated." ); }
    done(err);
  });
};
