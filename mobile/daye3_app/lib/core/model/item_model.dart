class ItemModel {
  final int id;
  final String title;
  final String description;
  final String type;

  final int governmentId;
  final int cityId;
  final String place;
  final String date;

  final int userId;
  final String userName; // ✅ جديد
  final int categoryId;

  final String categoryName;
  final String governmentName;
  final String cityName;

  final List<String> images;

  ItemModel({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.governmentId,
    required this.cityId,
    required this.place,
    required this.date,
    required this.userId,
    required this.userName, // ✅ جديد
    required this.categoryId,
    required this.categoryName,
    required this.governmentName,
    required this.cityName,
    required this.images,
  });

  factory ItemModel.fromJson(Map<String, dynamic> json) {
    return ItemModel(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      type: json['type'] ?? 'lost',

      governmentId: json['government_id'] ?? 0,
      cityId: json['city_id'] ?? 0,
      place: json['place'] ?? '',
      date: json['date'] ?? '',

      userId: json['user_id'] ?? 0,
      userName: json['user']?['name'] ?? '', // ✅ جديد

      categoryId: json['category_id'] ?? json['item_category_id'] ?? 0,

      categoryName: json['category']?['name'] ?? '',
      governmentName: json['government']?['name'] ?? '',
      cityName: json['city']?['name'] ?? '',

      images: _parseImages(json),
    );
  }

  static List<String> _parseImages(Map<String, dynamic> json) {
    final raw = json['images'] ?? json['image'];

    if (raw == null) return <String>[];

    if (raw is List) {
      return raw.map<String>((e) {
        if (e is String) return e;
        if (e is Map && e['url'] != null) return e['url'].toString();
        if (e is Map && e['path'] != null) return e['path'].toString();
        return '';
      }).where((e) => e.isNotEmpty).toList();
    }

    if (raw is String) return [raw];

    return <String>[];
  }
}