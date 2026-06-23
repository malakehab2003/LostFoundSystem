class AddressModel {
  final int id;
  final String name;
  final String address;
  final String landmark;
  final String postalCode;
  final int cityId;
  final int governmentId;

  final String? cityName;
  final String? governmentName;

  AddressModel({
    required this.id,
    required this.name,
    required this.address,
    required this.landmark,
    required this.postalCode,
    required this.cityId,
    required this.governmentId,
    this.cityName,
    this.governmentName,
  });

  factory AddressModel.fromJson(Map<String, dynamic> json) {
    return AddressModel(
      id: json['id'],
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      landmark: json['landmark'] ?? '',
      postalCode: json['postal_code'] ?? '',
      cityId: json['city_id'] ?? 0,
      governmentId: json['government_id'] ?? 0,
      cityName: json['city']?['name'],
      governmentName: json['government']?['name'],
    );
  }
}