class CommentModel {
  final int id;
  final String content;
  final int itemId;
  final int userId;
  final String createdAt;

  CommentModel({
    required this.id,
    required this.content,
    required this.itemId,
    required this.userId,
    required this.createdAt,
  });

  factory CommentModel.fromJson(Map<String, dynamic> json) {
    return CommentModel(
      id: json["id"] ?? 0,
      content: json["content"] ?? "",

      itemId: json["item_id"] ?? json["itemId"] ?? 0,
      userId: json["user_id"] ?? json["userId"] ?? 0,

      createdAt: json["createdAt"] ?? json["created_at"] ?? "",
    );
  }
}