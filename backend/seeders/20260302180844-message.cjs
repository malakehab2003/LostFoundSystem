'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Messages',
      [
  {
    sender_id: 1,
    chat_id: 2,
    content: 'Hi, I think I might have seen your lost wallet near Tahrir Square earlier today. It looked just like the picture you uploaded, so I picked it up for you.',
    created_at: new Date(),
  },
  {
    sender_id: 2,
    chat_id: 1,
    content: 'Oh wow, really? Thank you so much! Where can we meet so I can collect it from you?',
    created_at: new Date(),
  },
  {
    sender_id: 3,
    chat_id: 4,
    content: 'I found a phone that might belong to you. The color and model match what you described in your post. I can drop it off at a safe place for you.',
    created_at: new Date(),
  },
  {
    sender_id: 4,
    chat_id: 3,
    content: 'That’s perfect! I appreciate it. I can meet you at the coffee shop near your area to pick it up.',
    created_at: new Date(),
  },
  {
    sender_id: 5,
    chat_id: 1,
    content: 'Is this backpack blue with a laptop inside? I found one near the metro station and it looks important.',
    created_at: new Date(),
  },
  {
    sender_id: 1,
    chat_id: 5,
    content: 'Yes! That’s mine. Thank you for keeping it safe. I can come by your place to get it whenever you’re free.',
    created_at: new Date(),
  },
  {
    sender_id: 2,
    chat_id: 3,
    content: 'I found some keys near Nasr City. They have a small red keychain attached — is that yours?',
    created_at: new Date(),
  },
  {
    sender_id: 3,
    chat_id: 2,
    content: 'Yes, that’s definitely mine. Thank you for finding them. I can meet you at the parking lot near the mall to collect them.',
    created_at: new Date(),
  },
  {
    sender_id: 4,
    chat_id: 5,
    content: 'I believe this is the watch you lost. I picked it up from the bench near the park to keep it safe for you.',
    created_at: new Date(),
  },
  {
    sender_id: 5,
    chat_id: 4,
    content: 'That’s amazing, thanks a lot! The strap and design match perfectly. I can come by to pick it up today.',
    created_at: new Date(),
  },
   {
    sender_id: 6,
    chat_id: 7,
    content: 'Hey, I found a pair of sunglasses that looks like yours at the beach today. I kept them safe for you.',
    created_at: new Date(),
  },
  {
    sender_id: 7,
    chat_id: 6,
    content: 'Oh, perfect! Thank you so much. Can I come by your place to pick them up?',
    created_at: new Date(),
  },
  {
    sender_id: 8,
    chat_id: 9,
    content: 'I think I found your wallet near the bus station. It had a blue cover, right?',
    created_at: new Date(),
  },
  {
    sender_id: 9,
    chat_id: 8,
    content: 'Yes! That’s mine. I really appreciate it. Where can we meet to collect it?',
    created_at: new Date(),
  },
  {
    sender_id: 10,
    chat_id: 11,
    content: 'I found a handbag that matches the description from your post. It’s in good condition.',
    created_at: new Date(),
  },
  {
    sender_id: 11,
    chat_id: 10,
    content: 'Amazing, thank you! Can we meet at the cafe near the metro station to get it?',
    created_at: new Date(),
  },
  {
    sender_id: 12,
    chat_id: 13,
    content: 'I picked up a set of keys that might belong to you. They have a green keychain attached.',
    created_at: new Date(),
  },
  {
    sender_id: 13,
    chat_id: 12,
    content: 'Yes! Those are mine. Thank you for keeping them safe. I can come collect them this afternoon.',
    created_at: new Date(),
  },
  {
    sender_id: 14,
    chat_id: 15,
    content: 'I found your lost scarf near the market. It’s red with white stripes, correct?',
    created_at: new Date(),
  },
  {
    sender_id: 15,
    chat_id: 14,
    content: 'Exactly! Thank you so much. I can come by the market entrance to pick it up.',
    created_at: new Date(),
  },
  {
    sender_id: 16,
    chat_id: 17,
    content: 'I think this backpack belongs to you. Found it near the park entrance.',
    created_at: new Date(),
  },
  {
    sender_id: 17,
    chat_id: 16,
    content: 'Yes! That’s definitely mine. Thanks for keeping it safe. When can I pick it up?',
    created_at: new Date(),
  },
  {
    sender_id: 18,
    chat_id: 19,
    content: 'I found a pair of shoes matching your post. They are black with white stripes.',
    created_at: new Date(),
  },
  {
    sender_id: 19,
    chat_id: 18,
    content: 'Perfect! That’s mine. I appreciate it. I can come by the main street to collect them.',
    created_at: new Date(),
  },
  {
    sender_id: 20,
    chat_id: 21,
    content: 'I found your lost umbrella. It’s blue and has a wooden handle, right?',
    created_at: new Date(),
  },
  {
    sender_id: 21,
    chat_id: 20,
    content: 'Yes, exactly! Thank you! I can meet you near the coffee shop to pick it up.',
    created_at: new Date(),
  },
  {
    sender_id: 22,
    chat_id: 23,
    content: 'I picked up a jacket that might be yours. It’s dark green with a hood.',
    created_at: new Date(),
  },
  {
    sender_id: 23,
    chat_id: 22,
    content: 'Yes, that’s mine. Thanks for keeping it safe. I can come by this evening to get it.',
    created_at: new Date(),
  },
  {
    sender_id: 24,
    chat_id: 25,
    content: 'I found your wallet near the metro station entrance. It looks like the one in your post.',
    created_at: new Date(),
  },
  {
    sender_id: 25,
    chat_id: 24,
    content: 'Awesome! That’s mine. Thank you so much! I can pick it up from your place anytime.',
    created_at: new Date(),
  }      
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', null, {});
  },
};
