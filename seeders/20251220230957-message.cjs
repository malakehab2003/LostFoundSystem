'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Messages',
      [
        {
          sender_id: 1,
          receiver_id: 2,
          item_id: 1,
          content: 'Hi, I think I might have seen your lost wallet.',
          sent_at: new Date(),
        },
        {
          sender_id: 2,
          receiver_id: 1,
          item_id: 1,
          content: 'Really? Where did you see it?',
          sent_at: new Date(),
        },
        {
          sender_id: 3,
          receiver_id: 4,
          item_id: 2,
          content: 'I found a phone that might belong to you.',
          sent_at: new Date(),
        },
        {
          sender_id: 4,
          receiver_id: 3,
          item_id: 2,
          content: 'Thank you! Can you describe it?',
          sent_at: new Date(),
        },
        {
          sender_id: 5,
          receiver_id: 1,
          item_id: 3,
          content: 'Is this backpack blue with a laptop inside?',
          sent_at: new Date(),
        },
        {
          sender_id: 1,
          receiver_id: 5,
          item_id: 3,
          content: 'Yes! That sounds like mine.',
          sent_at: new Date(),
        },
        {
          sender_id: 2,
          receiver_id: 3,
          item_id: 4,
          content: 'I found some keys near Nasr City.',
          sent_at: new Date(),
        },
        {
          sender_id: 3,
          receiver_id: 2,
          item_id: 4,
          content: 'Great! How can I get them back?',
          sent_at: new Date(),
        },
        {
          sender_id: 4,
          receiver_id: 5,
          item_id: 5,
          content: 'I think the watch you lost is with me.',
          sent_at: new Date(),
        },
        {
          sender_id: 5,
          receiver_id: 4,
          item_id: 5,
          content: 'That’s amazing, thank you so much!',
          sent_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', null, {});
  },
};
