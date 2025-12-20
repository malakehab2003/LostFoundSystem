'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Carts',
      [
        {
          quantity: 2,
          color: 'Black',
          size: 'M',
          user_id: 1,
          product_id: 11,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          color: 'White',
          size: 'L',
          user_id: 1,
          product_id: 12,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 3,
          color: 'Red',
          size: 'S',
          user_id: 2,
          product_id: 11,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          color: 'Blue',
          size: 'XL',
          user_id: 2,
          product_id: 13,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 4,
          color: null,
          size: null,
          user_id: 3,
          product_id: 14,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 2,
          color: 'Green',
          size: 'M',
          user_id: 3,
          product_id: 12,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          color: 'Black',
          size: 'S',
          user_id: 4,
          product_id: 15,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 5,
          color: 'Brown',
          size: 'L',
          user_id: 4,
          product_id: 11,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 2,
          color: 'Gray',
          size: 'M',
          user_id: 5,
          product_id: 13,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          quantity: 1,
          color: null,
          size: null,
          user_id: 5,
          product_id: 14,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carts', null, {});
  },
};
