import 'dart:convert';
import 'package:http/http.dart' as http;

class CityService {
  final String baseUrl = "http://10.0.2.2:5000/api";

  Future<List<Map<String, dynamic>>> getCities() async {
    final res = await http.get(
      Uri.parse("$baseUrl/city/list"),
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return List<Map<String, dynamic>>.from(data['citys']);
    } else {
      throw Exception("Failed to load cities");
    }
  }
}