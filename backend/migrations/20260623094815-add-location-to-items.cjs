'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Items', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });

    await queryInterface.addColumn('Items', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Items', 'latitude');
    await queryInterface.removeColumn('Items', 'longitude');
  },
};