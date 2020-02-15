/* eslint-disable */
const merge = require('webpack-merge');
const baseConfig = require('./base.config');

const devConfiguration = env => {
  return merge([
    {
        devServer:{
            //host:'0.0.0.0',  <--- Uncomment this line if you'll like to access the app externally
            proxy:{
                '/api': 'http://127.0.0.1:5000',
            }
        }
    }
  ]);
}

module.exports = env => {
  return merge(baseConfig(env), devConfiguration(env));
}