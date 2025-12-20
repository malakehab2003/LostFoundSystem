'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Wishlists',
      [
        { user_id: 1, product_id: 11, created_at: new Date(), updated_at: new Date() },
        { user_id: 1, product_id: 12, created_at: new Date(), updated_at: new Date() },
        { user_id: 2, product_id: 12, created_at: new Date(), updated_at: new Date() },
        { user_id: 2, product_id: 13, created_at: new Date(), updated_at: new Date() },
        { user_id: 3, product_id: 11, created_at: new Date(), updated_at: new Date() },
        { user_id: 3, product_id: 14, created_at: new Date(), updated_at: new Date() },
        { user_id: 4, product_id: 15, created_at: new Date(), updated_at: new Date() },
        { user_id: 4, product_id: 13, created_at: new Date(), updated_at: new Date() },
        { user_id: 5, product_id: 12, created_at: new Date(), updated_at: new Date() },
        { user_id: 5, product_id: 15, created_at: new Date(), updated_at: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Wishlists', null, {});
  },
};
