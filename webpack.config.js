/* eslint-env node */
const ENV = process.env;
const isProduction = ENV.NODE_ENV === 'production';

module.exports = {
  entry: {
    dashboard: 'entrypoints/dashboard.jsx',
  },
  output: {
    path: 'public/scripts',
    filename: isProduction
      ? '[name].bundle.js'
      : '[name].js?[hash]',
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    alias: {
      entrypoints: './src/client/entrypoints',
      'public': './src/server/public',
    },
  },
  devtool: isProduction
    ? 'source-map'
    : 'cheap-module-eval-source-map',
  module: {
    loaders: [{
      test: /\.jsx$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
      },
    }],
  },
};
