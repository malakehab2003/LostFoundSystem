'use strict';
/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductCategories', [
      { name: 'Electronics', created_at: new Date(), updated_at: new Date() },
      { name: 'Clothing', created_at: new Date(), updated_at: new Date() },
      { name: 'Books', created_at: new Date(), updated_at: new Date() },
      { name: 'Home & Kitchen', created_at: new Date(), updated_at: new Date() },
      { name: 'Toys & Games', created_at: new Date(), updated_at: new Date() },
      { name: 'Sports', created_at: new Date(), updated_at: new Date() },
      { name: 'Health & Beauty', created_at: new Date(), updated_at: new Date() },
      { name: 'Automotive', created_at: new Date(), updated_at: new Date() },
      { name: 'Music & Instruments', created_at: new Date(), updated_at: new Date() },
      { name: 'Pet Supplies', created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductCategories', null, {});
  }
};
