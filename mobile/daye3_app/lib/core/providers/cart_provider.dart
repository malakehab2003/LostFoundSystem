// lib/core/providers/cart_provider.dart
import 'package:flutter/material.dart';
import '../../screens/shop/models/product_model.dart'; // صحح المسار حسب هيكل مشروعك

class CartItem {
  final Product product;
  final String selectedColor;
  final String selectedSize;
  int quantity;

  CartItem({
    required this.product,
    required this.selectedColor,
    required this.selectedSize,
    this.quantity = 1,
  });

  double get totalPrice => product.price * quantity;
}

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get totalPrice =>
      _items.fold(0, (sum, item) => sum + item.product.price * item.quantity);

  void addToCart(Product product, String selectedColor, String selectedSize, {int quantity = 1}) {
    final index = _items.indexWhere(
          (item) =>
      item.product.id == product.id &&
          item.selectedColor == selectedColor &&
          item.selectedSize == selectedSize,
    );

    if (index >= 0) {
      _items[index].quantity += quantity;
    } else {
      _items.add(CartItem(
        product: product,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        quantity: quantity,
      ));
    }
    notifyListeners();
  }

  void removeFromCart(Product product, String selectedColor, String selectedSize) {
    _items.removeWhere(
          (item) =>
      item.product.id == product.id &&
          item.selectedColor == selectedColor &&
          item.selectedSize == selectedSize,
    );
    notifyListeners();
  }

  void increaseQuantity(Product product, String selectedColor, String selectedSize) {
    final index = _items.indexWhere(
          (item) =>
      item.product.id == product.id &&
          item.selectedColor == selectedColor &&
          item.selectedSize == selectedSize,
    );
    if (index >= 0) {
      _items[index].quantity += 1;
      notifyListeners();
    }
  }

  void decreaseQuantity(Product product, String selectedColor, String selectedSize) {
    final index = _items.indexWhere(
          (item) =>
      item.product.id == product.id &&
          item.selectedColor == selectedColor &&
          item.selectedSize == selectedSize,
    );
    if (index >= 0) {
      if (_items[index].quantity > 1) {
        _items[index].quantity -= 1;
      } else {
        _items.removeAt(index);
      }
      notifyListeners();
    }
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }
}
