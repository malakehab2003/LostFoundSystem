import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../model/notification_model.dart';

class NotificationProvider with ChangeNotifier {
  final String baseUrl = "http://10.0.2.2:5000/api";

  List<NotificationModel> notifications = [];

  bool isLoading = false;

  String? _token;

  Timer? _pollingTimer;

  // ───────────────── TOKEN ─────────────────
  void setToken(String token) {
    _token = token;
  }

  // ───────────────── START REALTIME POLLING ─────────────────
  void startRealtimeNotifications() {
    _pollingTimer?.cancel();

    _pollingTimer = Timer.periodic(
      const Duration(seconds: 5),
          (_) async {
        await fetchNotifications(showLoader: false);
      },
    );
  }

  // ───────────────── STOP POLLING ─────────────────
  void stopRealtimeNotifications() {
    _pollingTimer?.cancel();
  }

  // ───────────────── FETCH NOTIFICATIONS ─────────────────
  Future<void> fetchNotifications({
    bool showLoader = true,
  }) async {
    if (_token == null) return;

    if (showLoader) {
      isLoading = true;
      notifyListeners();
    }

    try {
      final res = await http.get(
        Uri.parse("$baseUrl/notification/list"),
        headers: {
          "Authorization": "Bearer $_token",
          "Content-Type": "application/json",
        },
      );

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);

        final list = data['notifications'] as List;

        final fetchedNotifications = list
            .map(
              (e) => NotificationModel.fromJson(
            Map<String, dynamic>.from(e),
          ),
        )
            .toList();

        // ترتيب الأحدث
        fetchedNotifications.sort(
              (a, b) => b.createdAt.compareTo(a.createdAt),
        );

        notifications = fetchedNotifications;

        notifyListeners();
      }
    } catch (e) {
      debugPrint("❌ Fetch Notifications Error: $e");
    }

    if (showLoader) {
      isLoading = false;
      notifyListeners();
    }
  }

  // ───────────────── UNREAD COUNT ─────────────────
  int get unreadCount {
    return notifications.where((n) => !n.isRead).length;
  }

  // ───────────────── ADD LOCAL NOTIFICATION ─────────────────
  void addNotification(NotificationModel notification) {
    notifications.insert(0, notification);

    notifyListeners();
  }

  // ───────────────── MARK AS READ ─────────────────
  void markAsRead(int id) {
    final index = notifications.indexWhere(
          (n) => n.id == id,
    );

    if (index != -1 && !notifications[index].isRead) {
      notifications[index] = notifications[index].copyWith(
        isRead: true,
      );

      notifyListeners();
    }
  }

  // ───────────────── MARK ALL ─────────────────
  void markAllAsRead() {
    notifications = notifications
        .map(
          (n) => n.copyWith(isRead: true),
    )
        .toList();

    notifyListeners();
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }
}