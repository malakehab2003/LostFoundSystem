import 'product_model.dart';

class CartItem {
  final Product product;
  int quantity;
  final String? selectedColor;
  final String? selectedSize;

  CartItem({
    required this.product,
    this.quantity = 1,
    this.selectedColor,
    this.selectedSize,
  });

  double get totalPrice => product.price * quantity;

  Map<String, dynamic> toJson(int userId) {
    // متوافق مع جدول الـ orders بعد ما نحسب الـ totalPrice
    return {
      'product_id': product.id,
      'quantity': quantity,
      'selected_color': selectedColor,
      'selected_size': selectedSize,
      'total_price': totalPrice,
      'user_id': userId,
    };
  }
}

