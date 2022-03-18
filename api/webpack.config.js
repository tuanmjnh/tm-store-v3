const path = require('path');
const webpack = require('webpack')
// const fs = require('fs');
const nodeExternals = require('webpack-node-externals')
// const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
// var dotenv = require('dotenv').config({ path: __dirname + '.env' });
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// var nodeModules = {}
// fs.readdirSync('node_modules')
//   .filter(function(x) {
//     return ['.bin'].indexOf(x) === -1
//   })
//   .forEach(function(mod) {
//     nodeModules[mod] = 'commonjs ' + mod
//   })

module.exports = {
  entry: ['babel-polyfill', './src/server.js'],
  output: {
    path: path.join(__dirname, 'dist'), // '/Application/vnptbkn.express',
    filename: 'server.js',
    publicPath: '/'
  },
  externals: [nodeExternals()], // Need this to avoid error when // nodeModules,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        // Transpiles ES6-8 into ES5
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
            // options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(s*)css$/, // match any .scss or .css file,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // new CleanWebpackPlugin(),
    // new CopyPlugin([
    //   { from: './src/public/', to: './public/' },
    //   { from: '.env', to: './' },
    //   { from: './statics/', to: './' }
    // ])

    new CopyPlugin({
      patterns: [
        { from: './src/public/', to: './public/' },
        { from: '.env', to: './' },
        { from: './statics/', to: './' }
      ]
    })
    // new webpack.DefinePlugin({
    //   // 'process.env': dotenv.parsed
    //   'process.env': {
    //     NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    //   }
    // })
    // new HtmlWebPackPlugin({
    //   template: './public/index.html',
    //   filename: './index.html',
    //   excludeChunks: ['server']
    // })
  ],
  // module: {
  //   rules: [
  //     {
  //       test: /\.(js|jsx)$/,
  //       exclude: /node_modules/,
  //       use: {
  //         loader: 'babel-loader'
  //       }
  //     }
  //   ]
  target: 'node',
  // devtool: 'sourcemap',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
    // fs: 'empty'
  }
}
