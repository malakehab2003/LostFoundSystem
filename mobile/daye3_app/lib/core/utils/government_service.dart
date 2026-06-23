import 'dart:convert';
import 'package:http/http.dart' as http;
import '../model/government_model.dart';

class GovernmentService {
  Future<List<Government>> getGovernments() async {
    final res = await http.get(
      Uri.parse("http://10.0.2.2:5000/api/government/list"),
    );

    final data = jsonDecode(res.body);

    return (data['governments'] as List)
        .map((e) => Government.fromJson(e))
        .toList();
  }
}