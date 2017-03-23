const webpack = require('webpack')
const path = require('path');
const projectRootPath = path.resolve(__dirname, '../../')

module.exports = {
  entry: path.resolve(projectRootPath, './src-worker/index.js'),
  output: {
    path: path.resolve(projectRootPath, './dist'),
    filename: 'worker.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules(?!.*\/oas-raml-converter\/)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  externals: [{
    "libxml-xsd": true,
    "ws": true
  }],
  resolve: {
    alias: {
      fs: path.resolve(projectRootPath, "./node_modules/raml-1-parser/web-tools/modules/emptyFS.js")
    }
  },
  devtool: "source-map",
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      debug: true,
      minimize: true,
      sourceMap: false,
      output: {
        comments: false
      },
      compressor: {
        warnings: false
      }
    })
  ]
}