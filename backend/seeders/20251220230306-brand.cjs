'use strict';
/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Brands', [
      { name: 'Brand A', created_at: new Date(), updated_at: new Date() },
      { name: 'Brand B', created_at: new Date(), updated_at: new Date() },
      { name: 'Brand C', created_at: new Date(), updated_at: new Date() },
      { name: 'Brand D', created_at: new Date(), updated_at: new Date() },
      { name: 'Brand E', created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', null, {});
  }
};