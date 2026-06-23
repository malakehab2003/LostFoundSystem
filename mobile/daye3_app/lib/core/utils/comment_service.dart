import 'dart:convert';
import 'package:http/http.dart' as http;
import '../model/comment_model.dart';

class CommentService {
  final String baseUrl = "http://10.0.2.2:5000/api/comment";

  // ================= GET COMMENTS =================
  Future<List<CommentModel>> getComments(int itemId, {String? token}) async {
    final res = await http.get(
      Uri.parse("$baseUrl/get/$itemId"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
    );

    final data = jsonDecode(res.body);

    if (res.statusCode == 200) {
      final List list = data["comments"] ?? [];
      return list.map((e) => CommentModel.fromJson(e)).toList();
    }

    throw Exception(data["err"] ?? "Failed to load comments");
  }

  // ================= CREATE COMMENT =================
  Future<CommentModel> createComment({
    required int itemId,
    required String content,
    required String token,
  }) async {
    final res = await http.post(
      Uri.parse("$baseUrl/addComment"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "itemId": itemId,
        "content": content,
      }),
    );

    final data = jsonDecode(res.body);

    if (res.statusCode == 200 || res.statusCode == 201) {
      return CommentModel.fromJson(data["comment"]);
    }

    throw Exception(data["err"] ?? "Failed to create comment");
  }

  // ================= DELETE COMMENT =================
  Future<void> deleteComment({
    required int id,
    required String token,
  }) async {
    final res = await http.delete(
      Uri.parse("$baseUrl/delete/$id"),
      headers: {
        "Authorization": "Bearer $token",
      },
    );

    final data = jsonDecode(res.body);

    if (res.statusCode != 200) {
      throw Exception(data["err"] ?? "Failed to delete comment");
    }
  }

  // ================= UPDATE COMMENT =================
  Future<void> updateComment({
    required int id,
    required String content,
    required String token,
  }) async {
    final res = await http.put(
      Uri.parse("$baseUrl/update/$id"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "content": content,
      }),
    );

    final data = jsonDecode(res.body);

    if (res.statusCode != 200) {
      throw Exception(data["err"] ?? "Failed to update comment");
    }
  }
}