/**
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var now = require('performance-now');

module.exports = Redrum;

function Redrum(data, emitter, shared) {
  this._context = data || {};
  this._shared = shared || {};
  this._emitter = emitter || new EventEmitter();
}

Redrum.hasPerfomanceTiming = (
  typeof window !== 'undefined' &&
  typeof window.performance !== 'undefined' &&
  typeof window.performance.timing !== 'undefined'
);

Redrum.prototype = {
  on: function(name, fn) {
    this._emitter.on(name, fn);
    return this;
  },
  once: function(name, fn) {
    this._emitter.once(name, fn);
    return this;
  },
  off: function(name, fn) {
    var emitter = this._emitter;
    if (arguments.length == 2) {
      emitter.removeListener(name, fn);
    } else {
      emitter.removeAllListeners(name);
    }
    return this;
  },
  count: function(name, value, data) {
    this._emitter.emit('count', name, value, this._inherit(data));
  },
  measure: function(name, value, unit, data) {
    this._emitter.emit('measure', name, value, unit, this._inherit(data));
  },
  sample: function(name, value, data) {
    this._emitter.emit('sample', name, value, this._inherit(data));
  },
  profile: function(name, initialData) {
    var begin = now();
    return function profile(data) {
      if (begin === false) return;
      this.measure(name, Math.floor(now() - begin), 'ms', assign({}, initialData, data));
      begin = false;
    }.bind(this);
  },
  timing: function(prefix, data) {
    var self = this;
    if (!Redrum.hasPerfomanceTiming || self._shared.timingSent) return self;

    if(~['uninitialized', 'loading'].indexOf(document.readyState)) {
      window.addEventListener('load', function() {
        setTimeout(function() {
          self.timing(prefix, data);
        }, 500);
      });
      return self;
    }

    if (typeof prefix === 'object') {
      data = prefix;
      prefix = false;
    }

    self._shared.timingSent = true;
    prefix = prefix ? prefix + '.' : '';

    var timing = window.performance.timing;

    var start = timing.navigationStart;
    for (var key in timing) {
      if (key !== 'navigationStart') self._sendTiming(prefix, key, timing[key], start, data);
    }

    return self;
  },
  context: function(data) {
    return new Redrum(this._inherit(data), this._emitter, this._shared);
  },
  _sendTiming: function(prefix, key, value, start, data) {
    if (typeof value !== 'number' || !value) return;
    var relative = value - start;
    if (relative < 0) relative = value;

    this.measure(prefix + key, relative, 'ms', data);
  },
  _inherit: function(data) {
    return assign({}, this._context, data);
  }
};
