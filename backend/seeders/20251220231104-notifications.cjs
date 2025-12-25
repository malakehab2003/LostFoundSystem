'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Notifications',
      [
        {
          description: 'New Message',
          message: 'You have received a new message regarding your lost item.',
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Order Update',
          message: 'Your order has been shipped successfully.',
          user_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Promo Code',
          message: 'A new promo code is available for you!',
          user_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Item Found',
          message: 'Someone found an item similar to the one you lost.',
          user_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Order Delivered',
          message: 'Your order has been delivered.',
          user_id: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'New Message',
          message: 'You have a new reply in your conversation.',
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Item Update',
          message: 'Your item status has been updated.',
          user_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Security Alert',
          message: 'A new login was detected on your account.',
          user_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Reminder',
          message: 'Don’t forget to complete your pending actions.',
          user_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Welcome',
          message: 'Welcome to our platform! We’re glad to have you.',
          user_id: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
    description: 'Promo Code',
    message: 'Use code SAFE10 for 10% off on secure item recovery.',
    user_id: 8,
    created_at: new Date(),
    updated_at: new Date(),
  },
   {
    description: 'Reminder',
    message: 'You have pending items that need verification.',
    user_id: 6,
    created_at: new Date(),
    updated_at: new Date(),
  },
   {
    description: 'New Message',
    message: 'You have a new reply regarding your lost backpack.',
    user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },      
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notifications', null, {});
  },
};
