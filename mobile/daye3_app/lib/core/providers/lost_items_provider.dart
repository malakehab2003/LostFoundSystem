// lib/core/providers/lost_items_provider.dart
import 'dart:io';
import 'package:flutter/material.dart';

class LostItem {
  final String refId;
  final String title;
  final String description;
  final String category;
  final String date;
  final String city;
  final String place;
  final String governorate;
  final String ownerId;
  final List<File> images;

  LostItem({
    required this.refId,
    required this.title,
    required this.description,
    required this.category,
    required this.date,
    required this.city,
    required this.place,
    required this.governorate,
    required this.ownerId,
    this.images = const [],
  });
}

class LostItemsProvider extends ChangeNotifier {
  final List<LostItem> _items = [];

  List<LostItem> get items => List.unmodifiable(_items);

  void addItem(LostItem item) {
    _items.add(item);
    notifyListeners();
  }

  void updateItem(String refId, LostItem newItem) {
    final index = _items.indexWhere((i) => i.refId == refId);
    if (index >= 0) {
      _items[index] = newItem;
      notifyListeners();
    }
  }

  void deleteItem(String refId) {
    _items.removeWhere((i) => i.refId == refId);
    notifyListeners();
  }
}



