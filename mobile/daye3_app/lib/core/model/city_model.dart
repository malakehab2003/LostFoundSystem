class City {
  final int id;
  final String name;
  final int governmentId;

  City({
    required this.id,
    required this.name,
    required this.governmentId,
  });

  factory City.fromJson(Map<String, dynamic> json) {
    return City(
      id: json['id'],
      name: json['name'],
      governmentId: json['government_id'],
    );
  }
}