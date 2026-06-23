import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class ItemsApiService {
  final String baseUrl = "http://10.0.2.2:5000/api/item";

  // ================= GET ITEMS =================
  Future<List<dynamic>> getItems({
    required String type,
    String? title,
    int? governmentId,
    int? cityId,
    String? place,
    int? categoryId,
    String? dateFrom,
    int page = 1,
  }) async {
    try {
      final uri = Uri.parse("$baseUrl/list").replace(queryParameters: {
        "type": type,
        if (title != null) "title": title,
        if (governmentId != null)
          "government_id": governmentId.toString(),
        if (cityId != null) "city_id": cityId.toString(),
        if (place != null) "place": place,
        if (categoryId != null)
          "category_id": categoryId.toString(),
        if (dateFrom != null) "date_from": dateFrom,
        "page": page.toString(),
      });

      final res = await http.get(uri);
      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        final items = data['allItems'];
        if (items is List) return items;
        return [];
      } else {
        throw Exception(data);
      }
    } catch (e) {
      throw Exception("Get Items Error: $e");
    }
  }

  // ================= CREATE ITEM =================
  Future<Map<String, dynamic>> createItem({
    required String token,
    required Map<String, dynamic> body,
  }) async {
    try {
      final fixedBody = Map<String, dynamic>.from(body);

      if (fixedBody.containsKey("item_category_id")) {
        fixedBody["category_id"] =
        fixedBody["item_category_id"];
        fixedBody.remove("item_category_id");
      }

      final res = await http.post(
        Uri.parse("$baseUrl/create"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode(fixedBody),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 200 ||
          res.statusCode == 201) {
        return data;
      } else {
        throw Exception(data);
      }
    } catch (e) {
      throw Exception("Create Item Error: $e");
    }
  }

  // ================= UPDATE ITEM =================
  Future<Map<String, dynamic>> updateItem({
    required String token,
    required int id,
    required Map<String, dynamic> body,
  }) async {
    try {
      final fixedBody = Map<String, dynamic>.from(body);

      if (fixedBody.containsKey("item_category_id")) {
        fixedBody["category_id"] =
        fixedBody["item_category_id"];
        fixedBody.remove("item_category_id");
      }

      final res = await http.put(
        Uri.parse("$baseUrl/update/$id"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode(fixedBody),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 200 ||
          res.statusCode == 201) {
        return data;
      } else {
        throw Exception(data);
      }
    } catch (e) {
      throw Exception("Update Item Error: $e");
    }
  }

  // ================= DELETE ITEM =================
  Future<void> deleteItem({
    required String token,
    required int id,
  }) async {
    try {
      final res = await http.delete(
        Uri.parse("$baseUrl/delete/$id"),
        headers: {
          "Authorization": "Bearer $token",
        },
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200 &&
          res.statusCode != 201) {
        throw Exception(data);
      }
    } catch (e) {
      throw Exception("Delete Item Error: $e");
    }
  }

  // ================= GET MY ITEMS (FIXED) =================
  Future<List<dynamic>> getMyItems(String token) async {
    try {
      final res = await http.get(
        Uri.parse("$baseUrl/getMyItems"),
        headers: {
          "Authorization": "Bearer $token",
        },
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        final items = data['items'] ?? data['allItems'];

        if (items is List) return items;

        return [];
      } else {
        throw Exception(data);
      }
    } catch (e) {
      throw Exception("Get My Items Error: $e");
    }
  }

  // ================= UPLOAD IMAGES =================
  Future<void> uploadImages({
    required String token,
    required int ownerId,
    required List<File> images,
  }) async {
    try {
      final request = http.MultipartRequest(
        "POST",
        Uri.parse("$baseUrl/image/addImages"),
      );

      request.headers["Authorization"] =
      "Bearer $token";

      request.fields["owner_id"] =
          ownerId.toString();
      request.fields["owner_type"] = "item";

      for (var img in images) {
        request.files.add(
          await http.MultipartFile.fromPath(
            "images",
            img.path,
          ),
        );
      }

      final response = await request.send();
      final responseBody =
      await response.stream.bytesToString();

      if (response.statusCode != 200 &&
          response.statusCode != 201) {
        throw Exception(
          "Upload Images Failed: $responseBody",
        );
      }
    } catch (e) {
      throw Exception("Upload Images Error: $e");
    }
  }
}