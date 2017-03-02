var concat = require('concat-files');
var fs = require('fs');

const publicStaticJsDir = './public/static/js';
if (!fs.existsSync(publicStaticJsDir)) {
  fs.mkdirSync(publicStaticJsDir);
}

concat([
  './concat-helpers/store-loaders.js',
  './dist/api-console/dist/scripts/api-console-vendor.js',
  './dist/api-console/dist/scripts/api-console.js',
  './concat-helpers/load-loaders.js'
], publicStaticJsDir + '/api-console.js', function (err) {
  if (err) throw err
  console.log('Concat done!');
});

const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

concat([
  './concat-helpers/store-loaders.js',
  './dist/api-console/dist/scripts/api-console-vendor.min.js',
  './dist/api-console/dist/scripts/api-console.min.js',
  './concat-helpers/load-loaders.js'
], distDir + '/api-console.min.js', function (err) {
  if (err) throw err
  console.log('Concat done!');
});
