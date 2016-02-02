var should = require('should');
var Redrum = require('../');

describe('Redrum', function() {
  var redum;
  beforeEach(function() {
    redum = new Redrum();
  });

  ['count', 'measure', 'sample'].forEach(function(method) {
    it('should ' + method, function(done) {
      redum.on(method, function(name, count) {
        name.should.eql('foo');
        count.should.eql(123);
        done();
      });

      redum[method]('foo', 123);
    });
  });

  it('should profile', function(done) {
    redum.on('measure', function(name, count, unit, data) {
      name.should.eql('foo');
      count.should.be.above(9);
      data.should.eql({foo: 'bar', baz: 'bang'});
      done();
    });

    var end = redum.profile('foo', {foo: 'bar'});

    setTimeout(function() {
      end({baz: 'bang'});
    }, 10);
  });

  it('should support contexts', function() {
    var context = redum.context({foo: 'bar'});
    redum.once('count', function(name, count, data) {
      data.should.eql({foo: 'bar'});
    });
    context.count('foo', 1);

    context = context.context({baz: 'bang'});
    redum.once('count', function(name, count, data) {
      data.should.eql({foo: 'bar', baz: 'bang'});
    });
    context.count('foo', 1);
  });

  if (!Redrum.hasPerfomanceTiming) return;

  it('should send performance timing', function() {
    redum.on('measure', function(name, count, measure, data) {
      console.log(name, count, measure, data);
    });

    redum.timing({page: '/foo'});
  });
});
