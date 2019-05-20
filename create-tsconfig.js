var fs = require('fs');
var path = require('path');

if (fs.existsSync('tsconfig.json')) {
  console.log('ERROR: tsconfig.json already exists');
  process.exit(-1);
}

fs.copyFileSync(path.join(__dirname, 'tsconfig.template.json'), 'tsconfig.json');
console.log('file `tsconfig.json` created');
