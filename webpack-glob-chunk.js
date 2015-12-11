var webpack = require('webpack');
var path = require('path');
var _ = require('lodash');
var minimatch = require('minimatch');

function matchesPatterns(module, patterns) {
  var modulePath = module.resource;

  if (!modulePath) {
    return false;
  }

  for (var i in patterns) {
    var matched = minimatch(modulePath, patterns[i]);
    if (matched) {
      return true;
    }
  }

  return false;
}

function createGlobChunk(opts) {
  var patterns = opts.patterns.map(function(pattern) {
    return path.resolve(process.cwd(), pattern);
  });

  var pluginOpts = _.merge({
    minChunks: function(module) {
      return matchesPatterns(module, patterns);
    }
  }, opts);

  return new webpack.optimize.CommonsChunkPlugin(pluginOpts);
}

module.exports = createGlobChunk;
