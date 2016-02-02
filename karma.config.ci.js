var base = require('./karma.config');
var browsers = {};

var customLaunchers = {
  'SL_Chrome': {
    base: 'SauceLabs',
    browserName: 'chrome'
  },
  'SL_Firefox': {
    base: 'SauceLabs',
    browserName: 'firefox'
  },
  'SL_Safari': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10'
  },
  'SL_IE_10': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2012',
    version: '10'
  },
  'SL_IE_11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11'
  },
  'SL_iOS': {
    base: "SauceLabs",
    browserName: "iphone",
    platform: "OS X 10.10",
  }
};

module.exports = function(config) {
  base(config);

  config.set({
    sauceLabs: {
      testName: 'camshaft/redrum',
      startConnect: true
    },

    reporters: ['dots', 'saucelabs'],

    captureTimeout: 120000,
    customLaunchers: customLaunchers,

    browsers: Object.keys(customLaunchers),

    singleRun: true,

    plugins: [
      'karma-sauce-launcher',
      'karma-mocha',
      'karma-should',
      'karma-webpack'
    ],
  })
}
