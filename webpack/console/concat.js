const concat = require('concat-files');
const fs = require('fs');

// rename incorrect console fonts
[
  { original: 'Lato-Hairline-Italic.woff2', newName: 'Lato-HairlineItalic.woff2'},
  { original: 'Lato-Hairline-Italic2.woff2', newName: 'Lato-HairlineItalic2.woff2'}
].forEach((def) => {
  const path = './node_modules/api-console/dist/fonts/';
  const originalPath = path + def.original;
    if (fs.existsSync(originalPath)) {
      const newPath = path + def.newName;
      fs.renameSync(originalPath, newPath)
    }
  })


// create concated version for standalone
const publicStaticJsDir = './public/static/js'
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
