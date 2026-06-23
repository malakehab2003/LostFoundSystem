class UserInfoModel {
  final int id;
  final String name;
  final String email;
  final String phone;
  final String gender;
  final String dob;
  final bool showPhoneNumber;
  final String role;

  UserInfoModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.gender,
    required this.dob,
    required this.showPhoneNumber,
    required this.role,
  });

  factory UserInfoModel.fromJson(Map<String, dynamic> json) {
    return UserInfoModel(
      id: json['id'],
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      gender: json['gender'] ?? '',
      dob: json['dob'] ?? '',
      showPhoneNumber: json['show_phone_number'] ?? false,
      role: json['role'] ?? '',
    );
  }
}