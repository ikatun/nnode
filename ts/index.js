require('@babel/polyfill');
var config = require('../config')(undefined, '.ts');
require('@babel/register')(config);
