var https = require('https');
var querystring = require('querystring');
//var EventEmitter = require('events').EventEmitter;
var util = require('util');
var crypto = require('crypto');

module.exports = Saucelabs;
//util.inherits(Saucelabs, EventEmitter);

function Saucelabs(params){
  var self = this;
  var params = params || {};
  this.options = {};

  this.options.username = null || params.username;
  this.options.password = null || params.password;
  this.options.hostname = params.host || 'saucelabs.com';
  this.options.base_path = params.base_path || '/rest/v1/';
  this.options.port = params.port || '443';
}

Saucelabs.prototype.getAccountDetails = function(callback){
  //curl -v https://saucelabs.com/rest/v1/users/demo-user
  var self = this;
  this.send({
    path: 'users/' + self.options.username,
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    self.access_key = res.access_key;
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.getAccountLimits = function(callback){
  var self = this;
  this.send({
    path: self.options.username +'/limits',
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}


Saucelabs.prototype.getAccountUsage = function(callback){
  var self = this;
  this.send({
    path: 'users/'+ self.options.username +'/usage',
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.createSubAccount = function(data, callback){
  //curl -X POST https://demo-user:access-key@saucelabs.com/rest/v1/users/demo-user -H 'Content-Type: application/json' -d '{"username":"sub-account-username", "password":"sub-account-password", "name":"sub-account-name", "email":"sub-account-email-address"}'
  var self = this;
  this.send({
    path: 'users/' + self.options.username,
    method: 'POST',
    data: {
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email
    }
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.getJobs = function(callback){
  var self = this;
  this.send({
    path: self.options.username + '/jobs?full=1',
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.showJob = function(id, callback){
  var self = this;
  this.send({
    path: self.options.username + '/jobs/' + id,
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.updateJob = function(id, data, callback){
  var self = this;
  
  var job_data = {};
  if(data.name) job_data.name = data.name;
  if(data.tags) job_data.tags = data.tags;
  if(data.public !== undefined) job_data.public = data.public;
  if(data.passed !== undefined) job_data.passed = data.passed;
  if(data.build) job_data.build = data.build;
  if(data.custom) job_data['custom-data'] = data.custom;
  if(data['custom-data']) job_data['custom-data'] = data['custom-data'];

  //check if job_data is empty if it is then stop here

  this.send({
    path: self.options.username + '/jobs/' + id,
    method: 'PUT',
    data: job_data
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.stopJob = function(id, data, callback){
  var self = this;
  
  var job_data = {};
  if(data.name) job_data.name = data.name;
  if(data.tags) job_data.tags = data.tags;
  if(data.public) job_data.public = data.public;

  //check if job_data is empty if it is then stop here

  this.send({
    path: self.options.username + '/jobs/' + id + '/stop',
    method: 'PUT',
    data: job_data
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.getServiceStatus = function(callback){
  var self = this;

  this.send({
    path: 'info/status',
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.getBrowsers = function(callback){
  var self = this;

  this.send({
    path: 'info/browsers',
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.getAllBrowsers = function(callback){
  var self = this;

  this.send({
    path: 'info/browsers/all',
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.getSeleniumBrowsers = function(callback){
  var self = this;

  this.send({
    path: 'info/browsers/selenium-rc',
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.getWebDriverBrowsers = function(callback){
  var self = this;

  this.send({
    path: 'info/browsers/webdriver',
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.getTestCounter = function(callback){
  var self = this;

  this.send({
    path: 'info/counter',
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  })
}

Saucelabs.prototype.getUserActivity = function(callback, start_date, end_date){
  var self = this;

  //dates need to be in fomrat YYYY-MM-DD

  this.send({
    path: self.options.username + '/activity' + ((start_date && end_date) ? '?start=' + start_date + '&end=' + end_date : ''),
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  }) 
}

Saucelabs.prototype.getActiveTunnels = function(callback){
  //curl -v https://demo-user:access-key@saucelabs.com/rest/v1/demo-user/tunnels
  var self = this;

  this.send({
    path: self.options.username + '/tunnels',
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  }) 

}

Saucelabs.prototype.getTunnel = function(id, callback){
  //curl -v https://demo-user:access-key@saucelabs.com/rest/v1/demo-user/tunnels/id
  var self = this;

  this.send({
    path: 'tunnels/' + id,
    method: 'GET'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  }) 

}

Saucelabs.prototype.deleteTunnel = function(id, callback){
  //curl -v https://demo-user:access-key@saucelabs.com/rest/v1/demo-user/tunnels/id
  var self = this;

  this.send({
    path: 'tunnels/' + id,
    method: 'DELETE'
  }, function(err, res){
    if(err && typeof callback == 'function') return callback(err);
    if(typeof callback == 'function'){
      callback(null, res);
    }
  }) 

}

Saucelabs.prototype.createPublicLink  = function(id, datetime, use_hour, callback){
  var self = this;
  if(typeof datetime == 'function'){
    callback = datetime;
    datetime = null;
  }else if(typeof use_hour == 'function'){
    callback = use_hour;
    use_hour = null;
  }

  var url = 'https://saucelabs.com/jobs/' + id;

  if(self.options.username && self.options.password){
    if(datetime instanceof Date){
      //in format YYYY-MM-DD-HH or YYYY-MM-DD

      var datetime_date = datetime.getUTCDate(),
          datetime_month = datetime.getUTCMonth() + 1,
          datetime_year = datetime.getUTCFullYear(),
          datetime_hours = datetime.getUTCHours();

      var datetime_string = [datetime_year, (datetime_month < 10 ? '0' + datetime_month : datetime_month), (datetime_date < 10 ? '0' + datetime_date : datetime_date) ].join('-');
      if(use_hour){
        datetime_string += '-' + (datetime_hours < 10 ? '0' + datetime_hours : datetime_hours).toString();
      }
    }
    var hash = crypto.createHmac('md5', self.options.username + ':' + self.options.password + (datetime_string ? ':' + datetime_string : '')).update(id).digest('hex');
    url += '?auth=' + hash;
  }
  if(typeof callback == 'function'){
    callback(null, url);
  }
}

Saucelabs.prototype.getJobArtifacts = function(id, callback){
  
}

Saucelabs.prototype.send = function(req_data, callback){
  
  var self = this;

  var path = req_data.path;
  if(req_data.method == 'GET' && req_data.data){
    var path =+ '?' + querystring.stringify(req_data.data);
  }

  var req_options = {
    host: self.options.hostname,
    port: self.options.port,
    path: self.options.base_path + path,
    method: req_data.method
  };

  req_options.headers = req_data.headers || {};
  req_options.headers['Content-Type'] = 'application/json';
  req_options.headers.Accept = 'application/json';
  req_options.headers['Content-length'] = req_data.data ? JSON.stringify(req_data.data).length : 0;

  req_options.auth = this.options.username + ':' + this.options.password;

  var req = https.request(req_options, function(res) {
    var response = '';
    res.on('data', function (chunk) {
      response += chunk;
    }).on('end', function(){
      //should get some raw text back here
      if(typeof callback == 'function'){
        try{
          if(res.statusCode == 200){
            callback(null, JSON.parse(response));
          }else{
            callback(JSON.parse(response));
          }
        }catch(err){
          callback('Couldnt parse ' + response);
        }
      }
    }).on('close', function(){
    
    });
  });

  req.on('error', function(e) {
    var response = 'error';
    if(typeof callback == 'function'){
      callback(response);
    }
  });

  if(self.options.method != 'GET' && req_data.data){
    // write data to request body
    req.write(JSON.stringify(req_data.data));
  }
  req.end();
}
