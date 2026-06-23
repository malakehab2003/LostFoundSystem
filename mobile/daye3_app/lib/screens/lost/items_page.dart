import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_colors.dart';
import '../../core/providers/item_provider.dart';
import '../../core/model/item_model.dart';
import '../../core/utils/city_service.dart';
import '../../core/utils/government_service.dart';
import '../../core/model/government_model.dart';
import 'lost_item_details_page.dart';

class ItemsPage extends StatefulWidget {
  final String currentUserId;
  final String type;

  const ItemsPage({
    super.key,
    required this.currentUserId,
    required this.type,
  });

  @override
  State<ItemsPage> createState() => _ItemsPageState();
}

class _ItemsPageState extends State<ItemsPage> {
  final searchController = TextEditingController();

  List<Government> governments = [];
  List<Map<String, dynamic>> cities = [];
  List<Map<String, dynamic>> filteredCities = [];

  String? selectedGovId;
  String? selectedCity;

  final categories = [
    'Wallet', 'Phone', 'Keys', 'Bag', 'Documents', 'Clothes', 'Other'
  ];

  final places = [
    'Transportation', 'Street', 'University', 'Mall', 'Other'
  ];

  List<File> selectedImages = [];
  final picker = ImagePicker();

  bool isSubmitting = false;
  double uploadProgress = 0.0;

