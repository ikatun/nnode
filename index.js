require('@babel/polyfill');
var config = require('./config')();

require('@babel/register')(config);
