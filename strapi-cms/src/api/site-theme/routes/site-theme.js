'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::site-theme.site-theme', {
  config: {
    find: {
      auth: false
    }
  }
});