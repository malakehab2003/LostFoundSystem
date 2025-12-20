'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Items',
      [
        {
          title: 'Lost Wallet',
          location: 'Downtown Cairo',
          type: 'lost',
          description: 'Black leather wallet with several cards',
          user_id: 1,
          item_category_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Found Mobile Phone',
          location: 'Alexandria Corniche',
          type: 'found',
          description: 'Samsung phone found near the beach',
          user_id: 2,
          item_category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Lost Backpack',
          location: 'Giza Metro Station',
          type: 'lost',
          description: 'Blue backpack with laptop inside',
          user_id: 3,
          item_category_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Found Keys',
          location: 'Nasr City',
          type: 'found',
          description: 'House keys with red keychain',
          user_id: 4,
          item_category_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Lost Watch',
          location: 'Mall of Egypt',
          type: 'lost',
          description: 'Silver wrist watch, brand unknown',
          user_id: 5,
          item_category_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Found Headphones',
          location: 'Cairo University',
          type: 'found',
          description: 'Wireless black headphones',
          user_id: 1,
          item_category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Lost ID Card',
          location: 'Heliopolis',
          type: 'lost',
          description: 'National ID card issued in Cairo',
          user_id: 2,
          item_category_id: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Found Sunglasses',
          location: 'New Cairo',
          type: 'found',
          description: 'Brown sunglasses found in a cafe',
          user_id: 3,
          item_category_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Lost Jacket',
          location: 'October City',
          type: 'lost',
          description: 'Black winter jacket size L',
          user_id: 4,
          item_category_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Found Power Bank',
          location: 'Ramses Station',
          type: 'found',
          description: 'White power bank, 20000mAh',
          user_id: 5,
          item_category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {});
  },
};
