'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::contact-submission.contact-submission', {
  config: {
    create: {
      auth: false
    }
  }
});