require('@babel/polyfill');
var config = require('./config')(undefined, module.parent.filename);
require('@babel/register')(config);
