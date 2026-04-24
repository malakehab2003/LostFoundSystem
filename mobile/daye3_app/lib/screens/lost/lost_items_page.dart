// lib/screens/lost/lost_items_page.dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/providers/lost_items_provider.dart';
import 'lost_item_details_page.dart';

class LostItemsPage extends StatefulWidget {
  final String currentUserId;
  const LostItemsPage({super.key, required this.currentUserId});

  @override
  State<LostItemsPage> createState() => _LostItemsPageState();
}

class _LostItemsPageState extends State<LostItemsPage> {
  List<LostItem> filteredItems = [];
  final searchController = TextEditingController();

  final categories = ['Wallet','Phone','Keys','Bag','Documents','Clothes','Other'];
  final cities = ['damnhour','tanta'];
  final places = ['Transportation','Street','University','Mall','Other'];
  final governorates = ['Cairo','Giza','Alexandria','Beheira','Gharbia','Sharqia','Kafr EL-sheikh'];

  @override
  void initState() {
    super.initState();
    final allItems = Provider.of<LostItemsProvider>(context, listen: false).items;
    filteredItems = allItems.where((item) => item.ownerId == widget.currentUserId).toList();
  }

  void _filterItems(String query) {
    final allItems = Provider.of<LostItemsProvider>(context, listen: false).items;
    setState(() {
      filteredItems = allItems
          .where((item) =>
      item.ownerId == widget.currentUserId &&
          item.title.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  void _showAddItemForm() {
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();
    final otherLocationController = TextEditingController();

    File? pickedImage1;
    File? pickedImage2;
    String? selectedCategory;
    String? selectedCity;
    String? selectedPlace;
    String? selectedGovernorate;
    DateTime? selectedDate;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (_) => StatefulBuilder(
        builder: (context, setModalState) {

          Future<void> _pickImage(int index) async {
            final picker = ImagePicker();
            final image =
            await picker.pickImage(source: ImageSource.gallery);
            if (image != null) {
              setModalState(() {
                if (index == 1) pickedImage1 = File(image.path);
                if (index == 2) pickedImage2 = File(image.path);
              });
            }
          }

          Future<void> _pickDate() async {
            final date = await showDatePicker(
              context: context,
              firstDate: DateTime(2020),
              lastDate: DateTime.now(),
              initialDate: DateTime.now(),
            );
            if (date != null) {
              setModalState(() {
                selectedDate = date;
              });
            }
          }

          void _addLostItem() {
            if (titleController.text.isEmpty ||
                selectedCategory == null ||
                selectedDate == null ||
                selectedCity == null ||
                selectedPlace == null ||
                selectedGovernorate == null) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                    content: Text('Please complete all required fields')),
              );
              return;
            }

            final newItem = LostItem(
              refId: 'LST-${DateTime.now().millisecondsSinceEpoch}',
              title: titleController.text,
              description: descriptionController.text,
              category: selectedCategory!,
              date: selectedDate!.toString().split(' ')[0],
              city: selectedCity!,
              place: selectedPlace == 'Other'
                  ? otherLocationController.text
                  : selectedPlace!,
              governorate: selectedGovernorate!,
              ownerId: widget.currentUserId,
              images: [
                if (pickedImage1 != null) pickedImage1!,
                if (pickedImage2 != null) pickedImage2!,
              ],
            );

            Provider.of<LostItemsProvider>(context, listen: false)
                .addItem(newItem);

            setState(() {
              filteredItems = Provider.of<LostItemsProvider>(context,
                  listen: false)
                  .items
                  .where((item) =>
              item.ownerId == widget.currentUserId)
                  .toList();
            });

            Navigator.pop(context);
          }

          return Padding(
            padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 20,
                right: 20,
                top: 20),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      IconButton(
                          icon: const Icon(Icons.arrow_back),
                          onPressed: () => Navigator.pop(context)),
                      const SizedBox(width: 10),
                      const Text('I lost something',
                          style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  TextField(
                      controller: titleController,
                      decoration:
                      const InputDecoration(hintText: 'Item title')),
                  const SizedBox(height: 15),
                  const Text('Category'),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: selectedCategory,
                    items: categories
                        .map((c) =>
                        DropdownMenuItem(value: c, child: Text(c)))
                        .toList(),
                    onChanged: (v) =>
                        setModalState(() => selectedCategory = v),
                    decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Select Category'),
                  ),
                  const SizedBox(height: 15),
                  const Text('Governorate'),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: selectedGovernorate,
                    items: governorates
                        .map((g) =>
                        DropdownMenuItem(value: g, child: Text(g)))
                        .toList(),
                    onChanged: (v) =>
                        setModalState(() => selectedGovernorate = v),
                    decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Select Governorate'),
                  ),
                  const SizedBox(height: 15),
                  const Text('City'),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: selectedCity,
                    items: cities
                        .map((c) =>
                        DropdownMenuItem(value: c, child: Text(c)))
                        .toList(),
                    onChanged: (v) =>
                        setModalState(() => selectedCity = v),
                    decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Select City'),
                  ),
                  const SizedBox(height: 15),
                  const Text('Place'),
                  DropdownButtonFormField<String>(
                    value:
                    selectedPlace != 'Other' ? selectedPlace : null,
                    items: places
                        .map((p) =>
                        DropdownMenuItem(value: p, child: Text(p)))
                        .toList(),
                    onChanged: (v) =>
                        setModalState(() => selectedPlace = v),
                    decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Select Place'),
                  ),
                  if (selectedPlace == 'Other')
                    Padding(
                      padding: const EdgeInsets.only(top: 10),
                      child: TextField(
                        controller: otherLocationController,
                        decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Enter your location'),
                      ),
                    ),
                  const SizedBox(height: 15),
                  Row(
                    children: [
                      ElevatedButton(
                          onPressed: () => _pickImage(1),
                          child: const Text('Add Image 1')),
                      const SizedBox(width: 10),
                      ElevatedButton(
                          onPressed: () => _pickImage(2),
                          child: const Text('Add Image 2')),
                    ],
                  ),
                  const SizedBox(height: 15),
                  ElevatedButton.icon(
                      onPressed: _pickDate,
                      icon: const Icon(Icons.date_range),
                      label: Text(selectedDate == null
                          ? 'Select lost date'
                          : selectedDate!
                          .toString()
                          .split(' ')[0])),
                  const SizedBox(height: 15),
                  TextField(
                      controller: descriptionController,
                      maxLines: 3,
                      decoration:
                      const InputDecoration(hintText: 'Description')),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary),
                      onPressed: _addLostItem,
                      child: const Text('Submit',
                          style: TextStyle(color: Colors.black)),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          backgroundColor: AppColors.primary,
          title: const Text('Lost Items')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
                controller: searchController,
                onChanged: _filterItems,
                decoration: const InputDecoration(
                    hintText: 'Search...',
                    prefixIcon: Icon(Icons.search))),
            const SizedBox(height: 15),
            Expanded(
              child: filteredItems.isEmpty
                  ? const Center(child: Text('No lost items'))
                  : ListView.builder(
                  itemCount: filteredItems.length,
                  itemBuilder: (_, i) {
                    final item = filteredItems[i];
                    return Card(
                      child: ListTile(
                        leading: item.images.isNotEmpty
                            ? Image.file(item.images[0],
                            width: 50,
                            height: 50,
                            fit: BoxFit.cover)
                            : const Icon(Icons.report_problem),
                        title: Text(item.title),
                        subtitle: Text(
                            '${item.category} • ${item.date} • ${item.governorate}, ${item.city}, ${item.place}'),
                        trailing:
                        const Icon(Icons.arrow_forward_ios),
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) =>
                                      LostItemDetailsPage(
                                          item: item,
                                          currentUserId: widget
                                              .currentUserId)))
                              .then((_) => setState(() {
                            filteredItems =
                                Provider.of<
                                    LostItemsProvider>(
                                    context,
                                    listen: false)
                                    .items
                                    .where((i) =>
                                i.ownerId ==
                                    widget
                                        .currentUserId)
                                    .toList();
                          }));
                        },
                      ),
                    );
                  }),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
          backgroundColor: AppColors.primary,
          onPressed: _showAddItemForm,
          child:
          const Icon(Icons.add, color: Colors.black)),
    );
  }
}
