const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = function override(config) {
  addWebpackAlias({
    '@': path.resolve('src')
  })
  return config;
};
