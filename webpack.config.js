module.exports = {
  entry: './src-worker/index.js',
  output: {
    path: __dirname + '/public/build/static/js',
    filename: 'api-designer-worker.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
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
  devtool: "source-map"
}