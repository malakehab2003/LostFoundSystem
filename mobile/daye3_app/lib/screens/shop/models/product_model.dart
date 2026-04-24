class Product {
  final int id;        // متوافق مع الـ backend id (int)
  final String name;   // اسم المنتج
  final String image;  // رابط الصورة
  final double price;  // سعر المنتج
  final String description;

  Product({
    required this.id,
    required this.name,
    required this.image,
    required this.price,
    required this.description,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      image: json['image'],
      price: double.parse(json['price'].toString()),
      description: json['description'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'image': image,
      'price': price,
      'description': description,
    };
  }
}


