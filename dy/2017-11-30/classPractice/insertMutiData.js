var basic = require('./base');
var debug = require('debug')('log');

basic(function (con) {
  var sql = 'INSERT INTO user (username, password) VALUES ?;';
  var data = [
    ['John', 'Highway 71'],
    ['Peter', 'Lowstreet 4'],
    ['Amy', 'Apple st 652'],
    ['Hannah', 'Mountain 21'],
    ['Michael', 'Valley 345'],
    ['Sandy', 'Ocean blvd 2'],
    ['Betty', 'Green Grass 1'],
    ['Richard', 'Sky st 331'],
    ['Susan', 'One way 98'],
    ['Vicky', 'Yellow Garden 2'],
    ['Ben', 'Park Lane 38'],
    ['William', 'Central st 954'],
    ['Chuck', 'Main Road 989'],
    ['Viola', 'Sideway 1633']
  ];
  con.query(sql, [data], function (err, result) {
    if (err) throw err;
    debug('log' + result);
    debug('log' + 'Number of records inserted: ' + result.affectedRows);
  });
}, 'mydb');