import 'package:flutter/material.dart';
import '../../screens/shop/models/cart_item.dart';
import '../utils/cart_api_service.dart';

class CartProvider extends ChangeNotifier {
  final CartApiService api = CartApiService();

  List<CartItem> items = [];
  double totalPrice = 0;

  bool isLoading = false;
  String? error;

  String? token;

  void setToken(String t) {
    token = t;
  }

  /// ================= FETCH CART =================
  Future<void> fetchCart() async {
    if (token == null || token!.isEmpty) return;

    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final data = await api.getCart(token!);

      final List cartList = data['cart'] ?? [];

      items = cartList.map((e) => CartItem.fromJson(e)).toList();

      totalPrice = (data['total'] as num?)?.toDouble() ?? 0.0;

      print("🔥 ITEMS LOADED: ${items.length}");
    } catch (e) {
      error = e.toString();
      print("❌ CART ERROR: $e");
    }

    isLoading = false;
    notifyListeners();
  }

  /// ================= OLD ADD (KEEP FOR COMPATIBILITY) =================
  Future<void> addToCart({
    required int productId,
    required String color,
    required String size,
  }) async {
    if (token == null || token!.isEmpty) return;

    await api.addToCart(
      token: token!,
      productId: productId,
      color: color,
      size: size,
    );

    await fetchCart();
  }

  /// ================= SAFE UX ADD (RECOMMENDED) =================
  Future<void> safeAddToCart({
    required int productId,
    required String color,
    required String size,
    required BuildContext context,
  }) async {
    if (token == null || token!.isEmpty) return;

    final exists = items.any((item) => item.product.id == productId);

    if (exists) {
      // 🔥 Toast
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Already in cart"),
          backgroundColor: Colors.orange,
        ),
      );

      // 🔥 INCREMENT instead of reject
      final item = items.firstWhere((e) => e.product.id == productId);

      await api.updateQuantity(
        token: token!,
        cartItemId: item.id,
        increase: true,
      );

      await fetchCart();
      return;
    }

    final success = await api.addToCart(
      token: token!,
      productId: productId,
      color: color,
      size: size,
    );

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Added to cart"),
          backgroundColor: Colors.green,
        ),
      );
    }

    await fetchCart();
  }

  /// ================= REMOVE =================
  Future<void> removeFromCart(int cartItemId) async {
    if (token == null || token!.isEmpty) return;

    await api.deleteItem(
      token: token!,
      cartItemId: cartItemId,
    );

    await fetchCart();
  }

  /// ================= INCREASE =================
  Future<void> increaseQuantity(int cartItemId) async {
    await api.updateQuantity(
      token: token!,
      cartItemId: cartItemId,
      increase: true,
    );

    await fetchCart();
  }

  /// ================= DECREASE =================
  Future<void> decreaseQuantity(int cartItemId) async {
    final item = items.firstWhere((e) => e.id == cartItemId);

    if (item.quantity > 1) {
      await api.updateQuantity(
        token: token!,
        cartItemId: cartItemId,
        increase: false,
      );

      await fetchCart();
    }
  }

  /// ================= CLEAR =================
  void clearCart() {
    items.clear();
    totalPrice = 0;
    notifyListeners();
  }

  /// ================= CHECK IF PRODUCT EXISTS =================
  bool isInCart(int productId) {
    return items.any((item) => item.product.id == productId);
  }

  double get total => totalPrice;
}