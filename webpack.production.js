var webpack = require('webpack');
var webpackMerge = require('webpack-merge');

var config = require('./webpack.config');

module.exports = webpackMerge(config, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new webpack.optimize.UglifyJsPlugin()
  ],
});
