import 'dart:convert';
import 'package:http/http.dart' as http;

import '../model/government_model.dart';
import '../model/city_model.dart';
import '../model/address_model.dart';

class AddressService {
  static const String baseUrl = "http://10.0.2.2:5000/api";

  // ================= GOVERNMENTS =================

  static Future<List<Government>> getGovernments() async {
    final res = await http.get(Uri.parse('$baseUrl/government/list'));

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);

      return (data['governments'] as List)
          .map((e) => Government.fromJson(e))
          .toList();
    }

    throw Exception("Failed to load governments");
  }

  // ================= CITIES =================

  static Future<List<City>> getCities() async {
    final res = await http.get(Uri.parse('$baseUrl/city/list'));

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);

      return (data['citys'] as List)
          .map((e) => City.fromJson(e))
          .toList();
    }

    throw Exception("Failed to load cities");
  }

  // ================= ADDRESSES =================

  static Future<List<AddressModel>> getAddresses(String token) async {
    final res = await http.get(
      Uri.parse('$baseUrl/address/list'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);

      return (data['addresses'] as List)
          .map((e) => AddressModel.fromJson(e))
          .toList();
    }

    throw Exception("Failed to load addresses");
  }

  // ================= CREATE ADDRESS =================

  static Future<bool> createAddress({
    required String token,
    required String name,
    required String address,
    required String landmark,
    required String postalCode,
    required int cityId,
    required int governmentId,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/address/create'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        "name": name,
        "address": address,
        "landmark": landmark,
        "postal_code": postalCode,
        "city_id": cityId,
        "government_id": governmentId,
      }),
    );

    return res.statusCode == 200 || res.statusCode == 201;
  }

  // ================= DELETE =================

  static Future<bool> deleteAddress(String token, int id) async {
    final res = await http.delete(
      Uri.parse('$baseUrl/address/delete/$id'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    return res.statusCode == 200;
  }
}