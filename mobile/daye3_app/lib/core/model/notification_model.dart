class NotificationModel {
  final int id;
  final String description;
  final bool isRead;
  final String entity;
  final int entityId;
  final String message;
  final DateTime createdAt;
  final int userId;

  NotificationModel({
    required this.id,
    required this.description,
    required this.isRead,
    required this.entity,
    required this.entityId,
    required this.message,
    required this.createdAt,
    required this.userId,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'],
      description: json['description'] ?? '',
      isRead: json['is_read'] ?? false,
      entity: json['entity'] ?? '',
      entityId: json['entity_id'] ?? 0,
      message: json['message'] ?? '',
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
      userId: json['user_id'] ?? 0,
    );
  }

  NotificationModel copyWith({bool? isRead}) {
    return NotificationModel(
      id: id,
      description: description,
      isRead: isRead ?? this.isRead,
      entity: entity,
      entityId: entityId,
      message: message,
      createdAt: createdAt,
      userId: userId,
    );
  }
}