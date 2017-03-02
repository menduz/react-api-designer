const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
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
        // todo exclude node_modules expect oas-raml-converter
        // include: [
        //   path.resolve(projectRootPath, './node_modules/oas-raml-converter'),
        //   path.resolve(projectRootPath, './src-index')
        // ],
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
  devtool: "source-map",
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      debug: true,
      minimize: true,
      sourceMap: true,
      output: {
        comments: false
      },
      compressor: {
        warnings: false
      }
    }),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/api-console',
        to: 'api-console'
      }
    ])
  ]
}