const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const projectRootPath = path.resolve(__dirname, '../../')

module.exports = {
  entry: path.resolve(projectRootPath, './src-worker/index.js'),
  output: {
    path: path.resolve(projectRootPath, './public/static/js'),
    filename: 'worker.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
    new CopyWebpackPlugin([
      {
        from: 'node_modules/@mulesoft/anypoint-styles',
        to: 'anypoint-styles',
      }, {
        from: 'node_modules/@mulesoft/anypoint-icons/lib/sprite-4.1.0.svg',
        to: '../../assets/sprite-4.1.0.svg',
      }, {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
      // }, {
      //   from: 'src/components/raml-console/polymer-console/console-imports.html',
      //   to: 'api-console-imports/polymer-console/console-imports.html'
      }
    ])
  ]
}