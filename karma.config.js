module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['mocha', 'should'],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'test/*.test.js',
      'test/**/*.test.js'
    ],

    exclude: [
    ],

    preprocessors: {
      'test/*.test.js': ['webpack'],
      'test/**/*.test.js': ['webpack']
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    concurrency: Infinity,

    webpack: require('poe-ui-builder')(__dirname + '/test', require('webpack'))
  })
}
