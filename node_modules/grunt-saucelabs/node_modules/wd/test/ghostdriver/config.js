
process.env.GHOSTDRIVER_TEST = 1;

exports.remoteWdConfig = {
  host: 'localhost',
  port: 8080
};

exports.desired = {
  browserName: 'phantomjs'
};
