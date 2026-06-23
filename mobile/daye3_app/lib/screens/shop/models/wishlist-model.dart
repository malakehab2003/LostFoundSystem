class WishlistItem {
  final int id;
  final int productId;
  final Product product;

  WishlistItem({
    required this.id,
    required this.productId,
    required this.product,
  });

  factory WishlistItem.fromJson(Map<String, dynamic> json) {
    return WishlistItem(
      id: json['id'],
      productId: json['product_id'],
      product: Product.fromJson(json['product']),
    );
  }
}

class Product {
  final int id;
  final String name;
  final double price;
  final double rate;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.rate,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      price: json['price'].toDouble(),
      rate: json['rate'].toDouble(),
    );
  }
}