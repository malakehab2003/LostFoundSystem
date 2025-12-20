'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ProductImages',
      [
        { image_url: 'https://example.com/product1-1.jpg', product_id: 11, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product1-2.jpg', product_id: 11, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product2-1.jpg', product_id: 12, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product2-2.jpg', product_id: 12, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product3-1.jpg', product_id: 13, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product3-2.jpg', product_id: 13, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product4-1.jpg', product_id: 14, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product4-2.jpg', product_id: 14, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product5-1.jpg', product_id: 15, created_at: new Date(), updated_at: new Date() },
        { image_url: 'https://example.com/product5-2.jpg', product_id: 15, created_at: new Date(), updated_at: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductImages', null, {});
  },
};
