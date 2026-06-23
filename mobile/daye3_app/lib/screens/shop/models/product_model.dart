class Product {
  final int id;
  final String name;
  final String image;
  final double price;
  final String description;
  final double rate;
  final List<String> colors;
  final List<String> sizes;

  Product({
    required this.id,
    required this.name,
    required this.image,
    required this.price,
    required this.description,
    required this.rate,
    required this.colors,
    required this.sizes,
  });

  /// ================= FROM JSON =================
  factory Product.fromJson(Map<String, dynamic> json) {
    print("RAW PRODUCT JSON = $json");
    return Product(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',

      /// IMAGE SAFE PARSING
      image: (() {
        final img = json['image'];

        if (img is List && img.isNotEmpty) {
          final first = img[0];
          if (first is Map) return first['url']?.toString() ?? '';
          return first.toString();
        }

        if (img is String) {
          return img;
        }

        return '';
      })(),

      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      description: json['description'] ?? '',
      rate: (json['rate'] as num?)?.toDouble() ?? 0.0,

      /// COLORS SAFE
      colors: (json['colors'] is List)
          ? List<String>.from(json['colors'].map((e) => e.toString()))
          : [],

      /// SIZES SAFE
      sizes: (json['sizes'] is List)
          ? List<String>.from(json['sizes'].map((e) => e.toString()))
          : [],
    );
  }

  /// ================= TO JSON =================
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'image': image,
      'price': price,
      'description': description,
      'rate': rate,
      'colors': colors,
      'sizes': sizes,
    };
  }
}