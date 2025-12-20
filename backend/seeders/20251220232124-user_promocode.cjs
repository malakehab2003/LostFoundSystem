'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'UserPromoCodes',
      [
        { user_id: 1, promo_code_id: 1, created_at: new Date(), updated_at: new Date() },
        { user_id: 1, promo_code_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 2, promo_code_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 2, promo_code_id: 3, created_at: new Date(), updated_at: new Date() },
        { user_id: 3, promo_code_id: 1, created_at: new Date(), updated_at: new Date() },
        { user_id: 3, promo_code_id: 4, created_at: new Date(), updated_at: new Date() },
        { user_id: 4, promo_code_id: 5, created_at: new Date(), updated_at: new Date() },
        { user_id: 4, promo_code_id: 3, created_at: new Date(), updated_at: new Date() },
        { user_id: 5, promo_code_id: 2, created_at: new Date(), updated_at: new Date() },
        { user_id: 5, promo_code_id: 5, created_at: new Date(), updated_at: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserPromoCodes', null, {});
  },
};
