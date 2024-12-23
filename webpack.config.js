#!/usr/bin/node

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production', // Set mode to 'production' for optimized builds
  devtool: 'source-map', // Enables source maps for debugging
  entry: './public/js/index.js', // Entry point for your application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'), // Output path for bundled files
    publicPath: '/dist/', // Ensures assets are served from the correct path
    clean: true, // Cleans the output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Transpiles ES6+ to ES5
          },
        },
      },
      {
        test: /\.scss$/, // Adds support for SCSS files
        use: [
          MiniCssExtractPlugin.loader, // Extracts CSS into separate files
          'css-loader', // Translates CSS into CommonJS
          'sass-loader', // Compiles SCSS to CSS
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Supports image assets
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // Supports font assets
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimize: true, // Enables code minimization
    minimizer: [
      new TerserPlugin(), // Minifies JavaScript files
      new CssMinimizerPlugin(), // Minifies CSS files
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(), // Shows build progress
    new MiniCssExtractPlugin({
      filename: '[name].css', // Extracted CSS file naming convention
    }),
  ],
};
