import 'package:http/http.dart' as http;
import 'dart:convert';

class DashboardApiService {
  static const String baseUrl = "http://10.0.2.2:3000";

  Future<Map<String, dynamic>> getDashboard(String token) async {
    final response = await http.get(
      Uri.parse("$baseUrl/api/dashboard"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception("Failed to load dashboard: ${response.body}");
    }
  }
}