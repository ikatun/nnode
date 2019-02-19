var fs = require('fs');
var path = require('path');
var glob = require('glob');
var babel = require('@babel/core');
var config = require('./config');
var mkdirp = require('./mkdirp');

/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dir_path) {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(function(entry) {
      var entry_path = path.join(dir_path, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dir_path);
  }
}

function replaceExt(npath, ext) {
  if (typeof npath !== 'string') {
    return npath;
  }

  if (npath.length === 0) {
    return npath;
  }

  var nFileName = path.basename(npath, path.extname(npath)) + ext;
  return path.join(path.dirname(npath), nFileName);
}

module.exports = function() {
  var sourcePaths = glob.sync('src/**/*.@(js|jsx|ts|tsx|es6|es|mjs)');
  rimraf('build');
  sourcePaths.map(function(sourcePath) {
    var destPath = replaceExt(path.join('build', path.relative('src', sourcePath)), '.js');

    console.log(sourcePath, '~>', destPath);
    var code = babel.transformFileSync(sourcePath, config('6.0', sourcePath, true)).code;

    mkdirp(path.dirname(destPath));
    fs.writeFileSync(destPath, code, 'utf8');
  });
};
