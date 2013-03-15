var isTravis = function () {
  return process.env.TRAVIS_JOB_ID
};

var browsers = ['firefox'];

if(!isTravis()){
  browsers.push('chrome');
}

exports.isTravis = isTravis;
exports.browsers = browsers;
