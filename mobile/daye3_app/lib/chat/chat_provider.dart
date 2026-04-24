import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'chat_message.dart';

class ChatProvider with ChangeNotifier {
  List<ChatMessage> messages = [];

  final String apiBaseUrl = 'YOUR_API_BASE_URL'; // حط رابط API هنا

  Future<void> fetchMessages(int chatId) async {
    final response = await http.get(
      Uri.parse('$apiBaseUrl/message?chat_id=$chatId'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final List<dynamic> msgs = data['messages'];
      messages = msgs.map((json) => ChatMessage.fromJson(json)).toList();
      notifyListeners();
    } else {
      throw Exception('Failed to load messages');
    }
  }

  Future<void> sendMessage(ChatMessage message) async {
    messages.add(message);
    notifyListeners();

    final response = await http.post(
      Uri.parse('$apiBaseUrl/message'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'chat_id': message.chatId,
        'sender_id': message.senderId,
        'content': message.content,
      }),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to send message');
    }
  }
}