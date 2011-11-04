var common       = require('../common');
var assert       = require('assert');
var CarbonClient = require(common.dir.lib + '/carbon_client');

function SocketDummy() {
  this._writes = [];
}

SocketDummy.prototype.write = function() {
  this._writes.push(arguments);
};

(function testSingleWrite() {
  var client = new CarbonClient(new SocketDummy());

  client.write('foo.bar', 25);
  assert.equal(client.socket._writes.length, 1);

  var args = client.socket._writes.shift();
  assert.ok(/^foo\.bar 25 [\d]+\n/.test(args[0]), args[0]);
  assert.equal(args[1], 'utf8');
  assert.equal(args[2], undefined);
})();

(function testSingleWriteWithCallback() {
  var client = new CarbonClient(new SocketDummy());
  var cb     = function() {};

  client.write('foo.bar', 25, cb);
  assert.equal(client.socket._writes.length, 1);

  var args = client.socket._writes.shift();
  assert.ok(/^foo\.bar 25 [\d]+\n/.test(args[0]), args[0]);
  assert.equal(args[2], cb);
})();

(function testSingleWriteWithTimestamp() {
  var client = new CarbonClient(new SocketDummy());
  var cb     = function() {};

  client.write('foo.bar', 25, 2001, cb);
  assert.equal(client.socket._writes.length, 1);

  var args = client.socket._writes.shift();
  assert.ok(/^foo\.bar 25 2\n/.test(args[0]), args[0]);
  assert.equal(args[2], cb);
})();

(function testBatchWrite() {
  var client = new CarbonClient(new SocketDummy());
  var cb     = function() {};

  client.write([
    {path: 'one', value: 30, timestamp: 9000},
    {path: 'two', value: 33, timestamp: 8000},
  ], cb);
  assert.equal(client.socket._writes.length, 1);

  var args = client.socket._writes.shift();
  assert.ok(/^one 30 9\ntwo 33 8\n/.test(args[0]), args[0]);
  assert.equal(args[2], cb);
})();
