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
        from: 'node_modules/@mulesoft/anypoint-icons/lib/sprite-4.1.0.svg',
        to: '../../assets/sprite-4.1.0.svg',
      }, {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
      }, {
        from: 'bower_components',
        to: 'api-console',
      }
    ])
  ]
}