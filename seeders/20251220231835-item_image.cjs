'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ItemImages',
      [
        { image_url: 'https://example.com/item1-1.jpg', item_id: 1, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/item1-2.jpg', item_id: 1, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/item2-1.jpg', item_id: 2, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/item2-2.jpg', item_id: 2, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/item3-1.jpg', item_id: 3, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/item4-1.jpg', item_id: 4, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/item5-1.jpg', item_id: 5, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/item5-2.jpg', item_id: 5, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/item5-3.jpg', item_id: 5, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/item3-2.jpg', item_id: 3, created_at: new Date(), updated_at: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ItemImages', null, {});
  },
};
