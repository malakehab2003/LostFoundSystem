import 'package:flutter/material.dart';

class ChatMessage {
  final int id;
  final int chatId;
  final int senderId;
  final String content;
  final bool isRead;
  final DateTime createdAt;
  final String senderName;

  ChatMessage({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.content,
    required this.isRead,
    required this.createdAt,
    required this.senderName,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'],
      chatId: json['chat_id'],
      senderId: json['sender_id'],
      content: json['content'],
      isRead: json['is_read'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
      senderName: json['sender']['name'] ?? '',
    );
  }
}