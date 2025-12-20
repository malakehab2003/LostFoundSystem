'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'Sender' });
      Message.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'Receiver' });
      Message.belongsTo(models.Item, { foreignKey: 'item_id' });
    }
  }
  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'Messages',
      underscored: true,
      timestamps: false,
    }
  );

  return Message;
};