import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/theme/app_colors.dart';

class FoundItemsPage extends StatefulWidget {
  const FoundItemsPage({super.key});

  @override
  State<FoundItemsPage> createState() => _FoundItemsPageState();
}

class _FoundItemsPageState extends State<FoundItemsPage> {
  List<Map<String, dynamic>> foundItems = [];
  List<Map<String, dynamic>> filteredItems = [];

  final searchController = TextEditingController();
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();

  File? pickedImage;
  String? selectedCategory;
  String? selectedCity;
  String? selectedPlace;
  DateTime? selectedDate;

  final List<String> categories = [
    'Wallet', 'Phone', 'Keys', 'Bag', 'Documents', 'Clothes', 'Other',
  ];

  final List<String> cities = [
    'Cairo', 'Giza', 'Alexandria', 'Beheira', 'Gharbia', 'Sharqia', 'Kafr EL-sheikh'
  ];

  final List<String> places = [
    'Transportation', 'Street', 'University', 'Mall', 'Other'
  ];

  void _filterItems(String query) {
    setState(() {
      filteredItems = foundItems
          .where((item) =>
          item['title'].toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  void _pickImage() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        pickedImage = File(image.path);
      });
    }
  }

  void _pickDate() async {
    final date = await showDatePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      initialDate: DateTime.now(),
    );
    if (date != null) {
      setState(() {
        selectedDate = date;
      });
    }
  }

  void _addFoundItem() {
    if (titleController.text.isEmpty ||
        selectedCategory == null ||
        selectedDate == null ||
        selectedCity == null ||
        selectedPlace == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please complete all required fields')),
      );
      return;
    }

    final refId = 'FND-${DateTime.now().millisecondsSinceEpoch}';

    final newItem = {
      'refId': refId,
      'title': titleController.text,
      'category': selectedCategory,
      'date': selectedDate!.toString().split(' ')[0],
      'description': descriptionController.text,
      'imageFile': pickedImage,
      'city': selectedCity,
      'place': selectedPlace,
    };

    setState(() {
      foundItems.add(newItem);
      filteredItems = List.from(foundItems);
    });

    titleController.clear();
    descriptionController.clear();
    pickedImage = null;
    selectedCategory = null;
    selectedDate = null;
    selectedCity = null;
    selectedPlace = null;

    Navigator.pop(context);
  }

  void _showAddItemForm() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25)),
      ),
      builder: (_) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 20,
                right: 20,
                top: 20,
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Center(
                      child: Text(
                        'I found something',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: titleController,
                      decoration: const InputDecoration(hintText: 'Item title'),
                    ),
                    const SizedBox(height: 15),
                    const Text('Category'),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: categories.map((c) {
                        return ChoiceChip(
                          label: Text(c),
                          selected: selectedCategory == c,
                          onSelected: (_) {
                            setModalState(() {
                              selectedCategory = c;
                            });
                          },
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 15),
                    const Text('City'),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: selectedCity,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Select City',
                        contentPadding:
                        EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                      items: cities.map((g) {
                        return DropdownMenuItem(
                          value: g,
                          child: Text(g),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setModalState(() {
                          selectedCity = value;
                        });
                      },
                    ),
                    const SizedBox(height: 15),
                    const Text('Place'),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: selectedPlace,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Select Place',
                        contentPadding:
                        EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                      items: places.map((g) {
                        return DropdownMenuItem(
                          value: g,
                          child: Text(g),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setModalState(() {
                          selectedPlace = value;
                        });
                      },
                    ),
                    const SizedBox(height: 10),
                    ElevatedButton.icon(
                      onPressed: _pickDate,
                      icon: const Icon(Icons.date_range),
                      label: Text(
                        selectedDate == null
                            ? 'Select found date'
                            : selectedDate!.toString().split(' ')[0],
                      ),
                    ),
                    const SizedBox(height: 15),
                    TextField(
                      controller: descriptionController,
                      decoration: const InputDecoration(hintText: 'Description'),
                      maxLines: 3,
                    ),
                    const SizedBox(height: 15),
                    Row(
                      children: [
                        ElevatedButton(
                          onPressed: _pickImage,
                          child: const Text('Add image'),
                        ),
                        const SizedBox(width: 10),
                        if (pickedImage != null)
                          Image.file(pickedImage!,
                              width: 50, height: 50, fit: BoxFit.cover),
                      ],
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                        ),
                        onPressed: _addFoundItem,
                        child: const Text(
                          'Submit',
                          style: TextStyle(color: Colors.black),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  void initState() {
    super.initState();
    filteredItems = List.from(foundItems);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        title: const Text('Found Items'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: searchController,
              onChanged: _filterItems,
              decoration: const InputDecoration(
                hintText: 'Search...',
                prefixIcon: Icon(Icons.search),
              ),
            ),
            const SizedBox(height: 15),
            Expanded(
              child: filteredItems.isEmpty
                  ? const Center(child: Text('No found items'))
                  : ListView.builder(
                itemCount: filteredItems.length,
                itemBuilder: (_, i) {
                  final item = filteredItems[i];
                  return Card(
                    child: ListTile(
                      leading: item['imageFile'] != null
                          ? Image.file(
                        item['imageFile'],
                        width: 50,
                        height: 50,
                        fit: BoxFit.cover,
                      )
                          : const Icon(Icons.check_circle_outline),
                      title: Text(item['title']),
                      subtitle: Text(
                          '${item['category']} • ${item['date']} • ${item['city']}, ${item['place']}'),
                      trailing: const Icon(Icons.arrow_forward_ios),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) =>
                                FoundItemDetailsPage(item: item),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        onPressed: _showAddItemForm,
        child: const Icon(Icons.add, color: Colors.black),
      ),
    );
  }
}

class FoundItemDetailsPage extends StatelessWidget {
  final Map<String, dynamic> item;

  const FoundItemDetailsPage({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        title: const Text('Found Item Details'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (item['imageFile'] != null)
                Image.file(item['imageFile'],
                    width: double.infinity, height: 200, fit: BoxFit.cover),
              const SizedBox(height: 10),
              Text('Reference ID: ${item['refId']}'),
              const SizedBox(height: 10),
              Text(item['title'],
                  style: const TextStyle(
                      fontSize: 22, fontWeight: FontWeight.bold)),
              Text('Category: ${item['category']}'),
              Text('Found Date: ${item['date']}'),
              Text('Location: ${item['city']}, ${item['place']}'),
              const SizedBox(height: 15),
              const Text('Description:',
                  style: TextStyle(fontWeight: FontWeight.bold)),
              Text(item['description']),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
