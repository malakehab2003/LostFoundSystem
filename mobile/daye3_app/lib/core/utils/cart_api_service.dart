import 'dart:convert';
import 'package:http/http.dart' as http;

class CartApiService {
  final String baseUrl = "http://10.0.2.2:5000/api/cart";

  /// ================= GET CART =================
  Future<Map<String, dynamic>> getCart(String token) async {
    final res = await http.get(
      Uri.parse("$baseUrl/list"),
      headers: {
        "Authorization": "Bearer $token",
      },
    );

    print("🔥 GET CART STATUS: ${res.statusCode}");
    print("🔥 GET CART BODY: ${res.body}");

    if (res.statusCode == 200) {
      return jsonDecode(res.body);
    } else {
      throw Exception(res.body);
    }
  }

  /// ================= ADD TO CART (SAFE) =================
  Future<bool> addToCart({
    required String token,
    required int productId,
    required String color,
    required dynamic size,
  }) async {
    dynamic sizeToSend = size;

    // 🔥 handle string numbers safely
    if (size is String && int.tryParse(size) != null) {
      sizeToSend = int.parse(size);
    }

    final res = await http.post(
      Uri.parse("$baseUrl/addProduct"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "product_id": productId,
        "quantity": 1,
        "color": color,
        "size": sizeToSend,
      }),
    );

    print("🔥 ADD STATUS: ${res.statusCode}");
    print("🔥 ADD BODY: ${res.body}");

    /// ✅ success
    if (res.statusCode == 200 || res.statusCode == 201) {
      return true;
    }

    /// ⚠️ already exists OR validation error
    if (res.statusCode == 400) {
      print("⚠️ Product already exists in cart");
      return false;
    }

    /// ❌ other errors (still safe, no crash)
    return false;
  }

  /// ================= UPDATE QUANTITY =================
  Future<void> updateQuantity({
    required String token,
    required int cartItemId,
    required bool increase,
  }) async {
    final res = await http.put(
      Uri.parse("$baseUrl/update/quantity"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "operation": increase ? "add" : "sub",
        "cart_id": cartItemId,
        "product_id": 1,
      }),
    );

    print("🔥 UPDATE STATUS: ${res.statusCode}");
    print("🔥 UPDATE BODY: ${res.body}");

    if (res.statusCode != 200) {
      throw Exception(res.body);
    }
  }

  /// ================= DELETE ITEM =================
  Future<void> deleteItem({
    required String token,
    required int cartItemId,
  }) async {
    final res = await http.delete(
      Uri.parse("$baseUrl/delete/$cartItemId"),
      headers: {
        "Authorization": "Bearer $token",
      },
    );

    print("🔥 DELETE STATUS: ${res.statusCode}");
    print("🔥 DELETE BODY: ${res.body}");

    if (res.statusCode != 200) {
      throw Exception(res.body);
    }
  }
}