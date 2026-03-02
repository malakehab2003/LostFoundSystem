"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Chats", [
      { owner_id: 1, sender_id: 2, created_at: new Date() },
      { owner_id: 1, sender_id: 3, created_at: new Date() },
      { owner_id: 1, sender_id: 4, created_at: new Date() },
      { owner_id: 2, sender_id: 5, created_at: new Date() },
      { owner_id: 2, sender_id: 3, created_at: new Date() },

      { owner_id: 2, sender_id: 4, created_at: new Date() },
      { owner_id: 3, sender_id: 5, created_at: new Date() },
      { owner_id: 3, sender_id: 6, created_at: new Date() },
      { owner_id: 3, sender_id: 4, created_at: new Date() },
      { owner_id: 4, sender_id: 5, created_at: new Date() },

      { owner_id: 4, sender_id: 6, created_at: new Date() },
      { owner_id: 4, sender_id: 7, created_at: new Date() },
      { owner_id: 2, sender_id: 8, created_at: new Date() },
      { owner_id: 1, sender_id: 9, created_at: new Date() },
      { owner_id: 3, sender_id: 10, created_at: new Date() },

      { owner_id: 3, sender_id: 11, created_at: new Date() },
      { owner_id: 2, sender_id: 12, created_at: new Date() },
      { owner_id: 4, sender_id: 13, created_at: new Date() },
      { owner_id: 4, sender_id: 15, created_at: new Date() },
      { owner_id: 1, sender_id: 14, created_at: new Date() },

      { owner_id: 2, sender_id: 16, created_at: new Date() },
      { owner_id: 3, sender_id: 17, created_at: new Date() },
      { owner_id: 1, sender_id: 18, created_at: new Date() },
      { owner_id: 2, sender_id: 19, created_at: new Date() },
      { owner_id: 4, sender_id: 20, created_at: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Chats", null, {});
  },
};