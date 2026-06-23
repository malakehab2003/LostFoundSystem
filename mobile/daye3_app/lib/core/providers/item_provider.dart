import 'dart:io';
import 'package:flutter/material.dart';
import '../model/item_model.dart';
import '../utils/item_api_service.dart';

class ItemsProvider with ChangeNotifier {
  final _api = ItemsApiService();

  List<ItemModel> items = [];
  bool isLoading = false;

  String? _token;

  void setToken(String token) {
    _token = token;
    debugPrint("🔐 TOKEN SET: $_token");
  }

  // ================= FETCH ITEMS =================
  Future<void> fetchItems({required String type}) async {
    isLoading = true;
    notifyListeners();

    try {
      final data = await _api.getItems(type: type);

      debugPrint("📦 FETCH RESPONSE: $data");

      if (data is List) {
        items = data
            .where((e) => e != null)
            .map((e) => ItemModel.fromJson(
          Map<String, dynamic>.from(e),
        ))
            .toList();
      } else {
        items = [];
      }
    } catch (e) {
      debugPrint("❌ Fetch Items Error: $e");
    }

    isLoading = false;
    notifyListeners();
  }

  // ================= ADD ITEM =================
  Future<int?> addItem({
    required Map<String, dynamic> body,
  }) async {
    if (_token == null) {
      debugPrint("❌ TOKEN IS NULL");
      return null;
    }

    try {
      final fixedBody = Map<String, dynamic>.from(body);

      if (fixedBody.containsKey("item_category_id")) {
        fixedBody["category_id"] = fixedBody["item_category_id"];
        fixedBody.remove("item_category_id");
      }

      debugPrint("🚀 ADD ITEM REQUEST: $fixedBody");

      final res = await _api.createItem(
        token: _token!,
        body: fixedBody,
      );

      debugPrint("📦 CREATE RESPONSE: $res");

      final item = res['item'];

      if (item == null) {
        debugPrint("❌ ITEM IS NULL IN RESPONSE");
        return null;
      }

      final itemId = item['id'];

      debugPrint("✅ ITEM CREATED ID: $itemId");

      await fetchItems(type: body["type"]);

      return itemId;
    } catch (e) {
      debugPrint("❌ Add Item Error: $e");
      return null;
    }
  }

  // ================= UPDATE ITEM =================
  Future<bool> updateItem({
    required int id,
    required Map<String, dynamic> body,
  }) async {
    if (_token == null) {
      debugPrint("❌ TOKEN IS NULL");
      return false;
    }

    try {
      final fixedBody = Map<String, dynamic>.from(body);

      if (fixedBody.containsKey("item_category_id")) {
        fixedBody["category_id"] = fixedBody["item_category_id"];
        fixedBody.remove("item_category_id");
      }

      debugPrint("✏️ UPDATE ITEM REQUEST: $fixedBody");

      final res = await _api.updateItem(
        token: _token!,
        id: id,
        body: fixedBody,
      );

      debugPrint("📦 UPDATE RESPONSE: $res");

      final updatedItem = ItemModel.fromJson(res['item']);

      final index = items.indexWhere((e) => e.id == id);

      if (index != -1) {
        items[index] = updatedItem;
      }

      notifyListeners();
      return true;
    } catch (e) {
      debugPrint("❌ Update Item Error: $e");
      return false;
    }
  }

  // ================= DELETE ITEM =================
  Future<bool> deleteItem(int id) async {
    if (_token == null) {
      debugPrint("❌ TOKEN IS NULL");
      return false;
    }

    try {
      await _api.deleteItem(
        token: _token!,
        id: id,
      );

      items.removeWhere((e) => e.id == id);

      notifyListeners();

      debugPrint("🗑️ ITEM DELETED: $id");

      return true;
    } catch (e) {
      debugPrint("❌ Delete Item Error: $e");
      return false;
    }
  }

  // ================= UPLOAD IMAGES =================
  Future<void> uploadItemImages({
    required int itemId,
    required List<File> images,
  }) async {
    if (_token == null || images.isEmpty) return;

    try {
      await _api.uploadImages(
        token: _token!,
        ownerId: itemId,
        images: images,
      );

      debugPrint("📸 Images uploaded for item $itemId");
    } catch (e) {
      debugPrint("❌ Upload Images Error: $e");
    }
  }

  // ================= SEARCH =================
  List<ItemModel> searchItems(String query, String type) {
    final q = query.toLowerCase();

    return items.where((item) {
      return item.type.toString() == type &&
          item.title.toString().toLowerCase().contains(q);
    }).toList();
  }

  // ================= TYPE FILTER =================
  List<ItemModel> getByType(String type) {
    return items.where((e) => e.type.toString() == type).toList();
  }

  // ================= MY ITEMS =================
  Future<void> loadMyItems() async {
    if (_token == null) return;

    isLoading = true;
    notifyListeners();

    try {
      final data = await _api.getMyItems(_token!);

      if (data is List) {
        items = data
            .where((e) => e != null)
            .map((e) => ItemModel.fromJson(
          Map<String, dynamic>.from(e),
        ))
            .toList();
      } else {
        items = [];
      }
    } catch (e) {
      debugPrint("❌ My Items Error: $e");
    }

    isLoading = false;
    notifyListeners();
  }
}