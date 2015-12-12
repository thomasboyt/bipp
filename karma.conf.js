var webpack = require('webpack');

var defaultConfig = require('./webpack.config');

var webpackConfig = {
  devtool: 'inline-dev-tool',

  module: defaultConfig.module,

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"test"'
      }
    })
  ],
};

module.exports = function(config) {
  config.set({

    browsers: ['Chrome'],
    frameworks: ['mocha'],
    reporters: ['mocha'],

    files: [
      'app/__tests__/index.js',
    ],

    preprocessors: {
      'app/__tests__/index.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackServer: {
      noInfo: true,
    },
  });
};
