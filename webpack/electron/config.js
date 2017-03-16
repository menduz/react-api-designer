const webpack = require('webpack');
const path = require('path');
const projectRootPath = path.resolve(__dirname, '../../')

module.exports = {
  entry: path.resolve(projectRootPath, './src/index.js'),
  output: {
    path: path.resolve(projectRootPath, './electron/build'),
    filename: 'main.js',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {presets: ['es2015', 'react', 'stage-2']}
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },
  devtool: 'cheap-module-source-map',
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.DefinePlugin({
      GLOBALS: {
        ICON_SPRITE_PATH: JSON.stringify('./build/')
      },
    }),
  ],
};
