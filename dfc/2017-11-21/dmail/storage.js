const fs = require('fs');
var debug = require('debug')('xxx');
function Storage(filename) {
  this.filename = filename;
}

Storage.prototype.save = function (json, callback) {
  const ws = fs.createWriteStream(this.filename);
  ws.write(JSON.stringify(json));
  ws.end();
  ws.on('finish', function () {
    callback(false);
  });
};

Storage.prototype.read = function (callback) {
  let data = [];
  const rs = fs.createReadStream(this.filename);
  rs.on('data', function (chunk) {
    data.push(chunk);
  });
  rs.on('end', function () {
    try {
      let maxLength = 0;
      for (let i = 0; i < data.length; i++) {
        maxLength += data[i].length;
        debug('log:' + 'chunk' + data[i]);
      }
      debug('log:' + 'data.length' + data.length);
      let str = String(Buffer.concat(data, maxLength));
      debug('log:' + 'str = ');
      debug('log:' + str);
      debug('log:' + str.length);
      if (str.length) {
        var json = JSON.parse(str);
        callback(false, json);
      } else {
        callback(false, []);
      }
    } catch (e) {
      callback(e);
    }
  });
};

exports.Storage = Storage;