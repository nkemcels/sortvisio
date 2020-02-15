const webpack = require('webpack');
const merge = require("webpack-merge");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CopyPlugin = require('copy-webpack-plugin');

const path = require("path");
const APP_DIR = path.resolve(__dirname, '..', 'src', 'index.jsx');

module.exports = env => {
  const { PLATFORM } = env;
  return merge([
      {
        devtool: PLATFORM!=="production"?'source-map':false,
        entry: ['@babel/polyfill', APP_DIR],
        module: {
          rules: [
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader'
              }
            },
            {
              test: /\.s?css$/,
              use: [
                PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                'css-loader',
                'sass-loader'
              ]
            },
            {
              test: /\.(png|jpe?g|gif)$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    outputPath: 'images',
                  },
                },
              ],
            },
            {
                test: /\.(woff2?|eot|ttf|svg)$/,
                use: [
                  {
                    loader: 'file-loader?name="[name]-[hash].[ext]"',
                    options: {
                      outputPath: 'fonts',
                    },
                  },
                ]
            }
          ]
        },
        plugins: [
          new webpack.DefinePlugin({ 
            'process.env.VERSION': JSON.stringify(env.VERSION),
            'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
          }),
          new CopyPlugin([
            { from: './favicon.png' },
            { from: "./index.html"}
          ]),
        ],
    }
  ])
};