  final String baseImageUrl = "http://10.0.2.2:5000/uploads/";

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final provider = Provider.of<ItemsProvider>(context, listen: false);
      await provider.fetchItems(type: widget.type);
    });

    loadGovernments();
    loadCities();
  }

  Future<void> loadGovernments() async {
    try {
      final data = await GovernmentService().getGovernments();
      setState(() => governments = data);
    } catch (_) {}
  }

  Future<void> loadCities() async {
    try {
      final data = await CityService().getCities();
      setState(() => cities = List<Map<String, dynamic>>.from(data));
    } catch (_) {}
  }

  void filterCities(String govId) {
    setState(() {
      selectedGovId = govId;
      selectedCity = null;
      filteredCities = cities
          .where((c) => c['government_id'].toString() == govId)
          .toList();
    });
  }

  String? getImageUrl(List<dynamic>? images) {
    if (images == null || images.isEmpty) return null;

    final img = images.first;

    if (img is String) {
      return img.startsWith('http') ? img : baseImageUrl + img;
    }

    if (img is Map && img['url'] != null) {
      final url = img['url'];
      return url.startsWith('http') ? url : baseImageUrl + url;
    }

    return null;
  }

  Future<void> pickImage(ImageSource source) async {
    final img = await picker.pickImage(source: source);
    if (img != null) {
      setState(() => selectedImages.add(File(img.path)));
    }
  }

  void openImagePickerSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library_outlined),
                title: const Text("Choose from Gallery"),
                onTap: () {
                  Navigator.pop(context);
                  pickImage(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt_outlined),
                title: const Text("Take Photo"),
                onTap: () {
                  Navigator.pop(context);
                  pickImage(ImageSource.camera);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showAddItemForm() {
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();

    String? selectedCategory;
    String? selectedPlace;
    DateTime? selectedDate;

    selectedImages.clear();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (_) => StatefulBuilder(
        builder: (context, setModalState) {

          Future pickDate() async {
            final date = await showDatePicker(
              context: context,
              firstDate: DateTime(2020),
              lastDate: DateTime(2035),
            );
            if (date != null) {
              setModalState(() => selectedDate = date);
            }
          }

          Future<void> submit() async {
            if (isSubmitting) return;

            if (titleController.text.isEmpty ||
                descriptionController.text.isEmpty ||
                selectedGovId == null ||
                selectedCity == null ||
                selectedDate == null ||
                selectedCategory == null ||
                selectedPlace == null) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Please fill all fields")),
              );
              return;
            }

            setState(() {
              isSubmitting = true;
              uploadProgress = 0.4;
            });

            final provider =
            Provider.of<ItemsProvider>(context, listen: false);

            final itemId = await provider.addItem(
              body: {
                "title": titleController.text,
                "description": descriptionController.text,
                "type": widget.type,
                "date": selectedDate!.toIso8601String().split("T")[0],
                "place": selectedPlace,
                "government_id": int.parse(selectedGovId!),
                "city_id": int.parse(selectedCity!),
                "category_id": categories.indexOf(selectedCategory!) + 1,
              },
            );

            setState(() => uploadProgress = 0.8);

            if (itemId != null && selectedImages.isNotEmpty) {
              await provider.uploadItemImages(
                itemId: itemId,
                images: selectedImages,
              );
            }

            await provider.fetchItems(type: widget.type);

            setState(() {
              uploadProgress = 1.0;
              isSubmitting = false;
            });

            if (!mounted) return;
            Navigator.pop(context);
          }

          InputDecoration input(String hint, IconData icon) {
            return InputDecoration(
              hintText: hint,
              prefixIcon: Icon(icon),
              filled: true,
              fillColor: const Color(0xFFF5F6FA),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide.none,
              ),
            );
          }

          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
              left: 16,
              right: 16,
              top: 20,
            ),
            child: SingleChildScrollView(
              child: Column(
                children: [

                  TextField(
                    controller: titleController,
                    decoration: input("Item Title", Icons.title),
                  ),

                  const SizedBox(height: 12),

                  _modernButton(
                    icon: Icons.image_outlined,
                    text: "Add Images",
                    onTap: openImagePickerSheet,
                  ),

                  const SizedBox(height: 12),

                  DropdownButtonFormField(
                    decoration: input("Governorate", Icons.location_city),
                    items: governments
                        .map((g) => DropdownMenuItem(
                      value: g.id.toString(),
                      child: Text(g.name),
                    ))
                        .toList(),
                    onChanged: (v) {
                      if (v != null) {
                        filterCities(v);
                        setModalState(() => selectedGovId = v);
                      }
                    },
                  ),

                  const SizedBox(height: 12),

                  DropdownButtonFormField(
                    decoration: input("City", Icons.location_on),
                    items: filteredCities
                        .map((c) => DropdownMenuItem(
                      value: c['id'].toString(),
                      child: Text(c['name']),
                    ))
                        .toList(),
                    onChanged: (v) =>
                        setModalState(() => selectedCity = v),
                  ),

                  const SizedBox(height: 12),

                  DropdownButtonFormField(
                    decoration: input("Category", Icons.category_outlined),
                    items: categories
                        .map((e) => DropdownMenuItem(
                      value: e,
                      child: Text(e),
                    ))
                        .toList(),
                    onChanged: (v) =>
                        setModalState(() => selectedCategory = v),
                  ),

                  const SizedBox(height: 12),

                  DropdownButtonFormField(
                    decoration: input("Place", Icons.place_outlined),
                    items: places
                        .map((e) => DropdownMenuItem(
                      value: e,
                      child: Text(e),
                    ))
                        .toList(),
                    onChanged: (v) =>
                        setModalState(() => selectedPlace = v),
                  ),

                  const SizedBox(height: 12),

                  ElevatedButton.icon(
                    onPressed: pickDate,
                    icon: const Icon(Icons.date_range),
                    label: Text(
                      selectedDate == null
                          ? "Pick Date"
                          : selectedDate.toString().split(" ")[0],
                    ),
                  ),

                  const SizedBox(height: 12),

                  TextField(
                    controller: descriptionController,
                    maxLines: 3,
                    decoration: input("Description", Icons.description),
                  ),

                  const SizedBox(height: 16),

                  if (isSubmitting)
                    LinearProgressIndicator(value: uploadProgress),

                  const SizedBox(height: 10),

                  _primaryButton(
                    text: "Submit",
                    loading: isSubmitting,
                    onTap: submit,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _modernButton({
    required IconData icon,
    required String text,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.grey.shade300),
          color: Colors.white,
        ),
        child: Row(
          children: [
            Icon(icon),
            const SizedBox(width: 10),
            Text(text),
          ],
        ),
      ),
    );
  }

  Widget _primaryButton({
    required String text,
    required bool loading,
    required VoidCallback onTap,
  }) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        onPressed: loading ? null : onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
        child: loading
            ? const CircularProgressIndicator(color: Colors.white)
            : Text(text),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ItemsProvider>(context);
    final items = provider.getByType(widget.type);

    return Scaffold(
      backgroundColor: const Color(0xFFF6F7FB),

      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        title: Text(
          widget.type.toUpperCase(),
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
      ),

      body: provider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) {
          final item = items[i];
          final imageUrl = getImageUrl(item.images);

          // ── الإضافة الوحيدة: GestureDetector ──
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ItemDetailsPage(
                    item: item,
                    currentUserId: widget.currentUserId,
                  ),
                ),
              );
            },
            child: Container(
              height: 130,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 14,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [

                  ClipRRect(
                    borderRadius: const BorderRadius.horizontal(
                      left: Radius.circular(20),
                    ),
                    child: SizedBox(
                      width: 110,
                      height: double.infinity,
                      child: imageUrl != null
                          ? Image.network(imageUrl, fit: BoxFit.cover)
                          : Container(
                        color: Colors.grey.shade200,
                        child: const Icon(Icons.image),
                      ),
                    ),
                  ),

                  const SizedBox(width: 12),

                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [

                        Text(
                          item.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 6),

                        Text(
                          item.description,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: Colors.grey.shade600,
                          ),
                        ),

                        const SizedBox(height: 8),

                        Row(
                          children: [
                            _tag(item.type),
                            const SizedBox(width: 6),
                            _tag(item.cityName),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),

      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.black,
        onPressed: _showAddItemForm,
        icon: const Icon(Icons.add),
        label: const Text("Add"),
      ),
    );
  }

  Widget _tag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.blue.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        text,
        style: const TextStyle(fontSize: 12),
      ),
    );
  }
}