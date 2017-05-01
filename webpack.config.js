var path = require('path');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');

module.exports = {
    entry: {App: [
      'webpack-dev-server/client?http://localhost:8080/build/',
      './app/main.js'
    ]},
    output: {
        path: path.join(__dirname , 'build'),
        filename: "bundle.js",
        publicPath: 'http://localhost:8080/build'
    },
    // watch: true,
    module: {
      loaders: [
        {
          test: /(\.css|\.scss)$/,
          loaders: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['react', 'es2015']
          }
        }
      ]
    }
};
