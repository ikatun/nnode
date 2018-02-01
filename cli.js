#!/usr/bin/env node
var path = require('path');

require('.');

var arg = process.argv[2];
if (!arg) {
  throw new Error('nnode should be called with a js file as an argument');
}
if (arg === '-v' || arg === '--version') {
  console.log(require('./package.json').version);
  return;
}

require(path.resolve(arg));
