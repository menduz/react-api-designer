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


// create concated version for component
const distDir = './dist'
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir)

concat([
  './webpack/console/store-loaders.js',
  './node_modules/api-console/dist/scripts/api-console-vendor.min.js',
  './node_modules/api-console/dist/scripts/api-console.min.js',
  './webpack/console/load-loaders.js'
], distDir + '/api-console.js', function (err) {
  if (err) throw err
  console.log('Console concat for component done');
});


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
