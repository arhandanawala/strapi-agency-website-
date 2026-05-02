'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::footer.footer', {
  config: {
    find: {
      auth: false
    }
  }
});
