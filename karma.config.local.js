var base = require('./karma.config');

module.exports = function(config) {
  base(config);
  config.set({
    browsers: ['Chrome', 'Firefox', 'Safari', 'PhantomJS'],

    autoWatch: true,
    singleRun: false,

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-safari-launcher',
      'karma-should',
      'karma-webpack'
    ],
  })
}
