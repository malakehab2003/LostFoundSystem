'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.User, { foreignKey: 'user_id' });
      Item.belongsTo(models.ItemCategory, { foreignKey: 'item_category_id' });
      Item.hasMany(models.ItemImage, { foreignKey: 'item_id' });
      Item.hasMany(models.Message, { foreignKey: 'item_id' });
    }
  }
  Item.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM('lost', 'found'),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Item',
      tableName: 'Items',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Item;
};