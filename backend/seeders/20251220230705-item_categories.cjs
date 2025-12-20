'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ItemCategories',
      [
        {
          name: 'Electronics',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Clothing',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Shoes',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Accessories',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Home Appliances',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Books',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Sports',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Beauty & Health',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Toys',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Groceries',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ItemCategories', null, {});
  },
};
