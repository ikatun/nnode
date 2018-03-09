require('babel-polyfill');
var config = require('./config')();

require('babel-register')({
  presets: config.presets,
  plugins: config.plugins
});
