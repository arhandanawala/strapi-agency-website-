'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::homepage.homepage', {
  config: {
    find: {
      auth: false
    }
  }
});