var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    app: "./app/main.js",
    vendor: [
      'react/addons',
      'react-router',
      'flummox',
      'immutable'
    ]
  },

  output: {
    path: 'build/',
    filename: 'bundle.js'
  },

  resolve: {
    root: path.resolve('./node_modules')
  },

  resolveLoader: {
    root: path.join(__dirname, "node_modules")
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules\/)/,
        loader: 'babel-loader'
      }
    ]
  }
};
