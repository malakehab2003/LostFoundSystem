'use strict';
/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Alice Johnson',
        age: 25,
        phone: '01011112222',
        email: 'alice@example.com',
        gender: 'female',
        password: 'password123',
        role: 'user',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bob Smith',
        age: 30,
        phone: '01022223333',
        email: 'bob@example.com',
        gender: 'male',
        password: 'password123',
        role: 'staff',
        is_verified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Carol Williams',
        age: 28,
        phone: '01033334444',
        email: 'carol@example.com',
        gender: 'female',
        password: 'password123',
        role: 'manager',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'David Brown',
        age: 35,
        phone: '01044445555',
        email: 'david@example.com',
        gender: 'male',
        password: 'password123',
        role: 'user',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Eve Davis',
        age: 22,
        phone: '01055556666',
        email: 'eve@example.com',
        gender: 'female',
        password: 'password123',
        role: 'user',
        is_verified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Frank Miller',
        age: 40,
        phone: '01066667777',
        email: 'frank@example.com',
        gender: 'male',
        password: 'password123',
        role: 'owner',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Grace Wilson',
        age: 27,
        phone: '01077778888',
        email: 'grace@example.com',
        gender: 'female',
        password: 'password123',
        role: 'staff',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Henry Moore',
        age: 33,
        phone: '01088889999',
        email: 'henry@example.com',
        gender: 'male',
        password: 'password123',
        role: 'manager',
        is_verified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Isabella Taylor',
        age: 29,
        phone: '01099990000',
        email: 'isabella@example.com',
        gender: 'female',
        password: 'password123',
        role: 'user',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jack Anderson',
        age: 31,
        phone: '01100001111',
        email: 'jack@example.com',
        gender: 'male',
        password: 'password123',
        role: 'user',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
