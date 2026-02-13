'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert(
      'comments',
      [
        {
          content: 'Is this item still available?',
          user_id: 1,
          item_id: 28,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          content: 'I think this belongs to my friend.',
          user_id: 2,
          item_id: 28,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          content: 'Where did you find it exactly?',
          user_id: 3,
          item_id: 30,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('comments', null, {});
  }
};
