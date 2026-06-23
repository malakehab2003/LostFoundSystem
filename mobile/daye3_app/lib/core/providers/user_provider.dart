import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class UserModel {
  final int id;
  final String name;
  final String email;
  final String phone;
  final String dob;
  final String gender;
  final bool showPhoneNumber;
  final String role;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.dob,
    required this.gender,
    required this.showPhoneNumber,
    required this.role,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      dob: json['dob'] ?? '',
      gender: json['gender'] ?? '',
      showPhoneNumber: json['show_phone_number'] ?? false,
      role: json['role'] ?? '',
    );
  }
}

class UserProvider with ChangeNotifier {
  UserModel? user;
  bool isLoading = false;

  String? _token;

  // ================= TOKEN =================

  String get token => _token ?? "";

  void setToken(String token) {
    _token = token;
    debugPrint("🔥 TOKEN SET: $_token");
    notifyListeners();
  }

  void logout() {
    _token = null;
    user = null;
    notifyListeners();
  }

  // ================= GET USER =================

  Future<void> fetchUser() async {
    debugPrint("🚀 fetchUser CALLED");

    if (_token == null || _token!.isEmpty) {
      debugPrint("❌ TOKEN EMPTY");
      return;
    }

    isLoading = true;
    notifyListeners();

    try {
      final res = await http.get(
        Uri.parse('http://10.0.2.2:5000/api/user/getMe'),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
      );

      debugPrint("📡 STATUS: ${res.statusCode}");
      debugPrint("📦 BODY: ${res.body}");

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);

        user = UserModel.fromJson(data);

        debugPrint("✅ USER LOADED: ${user!.name}");
      } else {
        debugPrint("❌ GET USER ERROR: ${res.body}");
      }
    } catch (e) {
      debugPrint("💥 EXCEPTION: $e");
    }

    isLoading = false;
    notifyListeners();
  }

  // ================= UPDATE USER =================

  Future<bool> updateUser({
    String? name,
    String? phone,
    String? dob,
  }) async {
    try {
      final res = await http.put(
        Uri.parse('http://10.0.2.2:5000/api/user/update'),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          "name": name,
          "phone": phone,
          "dob": dob,
        }),
      );

      debugPrint("📡 UPDATE STATUS: ${res.statusCode}");
      debugPrint("📦 UPDATE BODY: ${res.body}");

      if (res.statusCode == 200) {
        await fetchUser();
        return true;
      }
    } catch (e) {
      debugPrint("💥 UPDATE EXCEPTION: $e");
    }

    return false;
  }

  // ================= CHANGE PASSWORD =================

  Future<bool> changePassword({
    required String oldPassword,
    required String newPassword,
  }) async {
    try {
      final res = await http.put(
        Uri.parse('http://10.0.2.2:5000/api/user/chagePassword'),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          "oldPassword": oldPassword,
          "newPassword": newPassword,
        }),
      );

      debugPrint("📡 PASSWORD STATUS: ${res.statusCode}");
      debugPrint("📦 PASSWORD BODY: ${res.body}");

      return res.statusCode == 200;
    } catch (e) {
      debugPrint("💥 PASSWORD EXCEPTION: $e");
    }

    return false;
  }

  // ================= DELETE USER =================

  Future<bool> deleteUser() async {
    try {
      final res = await http.delete(
        Uri.parse('http://10.0.2.2:5000/api/user/delete'),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
      );

      debugPrint("📡 DELETE STATUS: ${res.statusCode}");

      if (res.statusCode == 200) {
        logout();
        return true;
      }
    } catch (e) {
      debugPrint("💥 DELETE EXCEPTION: $e");
    }

    return false;
  }

  // ================= HELPERS =================

  String get userName => user?.name ?? '';
  String get userEmail => user?.email ?? '';
  int get userId => user?.id ?? 0;
}