import 'package:flutter/material.dart';
import '../model/address_model.dart';
import '../model/city_model.dart';
import '../model/government_model.dart';
import '../utils/address_service.dart';
import 'user_provider.dart';
import 'package:provider/provider.dart';

class AddressProvider extends ChangeNotifier {
  List<Government> governments = [];
  List<City> cities = [];
  List<City> filteredCities = [];
  List<AddressModel> addresses = [];

  bool isLoading = false;

  int? selectedGovernmentId;

  // ================= GOVERNMENTS =================
  Future<void> loadGovernments() async {
    try {
      governments = await AddressService.getGovernments();
      notifyListeners();
    } catch (e) {
      debugPrint(e.toString());
    }
  }

  // ================= CITIES =================
  Future<void> loadCities() async {
    try {
      cities = await AddressService.getCities();

      // مهم: مفيش مدن تظهر غير بعد اختيار محافظة
      filteredCities = [];

      notifyListeners();
    } catch (e) {
      debugPrint(e.toString());
    }
  }

  // ================= FILTER CITIES =================
  void filterCitiesByGovernment(int governmentId) {
    selectedGovernmentId = governmentId;

    filteredCities = cities
        .where((e) => e.governmentId == governmentId)
        .toList();

    notifyListeners();
  }

  void resetCities() {
    selectedGovernmentId = null;
    filteredCities = [];
    notifyListeners();
  }

  // ================= GET TOKEN HELPER =================
  String _getToken(BuildContext context) {
    final token = context.read<UserProvider>().token;

    if (token.isEmpty) {
      debugPrint("❌ TOKEN IS EMPTY");
    }

    return token;
  }

  // ================= LOAD ADDRESSES =================
  Future<void> loadAddresses(BuildContext context) async {
    try {
      isLoading = true;
      notifyListeners();

      final token = _getToken(context);

      addresses = await AddressService.getAddresses(token);

      isLoading = false;
      notifyListeners();
    } catch (e) {
      isLoading = false;
      notifyListeners();
      debugPrint(e.toString());
    }
  }

  // ================= ADD ADDRESS =================
  Future<void> addAddress({
    required BuildContext context,
    required String name,
    required String address,
    required String landmark,
    required String postalCode,
    required int cityId,
    required int governmentId,
  }) async {
    try {
      isLoading = true;
      notifyListeners();

      final token = _getToken(context);

      final success = await AddressService.createAddress(
        token: token,
        name: name,
        address: address,
        landmark: landmark,
        postalCode: postalCode,
        cityId: cityId,
        governmentId: governmentId,
      );

      if (success) {
        await loadAddresses(context);
      }

      isLoading = false;
      notifyListeners();
    } catch (e) {
      isLoading = false;
      notifyListeners();
      debugPrint(e.toString());
    }
  }

  // ================= DELETE ADDRESS =================
  Future<void> deleteAddress(BuildContext context, int id) async {
    try {
      final token = _getToken(context);

      final success = await AddressService.deleteAddress(token, id);

      if (success) {
        addresses.removeWhere((e) => e.id == id);
        notifyListeners();
      }
    } catch (e) {
      debugPrint(e.toString());
    }
  }
}