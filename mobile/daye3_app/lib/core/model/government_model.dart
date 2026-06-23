class Government {
  final int id;
  final String name;

  Government({required this.id, required this.name});

  factory Government.fromJson(Map<String, dynamic> json) {
    return Government(
      id: json['id'],
      name: json['name'],
    );
  }
}