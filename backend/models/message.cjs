"use strict";

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      chat_id: DataTypes.INTEGER,
      sender_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      is_read: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
    },
    {
      tableName: "Messages",
      timestamps: false,
    }
  );

  Message.associate = (models) => {
    // message belongs to chat
    Message.belongsTo(models.Chat, {
      foreignKey: "chat_id",
    });

    // sender relation
    Message.belongsTo(models.User, {
      foreignKey: "sender_id",
      as: "sender",
    });
  };

  return Message;
};