"use strict";

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    "Chat",
    {
      owner_id: DataTypes.INTEGER,
      sender_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
    },
    {
      tableName: "Chats",
      timestamps: false,
    }
  );

  Chat.associate = (models) => {
    // owner
    Chat.belongsTo(models.User, {
      foreignKey: "owner_id",
      as: "owner",
    });

    // sender
    Chat.belongsTo(models.User, {
      foreignKey: "sender_id",
      as: "sender",
    });

    // messages
    Chat.hasMany(models.Message, {
      foreignKey: "chat_id",
    });
  };

  return Chat;
};