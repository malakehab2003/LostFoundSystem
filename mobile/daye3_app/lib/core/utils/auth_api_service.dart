import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthApiService {
  final String baseUrl = "http://10.0.2.2:5000/api/user";

  bool useMock = false;

  // =========================
  // 🔐 LOGIN
  // =========================
  Future<Map<String, dynamic>> login(
      String email,
      String password,
      ) async {
    if (useMock) {
      await Future.delayed(const Duration(seconds: 1));

      return {
        "token": "mock_token_123",
        "user": {
          "name": "Test User",
          "email": email,
        }
      };
    }

    final response = await http.post(
      Uri.parse("$baseUrl/login"), // ✅ FIXED
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "email": email,
        "password": password,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return {
        "token": data["token"],
        "user": data["user"],
      };
    } else {
      throw Exception(data["message"] ?? "Login failed");
    }
  }

  // =========================
  // 📝 SIGNUP
  // =========================
  Future<Map<String, dynamic>> signup({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String gender,
    required String dob,
  }) async {
    if (useMock) {
      await Future.delayed(const Duration(seconds: 1));

      return {
        "token": "mock_token_456",
        "user": {
          "name": name,
          "email": email,
        }
      };
    }

    final response = await http.post(
      Uri.parse("$baseUrl/createUser"), // ✅ FIXED
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "name": name,
        "email": email,
        "password": password,
        "phone": phone,
        "gender": gender,
        "dob": dob,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200 || response.statusCode == 201) {
      return {
        "token": data["token"],
        "user": data["user"],
      };
    } else {
      throw Exception(data["message"] ?? "Signup failed");
    }
  }
}