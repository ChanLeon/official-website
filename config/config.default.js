'use strict';

const fs = require('fs');
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1513042955581_3710';

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, './app/public/favicon.ico')),
  };

  // add your config here
  config.middleware = [];

  config.appurl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kingxbox_app_user&fromcase=40002&from=singlemessage';

  config.httpclient = {
    enableDNSCache: true,
    request: {
      dataType: 'json',
    },
  };

  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
    defaultViewEngine: 'ejs',
    defaultExtension: '.ejs',
  };

  config.static = {
    prefix: '/',
  };

  config.development = {
    ignoreDirs: [
      'app/web',
    ],
  };

  config.security = {
    csrf: false,
  };

  config.restConfig = 'http://kbrest:8080';

  config.sms = {
    accessKeyId: 'LTAIoPYzbegguDQP',
    secretAccessKey: 'sYzNmXNjkTXWEoO82R0LePCO1MOsx3',
    template: {
      register: {
        SignName: '金匣子',
        TemplateCode: 'SMS_113220018',
      },
    },
  };

  return config;
};
