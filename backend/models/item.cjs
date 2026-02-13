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
      Item.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Item.belongsTo(models.ItemCategory, { foreignKey: 'item_category_id', as: 'category' });
      Item.hasMany(models.ItemImage, { foreignKey: 'item_id', as: 'images' });
      Item.hasMany(models.Message, { foreignKey: 'item_id' });
      Item.hasMany(models.Comment, { foreignKey: 'item_id', as: 'comments', });
      Item.belongsTo(models.Government, { foreignKey: 'government_id', as: 'government' });
      Item.belongsTo(models.City, { foreignKey: 'city_id', as: 'city' });
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

      government_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      place: {
        type: DataTypes.STRING,
        allowNull: false
      },

      date: {
        type: DataTypes.DATEONLY,
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