import 'package:flutter/material.dart';
import '../../screens/shop/models/product_model.dart';
import '../utils/wishlist_api_service.dart';

class WishlistProvider extends ChangeNotifier {
  final WishlistApiService api = WishlistApiService();

  List<Product> wishlistItems = [];
  bool isLoading = false;

  // =========================
  // 🔥 OPTIONAL TOKEN (LEGACY SUPPORT)
  // =========================
  String? _token;

  void setToken(String token) {
    _token = token;
  }

  // =========================
  // 🔥 GET WISHLIST
  // =========================
  Future<void> fetchWishlist([String? token]) async {
    isLoading = true;
    notifyListeners();

    try {
      wishlistItems = await api.getWishlist(token ?? _token);
      print("WISHLIST LOADED: ${wishlistItems.length}");
    } catch (e) {
      print("FETCH ERROR: $e");
    }

    isLoading = false;
    notifyListeners();
  }

  // =========================
  // ❤️ TOGGLE WISHLIST
  // =========================
  Future<void> toggleWishlist(Product product, [String? token]) async {
    final usedToken = token ?? _token;

    final exists = wishlistItems.any((p) => p.id == product.id);

    try {
      if (exists) {
        await api.removeFromWishlist(product.id, usedToken);
      } else {
        await api.addToWishlist(product.id, usedToken);
      }

      await fetchWishlist(usedToken);
    } catch (e) {
      print("TOGGLE ERROR: $e");
    }
  }

  // =========================
  // 💡 CHECK ITEM
  // =========================
  bool isInWishlist(Product product) {
    return wishlistItems.any((p) => p.id == product.id);
  }
}