'use strict';

const Service = require('egg').Service;
const SMSClient = require('@alicloud/sms-sdk');

class SMSService extends Service {

  async send(mobile, templateName, data, debugData) {
    const { accessKeyId, secretAccessKey, debug, template } = this.config.sms;
    if (debug) { // 调试不发送
      this.ctx.logger.warn('[短信发送调试,未真实发送]');
      return debugData;
    }
    try {
      const smsClient = new SMSClient({ accessKeyId, secretAccessKey });
      const res = await smsClient.sendSMS({
        PhoneNumbers: mobile,
        ...template[templateName],
        TemplateParam: JSON.stringify(data),
      });
      if (res.Code !== 'OK') {
        this.ctx.logger.error('[短信发送失败]: %j', res);
        return null;
      }
      return data;
    } catch (err) {
      this.ctx.logger.error('[短信发送失败]: %j', err);
      return null;
    }
  }
}

module.exports = SMSService;
