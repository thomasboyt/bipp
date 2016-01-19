/*
 * Custom webpack config that gets merged into default config
 */

// import webpack from 'webpack';

import path from 'path';

export default function generateConfig(environment) {
  return {
    module: {
      loaders: [
        {
          test: /\.less$/,
          loader: 'style-loader!css-loader!less-loader'
        },

        {
          test: /\.js$/,
          include: [path.join(process.cwd(), 'songs/')],
          loader: 'babel-loader'
        },
        {
          test: /(?:\.mp3$)/,
          loader: 'file-loader',
          query: {
            name: './assets/[hash].[ext]'
          }
        },
      ]
    }
  };
}
