var Express, express;

express = require('express');

Express = (function() {

  function Express() {}

  Express.prototype.start = function() {
    this.app = express();
    this.app.use(express["static"](__dirname + '/assets'));
    this.server = this.app.listen(8181);
  };

  Express.prototype.stop = function() {
    return this.server.close();
  };

  return Express;

})();

exports.Express = Express;
