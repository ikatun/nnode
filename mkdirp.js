var fs = require('fs');
var path = require('path');

module.exports = function (targetDir) {
  var sep = path.sep;
  var initDir = path.isAbsolute(targetDir) ? sep : '';
  var baseDir = path.resolve('.');

  targetDir.split(sep).reduce(function (parentDir, childDir) {
    var curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code !== 'EEXIST' && err.code !== 'EISDIR') {
        throw err;
      }
    }

    return curDir;
  }, initDir);
};
