var fs = require('fs');
var babel = require('babel-core');
var config = require('./config');
var path = require('path');
var mkdirp = require('./mkdirp');

module.exports = function(sourcePaths, outputDir) {
  sourcePaths.map(function(sourcePath) {
    var absoluteSourcePath = path.resolve(sourcePath);

    var code = babel.transformFileSync(absoluteSourcePath, config('4.0')).code;

    const absoluteDestinationPath = path.resolve(path.join(outputDir, sourcePath));
    mkdirp(path.dirname(absoluteDestinationPath));

    console.log(sourcePath, '~>', absoluteDestinationPath);
    fs.writeFileSync(absoluteDestinationPath, code, 'utf8');
  });
};
