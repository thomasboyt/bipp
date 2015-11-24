var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    app: './app/main.js',
    vendor: [
      'react',
      'react-router',
      'redux',
      'immutable',
      'lodash',
      'babel-runtime/core-js',
      'babel-runtime/regenerator',
      'react-bootstrap',
      'react-hotkeys',
      'react-immutable-render-mixin'
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
    root: path.join(__dirname, 'node_modules')
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ],

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules\/)/,
        loader: 'babel-loader',
        query: {
          'optional': ['es7.asyncFunctions', 'runtime']
        }
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /(?:\.woff$|\.woff2$|\.ttf$|\.svg$|\.eot$)/,
        loader: 'file-loader',
        query: {
          name: '/font/[hash].[ext]'
        }
      },
      {
        test: /(?:\.mp3)/,
        loader: 'file-loader',
        query: {
          name: 'assets/[hash].[ext]'
        }
      },
      {
        test: /(?:\.json)/,
        loader: 'json-loader'
      }

    ]
  }
};
