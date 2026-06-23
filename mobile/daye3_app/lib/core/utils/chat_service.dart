import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ChatService {
  static const String baseUrl = 'http://10.0.2.2:5000/api';

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<Map<String, String>> _headers() async {
    final token = await _getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // ✅ Create or open a chat
  Future<Map<String, dynamic>?> createChat(int receiverId) async {
    final res = await http.post(
      Uri.parse('$baseUrl/chat/create'),
      headers: await _headers(),
      body: jsonEncode({'receiver_id': receiverId}),
    );
    if (res.statusCode == 200 || res.statusCode == 201) {
      final data = jsonDecode(res.body);
      // ✅ بيرجع 'chat' مش 'newChat'
      return {
        'chat': data['chat'],
        'newChat': data['chat'], // للتوافق مع الكود القديم
      };
    }
    return null;
  }

  // ✅ Get chat list
  Future<List<dynamic>> getChatList() async {
    final res = await http.get(
      Uri.parse('$baseUrl/chat/list'),
      headers: await _headers(),
    );
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return data['formattedChats'] ?? [];
    }
    return [];
  }

  // ✅ Get messages
  Future<List<dynamic>> getMessages(int chatId) async {
    final res = await http.get(
      Uri.parse('$baseUrl/message/list/$chatId'),
      headers: await _headers(),
    );
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return data['messages'] ?? [];
    }
    return [];
  }

  // ✅ Send message
  Future<bool> sendMessage(int chatId, String content) async {
    final res = await http.post(
      Uri.parse('$baseUrl/message/create'),
      headers: await _headers(),
      body: jsonEncode({'chat_id': chatId, 'content': content}),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }
}