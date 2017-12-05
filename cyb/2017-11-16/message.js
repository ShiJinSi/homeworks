var debug = require('debug')('xxx');
function Message(event, userArr) {
//userArr记录用户的用户名，密码，邮箱信息
  this.event = event;
  debug('log:' +'创建message对象');
    
  this.event.on('register', (user) => {
    debug('log:' +'register事件触发');
    var x = this.email(user);
    userArr.splice(0, 1);
    userArr.push(x);
  });
}

Message.prototype.email = function (user) {
  var msg = ('用户名:' + user.username + ' 密码:' + user.password + ' 邮箱:' + user.email);
  return msg;

};
exports.Message = Message;
