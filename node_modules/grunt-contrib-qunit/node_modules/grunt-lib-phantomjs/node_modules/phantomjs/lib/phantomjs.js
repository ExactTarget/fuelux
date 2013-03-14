var path = require('path')
var binPath = path.join(__dirname, 'phantom')

if (process.platform === 'win32') {
  binPath = path.join(binPath, 'phantomjs.exe')
} else {
  binPath = path.join(binPath, 'bin' ,'phantomjs')
}

exports.path = binPath