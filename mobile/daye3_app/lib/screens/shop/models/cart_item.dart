import '../../shop/models/product_model.dart';

class CartItem {
  final int id;
  final int productId; // ✅ مضاف
  final Product product;
  int quantity;
  final String? selectedColor;
  final String? selectedSize;

  CartItem({
    required this.id,
    required this.productId, // ✅ مضاف
    required this.product,
    this.quantity = 1,
    this.selectedColor,
    this.selectedSize,
  });

  double get totalPrice => product.price * quantity;

  /// ================= FROM JSON =================
  factory CartItem.fromJson(Map<String, dynamic> json) {
    final productJson = Map<String, dynamic>.from(json['product'] ?? {}); // ✅
    productJson['id'] = json['product_id'] ?? 0; // ✅

    return CartItem(
      id: json['id'] ?? 0,
      productId: json['product_id'] ?? 0, // ✅
      quantity: json['quantity'] ?? 1,
      selectedColor: json['color'],
      selectedSize: json['size'],
      product: Product.fromJson(productJson),
    );
  }

  /// ================= TO JSON =================
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'product_id': productId, // ✅
      'quantity': quantity,
      'color': selectedColor,
      'size': selectedSize,
      'total_price': totalPrice,
    };
  }
}