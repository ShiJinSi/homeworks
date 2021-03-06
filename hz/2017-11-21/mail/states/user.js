var debug = require('debug')('xxx');
let states = require('../states').states;
const UserManager = require('../entities/user').User;
function User(socket) {
  socket.on(states.USER_NOT_LOGIN,
    (machine, socket, data) => {
      this.stateNotLogin(machine, socket, data);
    });
  socket.on(states.USER_LOGIN,
    (machine, socket, data) => {
      this.stateLogin(machine, socket, data);
    });
}

User.prototype.notLoginHome = function (machine, socket) {
  debug('log:' + 'inside user not login');
  socket.write('欢迎来到XXX邮件系统！请选择:\n\t1.用户注册\n\t2.用户登录\n');
  machine.action = 'wait';
};

User.prototype.notLoginWait = function (machine, socket, data) {
  let input = machine.getCleanedString(socket, data);
  debug('log:' + 'input = ' + input);
  switch (input) {
  case '1': //--注册
    debug('log:' + 'inside not login wait 1');
    this.registerWait(machine, socket, data);
    break;
  case '2'://--登录
    debug('log:' + 'inside not login wait 2');
    this.loginWait(machine, socket, data);
    break;
  default:
    debug('log:' + 'inside not login wait default');
    break;
  }
};

User.prototype.stateNotLogin = function (machine, socket, data) {
  debug('log:' + 'inside not login');
  if (!machine.action) {  //action=“” 选择登录或者注册 页面执行步骤2
    debug('log:' + 'inside not login home');
    this.notLoginHome(machine, socket, data);
  } else {
    debug('log:' + 'inside not login else');
    switch (machine.action) {
    case 'register'://注册action
      this.register(machine, socket, data);
      break;
    case 'login'://登录action
      debug('log:' + 'inside login');
      this.login(machine, socket, data);
      break;
    case 'wait': //wait
      debug('log:' + 'inside not login wait');
      this.notLoginWait(machine, socket, data);
      break;
    }
  }
};

User.prototype.registerWait = function (machine, socket) {
  socket.write('\n请输入注册邮箱和密码，格式： 邮箱 密码\n');
  machine.action = 'register';
};

User.prototype.loginWait = function (machine, socket) {
  socket.write('\n请输入登录邮箱和密码，格式： 邮箱 密码\n');
  machine.action = 'login';
};

User.prototype.register = function (machine, socket, data) {
  let input = machine.getCleanedString(socket, data);
  input = input.split(' ');
  if (input.length === 2) {
    // User Register
    UserManager.register(socket, input[0], input[1], (err) => {
      if (err) {
        socket.write('\n用户已经存在！\n');
        return;
      }
      socket.write('\n注册成功！\n');
      this.loginWait(machine, socket, data);
    });
  } else {
    socket.write('输入错误!');
  }
};

User.prototype.login = function (machine, socket, data) {
  let input = machine.getCleanedString(socket, data);
  input = input.split(' ');
  if (input.length === 2) {
    // User Register
    UserManager.login(socket, input[0], input[1], (err) => {
      if (err) {
        socket.write('\n用户名或者密码不匹配！\n');
        return;
      }
      socket.write('\n登录成功！\n');
      machine.state = states.USER_LOGIN;
      machine.action = '';
      machine.process(socket, data);
    });
  } else {
    socket.write('输入错误!');
  }
};

User.prototype.stateLogin = function (machine, socket, data) {
  debug('log:' + 'inside login');
  if (!machine.action) {//action = “ ”
    debug('log:' + 'inside not login home');
    this.loginHome(machine, socket, data);
  } else {
    debug('log:' + 'inside not login else');
    switch (machine.action) {
    case 'wait':
      debug('log:' + 'inside not login wait');
      this.homeWaite(machine, socket, data);
      break;
    }
  }
};

User.prototype.loginHome = function (machine, socket) {
  socket.write('\n你已经成功登录邮件系统\n\t1.编写邮件\n\t2.查看邮件\n请输入：');
  machine.action = 'wait';
};

User.prototype.homeWaite = function (machine, socket, data) {
  let input = machine.getCleanedString(socket, data);
  debug('log:' + 'input = ' + input);
  switch (input) {
  case '1':   //触发写邮件事件
    debug('log:' + 'inside mail write');
    socket.write('mail write');
    machine.state = states.MAIL_WRITE;
    machine.action = '';
    socket.emit(states.MAIL_WRITE, machine, socket, data);
    break;
  case '2':  //触发读邮件事件
    debug('log:' + 'inside mail write');
    socket.write('mail read');
    machine.state = states.MAIL_READ;
    machine.action = '';
    socket.emit(states.MAIL_READ, machine, socket, data);
    break;
  default:
    debug('log:' + 'inside not login wait default');
    break;
  }
};

exports.User = User;