import 'package:flutter/material.dart';

class UserProvider extends ChangeNotifier {
  Map<String, String> _userData = {
    'name': 'Mohamed Ayman',
    'email': 'example@email.com',
    'phone': '+20 100 000 0000',
    'dob': '1990-01-01',
    'gender': 'Male',
    'password': 'password123',
    'photo': '',
  };

  Map<String, String> get userData => _userData;

  // تحديث كل البيانات مرة واحدة
  void updateUser(Map<String, String> newData) {
    _userData = newData;
    notifyListeners();
  }

  // تحديث حقل واحد
  void updateField(String key, String value) {
    _userData[key] = value;
    notifyListeners();
  }

  // التحقق من الباسورد القديم
  bool checkOldPassword(String oldPassword) {
    return _userData['password'] == oldPassword;
  }

  // تغيير الباسورد
  bool changePassword(String oldPassword, String newPassword) {
    if (checkOldPassword(oldPassword)) {
      _userData['password'] = newPassword;
      notifyListeners();
      return true;
    }
    return false;
  }

  // ✅ دي كانت المشكلة — بقت برا الدالة
  void deleteUser() {
    _userData = {
      'name': '',
      'email': '',
      'phone': '',
      'dob': '',
      'gender': '',
      'password': '',
      'photo': '',
    };
    notifyListeners();
  }
}