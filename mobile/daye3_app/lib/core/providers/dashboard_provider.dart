import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../model/dashboard_model.dart';

class DashboardProvider with ChangeNotifier {
  DashboardModel? dashboard;
  bool isLoading = false;

  String? _token;

  void setToken(String token) {
    _token = token;
    debugPrint("🔥 DASHBOARD TOKEN SET: $_token");

    /// 🔥 مهم: أول ما التوكن يوصل شغل الـ API
    if (_token != null && _token!.isNotEmpty) {
      fetchDashboard();
    }
  }

  Future<void> fetchDashboard() async {
    debugPrint("🚀 fetchDashboard CALLED");

    if (_token == null || _token!.isEmpty) {
      debugPrint("❌ TOKEN IS EMPTY - STOP");
      return;
    }

    isLoading = true;
    notifyListeners();

    try {
      final url = Uri.parse('http://10.0.2.2:5000/api/dashboard');

      debugPrint("🌐 REQUEST URL: $url");

      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
      );

      debugPrint("📡 STATUS: ${response.statusCode}");
      debugPrint("📦 BODY: ${response.body}");

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        dashboard = DashboardModel.fromJson(data);

        debugPrint("✅ DASHBOARD LOADED SUCCESSFULLY");
      } else {
        debugPrint("❌ API ERROR: ${response.body}");

        dashboard = null; // 🔥 مهم عشان UI يفهم
      }
    } catch (e) {
      debugPrint("💥 EXCEPTION: $e");

      dashboard = null;
    }

    isLoading = false;
    notifyListeners();
  }
}