const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src-worker/index.js',
  output: {
    path: __dirname + '/public/static/js',
    filename: 'api-designer-worker.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  node: {
    fs: "empty"
  },
  devtool: "source-map",
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'node_modules/@mulesoft/anypoint-styles',
        to: 'anypoint-styles',
      }, {
        from: 'node_modules/@mulesoft/anypoint-icons/lib/icons-4.svg',
        to: '../../shared/icons-4.svg',
      }, {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
      }, {
        from: 'node_modules/api-console',
        to: 'api-console'
      }, {
        from: 'src/components/raml-console/angular-console/console-imports.html',
        to: 'api-console-imports/angular-console/console-imports.html'
      }, {
        from: 'src/components/raml-console/polymer-console/console-imports.html',
        to: 'api-console-imports/polymer-console/console-imports.html'
      }
    ])
  ]
}