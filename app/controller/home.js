'use strict';

const Controller = require('egg').Controller;

const random = () => {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

const VALIDATE = {
  MOBILE: {
    type: 'string',
    format: /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/,
  },
  PASSWORD: {
    type: 'string',
    format: /^\S{6,20}$/,
  },
};

class HomeController extends Controller {

  async index() {
    await this.ctx.render('index');
  }

  async product() {
    const { spreadBy, channel } = this.ctx.request.query;

    const user_agent = this.ctx.headers['user-agent'].toLowerCase();

    this.ctx.logger.debug('移动端: %s 匹配: %s', user_agent, user_agent.match(/(iphone|ipod|android)/));

    let qrcode = user_agent.match(/(iphone|ipod|android)/) ? 'mbCode' : 'pcCode';
    console.log('qrcode===', qrcode);

    await this.ctx.render(user_agent.match(/(iphone|ipod|android)/) ? 'product_mb' : 'product_pc', {
      productCode: qrcode,
      spreadBy: spreadBy || '',
      channel: channel || '',
      appurl: this.config.appurl,
    });
  }

  async agent() {
    const { code, channel } = this.ctx.request.query;

    const user_agent = this.ctx.headers['user-agent'].toLowerCase();

    this.ctx.logger.debug('移动端: %s 匹配: %s', user_agent, user_agent.match(/(iphone|ipod|android)/));

    await this.ctx.render(user_agent.match(/(iphone|ipod|android)/) ? 'agent_mb' : 'agent_pc', {
      code: code || '',
      channel: channel || '',
      appurl: this.config.appurl,
    });
  }

  async vccode() {
    this.ctx.validate({
      mobile: VALIDATE.MOBILE,
    });
    const { mobile } = this.ctx.request.body;
    const code = await this.ctx.service.sms.send(mobile, 'register', { code: random() }, { code: '1234' });
    if (code) {
      this.ctx.session.vccode = code.code;
      this.ctx.body = {
        code: 0,
      };
    } else {
      this.ctx.body = {
        code: 101,
        message: '发送短信失败',
      };
    }
  }

  async register() {
    this.ctx.validate({
      mobile: VALIDATE.MOBILE,
      password: VALIDATE.PASSWORD,
      vccode: 'string',
    });

    const { vccode } = this.ctx.request.body;
    this.ctx.logger.debug('验证码: %s,%s', vccode, this.ctx.session.vccode);
    if (vccode !== this.ctx.session.vccode) {
      this.ctx.body = {
        code: 101,
        message: '验证码错误',
      };
      return;
    }
    const result = await this.ctx.curl(`${this.config.restConfig}/user`, {
      method: 'POST',
      data: this.ctx.request.body,
    });
    this.ctx.logger.debug('注册结果: %j', result);
    this.ctx.body = {
      code: result.data.code,
      message: result.data.message,
    };
  }

  async help() {
    const { type } = this.ctx.params;
    if (type !== 'index' && type !== 'spread' && type !== 'trade') {
      this.ctx.status = 404;
    } else {
      await this.ctx.render(`help_${type}`);
    }
  }

  async guide() {
    const { type } = this.ctx.params;
    if (type !== 'index' && type !== 'setAccount' && type !== 'setPayPsw' && type !== 'gather' && type !== 'improveInfo' && type !== 'invite' && type !== 'profit') {
      this.ctx.status = 404;
    }else {
      await this.ctx.render(`guide_${type}`);
    }
  }

  async aboutUs() {
    await this.ctx.render('about_us');
  }
}

module.exports = HomeController;
