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

try {
  process.argv.shift();
  require(path.resolve(arg));
} catch (e) {
  if (e.message === 'Cannot find module \'flow-runtime\'') {
    console.error('Missing flow-runtime. Run `npm install flow-runtime`');
    return;
  }
  throw e;
}
