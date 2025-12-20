'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Cart, { foreignKey: 'user_id' });
      User.hasMany(models.Wishlist, { foreignKey: 'user_id' });
      User.hasMany(models.Order, { foreignKey: 'user_id' });
      User.hasMany(models.Address, { foreignKey: 'user_id' });
      User.hasMany(models.Notification, { foreignKey: 'user_id' });
      User.hasMany(models.Item, { foreignKey: 'user_id' });
      User.hasMany(models.Review, { foreignKey: 'user_id' });
      User.hasMany(models.Message, { foreignKey: 'sender_id', as: 'SentMessages' });
      User.hasMany(models.Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });

      User.belongsToMany(models.PromoCode, {
        through: 'UserPromoCodes',
        foreignKey: 'user_id',
        otherKey: 'promo_code_id',
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    age: {
      type: DataTypes.INTEGER,
    },

    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
    },

    last_login: {
      type: DataTypes.DATE,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    role: {
      type: DataTypes.ENUM('staff', 'manager', 'user', 'owner'),
      defaultValue: 'user',
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return User;
};