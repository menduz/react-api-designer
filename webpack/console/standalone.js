const concat = require('concat-files');
const fs = require('fs');

// prefix css first
require('./prefix-css');

// create concated version for standalone
const publicStaticJsDir = './public/static/js'
if (!fs.existsSync('./public')) fs.mkdirSync('./public')
if (!fs.existsSync('./public/static')) fs.mkdirSync('./public/static')
if (!fs.existsSync(publicStaticJsDir)) fs.mkdirSync(publicStaticJsDir)

concat([
  './webpack/console/store-loaders.js',
  './node_modules/api-console/dist/scripts/api-console-vendor.js',
  './node_modules/api-console/dist/scripts/api-console.js',
  './webpack/console/load-loaders.js'
], publicStaticJsDir + '/api-console.js', function (err) {
  if (err) throw err
  console.log('Console concat for standalone done');
});
