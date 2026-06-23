import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../screens/shop/models/product_model.dart';

class ProductService {
  final String baseUrl = "http://10.0.2.2:5000/api";

  Future<List<Product>> getProducts() async {
    final response = await http.get(
      Uri.parse("$baseUrl/product/list"),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      List productsJson = data['products'];

      return productsJson
          .map((item) => Product.fromJson(item))
          .toList();
    } else {
      throw Exception("Failed to load products");
    }
  }
}