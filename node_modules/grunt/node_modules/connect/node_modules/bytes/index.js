
/**
 * Parse byte `size` string.
 *
 * @param {String} size
 * @return {Number}
 * @api private
 */

module.exports = function(size) {
  var parts = size.match(/^(\d+(?:\.\d+)?) *(kb|mb|gb)$/)
    , n = parseFloat(parts[1])
    , type = parts[2];

  var map = {
      kb: 1024
    , mb: 1024 * 1024
    , gb: 1024 * 1024 * 1024
  };

  return map[type] * n;
};
