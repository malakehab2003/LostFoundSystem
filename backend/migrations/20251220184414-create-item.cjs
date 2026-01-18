'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      government: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      place: {
        type: Sequelize.ENUM(
          'street',
          'public_transport',
          'school',
          'university',
          'mall',
          'restaurant',
          'cafe',
          'hospital',
          'bank',
          'office',
          'gym',
          'park',
          'cinema',
          'theater',
          'bus_station',
          'metro_station',
          'train_station',
          'airport',
          'taxi',
          'car',
          'shop',
          'supermarket',
          'hotel',
          'library',
          'government_office',
          'church',
          'mosque',
          'stadium',
          'playground',
          'beach',
          'other'
        ),
        allowNull: false,
      },

      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM('lost', 'found'),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      item_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ItemCategories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Items');
  },
};