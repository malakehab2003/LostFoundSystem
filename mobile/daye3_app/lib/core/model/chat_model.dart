class ChatModel {
  final int chatId;
  final int otherUserId;
  final String otherUserName;
  final String? lastMessage;
  final int unread;

  ChatModel({
    required this.chatId,
    required this.otherUserId,
    required this.otherUserName,
    this.lastMessage,
    required this.unread,
  });

  factory ChatModel.fromJson(Map<String, dynamic> json) {
    return ChatModel(
      chatId: json['chat_id'],
      otherUserId: json['other_user']['id'],
      otherUserName: json['other_user']['name'] ?? '',
      lastMessage: json['last_message'],
      unread: json['unread'] ?? 0,
    );
  }
}