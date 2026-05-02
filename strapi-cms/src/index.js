const ensurePermission = async (roleId, action) => {
  const permissionQuery = strapi.db.query('plugin::users-permissions.permission');
  const existing = await permissionQuery.findOne({
    where: {
      role: roleId,
      action
    }
  });

  if (!existing) {
    await permissionQuery.create({
      data: {
        role: roleId,
        action,
        enabled: true
      }
    });
    return;
  }

  if (!existing.enabled) {
    await permissionQuery.update({
      where: { id: existing.id },
      data: { enabled: true }
    });
  }
};

module.exports = {
  register() {},
  async bootstrap() {
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      return;
    }

    const actions = [
      'api::page.page.find',
      'api::page.page.findOne',
      'api::site-setting.site-setting.find',
      'api::site-theme.site-theme.find',
      'api::service.service.find',
      'api::service.service.findOne',
      'api::testimonial.testimonial.find',
      'api::testimonial.testimonial.findOne',
      'api::contact-submission.contact-submission.create'
    ];

    for (const action of actions) {
      await ensurePermission(publicRole.id, action);
    }
  }
};
