// lib/core/providers/chat_provider.dart
import 'package:flutter/material.dart';
import '../utils/chat_service.dart';
import '../model/chat_model.dart';

class ChatProvider extends ChangeNotifier {
  final ChatService _chatService = ChatService();

  List<ChatModel> _chats = [];
  bool _loading = false;
  String? _token;

  List<ChatModel> get chats => _chats;
  bool get loading => _loading;

  int get totalUnread =>
      _chats.fold(0, (sum, chat) => sum + chat.unread);

  void setToken(String token) {
    _token = token;
    notifyListeners();
  }

  Future<void> fetchChats() async {
    _loading = true;
    notifyListeners();

    final raw = await _chatService.getChatList();
    _chats = raw.map((e) => ChatModel.fromJson(e)).toList();

    _loading = false;
    notifyListeners();
  }
}