import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/auth_api_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthApiService _api = AuthApiService();

  String? token;
  Map<String, dynamic>? user;

  bool isLoading = false;
  String? error;

  // =========================
  // 🔐 LOGIN
  // =========================
  Future<bool> login(String email, String password) async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final res = await _api.login(email, password);

      token = res["token"];
      user = res["user"];

      // 🔥 DEBUG: LOGIN TOKEN
      print("LOGIN TOKEN: ${token ?? 'NULL TOKEN'}");

      // 🔐 حفظ البيانات
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("token", token!);
      await prefs.setString("user", jsonEncode(user));

      isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      error = e.toString();

      isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // =========================
  // 📝 SIGNUP
  // =========================
  Future<bool> signup({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String gender,
    required String dob,
  }) async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final res = await _api.signup(
        name: name,
        email: email,
        password: password,
        phone: phone,
        gender: gender,
        dob: dob,
      );

      token = res["token"];
      user = res["user"];

      // 🔥 DEBUG (اختياري)
      print("LOGIN TOKEN: ${token ?? 'NULL TOKEN'}");

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("token", token!);
      await prefs.setString("user", jsonEncode(user));

      isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      error = e.toString();

      isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // =========================
  // 🚪 LOGOUT
  // =========================
  Future<void> logout() async {
    token = null;
    user = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove("token");
    await prefs.remove("user");

    notifyListeners();
  }

  // =========================
  // 🔄 AUTO LOGIN
  // =========================
  Future<void> loadUserFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();

    token = prefs.getString("token");

    String? userString = prefs.getString("user");
    if (userString != null) {
      user = jsonDecode(userString);
    }

    notifyListeners();
  }
}