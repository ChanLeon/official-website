'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/aboutUs', controller.home.aboutUs);
  router.get('/product', controller.home.product);
  router.get('/agent', controller.home.agent);

  router.post('/vccode', controller.home.vccode);
  router.post('/register', controller.home.register);

  router.get('/help/:type', controller.home.help);
  router.get('/guide/:type', controller.home.guide);
};
