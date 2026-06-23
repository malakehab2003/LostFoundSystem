import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../screens/shop/models/product_model.dart';

class WishlistApiService {
  final String baseUrl = "http://10.0.2.2:5000/api";

  // =========================
  // 🔐 GET TOKEN (SAFE + COMPATIBLE)
  // =========================
  Future<String?> _getToken([String? externalToken]) async {
    if (externalToken != null && externalToken.isNotEmpty) {
      return externalToken;
    }

    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("token");
  }

  // =========================
  // 🔥 GET WISHLIST
  // =========================
  Future<List<Product>> getWishlist([String? token]) async {
    final usedToken = await _getToken(token);

    print("TOKEN SENT (GET): $usedToken");

    if (usedToken == null || usedToken.isEmpty) {
      throw Exception("No token found");
    }

    final response = await http.get(
      Uri.parse('$baseUrl/wishlist/list'),
      headers: {
        'Authorization': 'Bearer $usedToken',
      },
    );

    print("GET STATUS: ${response.statusCode}");
    print("GET BODY: ${response.body}");

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      List wishlist = data['wishlist'];

      return wishlist
          .map<Product>((item) => Product.fromJson(item['product']))
          .toList();
    } else {
      throw Exception("Failed to load wishlist");
    }
  }

  // =========================
  // ❤️ ADD TO WISHLIST
  // =========================
  Future<bool> addToWishlist(int productId, [String? token]) async {
    final usedToken = await _getToken(token);

    print("TOKEN SENT (ADD): $usedToken");

    if (usedToken == null || usedToken.isEmpty) {
      return false;
    }

    final response = await http.post(
      Uri.parse('$baseUrl/wishlist/addProduct'),
      headers: {
        'Authorization': 'Bearer $usedToken',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        "product_id": productId,
      }),
    );

    print("ADD STATUS: ${response.statusCode}");
    print("ADD BODY: ${response.body}");

    return response.statusCode == 200 || response.statusCode == 201;
  }

  // =========================
  // ❌ REMOVE FROM WISHLIST
  // =========================
  Future<bool> removeFromWishlist(int productId, [String? token]) async {
    final usedToken = await _getToken(token);

    print("TOKEN SENT (DELETE): $usedToken");

    if (usedToken == null || usedToken.isEmpty) {
      return false;
    }

    final response = await http.delete(
      Uri.parse('$baseUrl/wishlist/delete/$productId'),
      headers: {
        'Authorization': 'Bearer $usedToken',
      },
    );

    print("DELETE STATUS: ${response.statusCode}");
    print("DELETE BODY: ${response.body}");

    return response.statusCode == 200;
  }
}