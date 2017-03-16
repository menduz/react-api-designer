const concat = require('concat-files');
const fs = require('fs');

// prefix css first
require('./prefix-css');

// create concated version for electron
const electronDir = './electron/build'
if (!fs.existsSync(electronDir)) fs.mkdirSync(electronDir)

concat([
  './webpack/console/store-loaders.js',
  './node_modules/api-console/dist/scripts/api-console-vendor.min.js',
  './node_modules/api-console/dist/scripts/api-console.min.js',
  './webpack/console/load-loaders.js'
], electronDir + '/api-console.js', function (err) {
  if (err) throw err
  console.log('Console concat for electron done');
});
