// lib/screens/lost/lost_item_details_page.dart
import 'dart:io';
import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/providers/lost_items_provider.dart';
import 'package:provider/provider.dart';

class LostItemDetailsPage extends StatefulWidget {
  final LostItem item;
  final String currentUserId;

  const LostItemDetailsPage({
    super.key,
    required this.item,
    required this.currentUserId,
  });

  @override
  State<LostItemDetailsPage> createState() => _LostItemDetailsPageState();
}

class _LostItemDetailsPageState extends State<LostItemDetailsPage> {
  late bool isEditing;
  late TextEditingController titleController;
  late TextEditingController descriptionController;
  late TextEditingController otherLocationController;

  late LostItem currentItem;

  File? pickedImage1;
  File? pickedImage2;
  String? selectedCategory;
  String? selectedCity;
  String? selectedPlace;
  String? selectedGovernorate;
  DateTime? selectedDate;

  final List<String> categories = ['Wallet','Phone','Keys','Bag','Documents','Clothes','Other'];
  final List<String> cities = ['damnhour','tanta'];
  final List<String> places = ['Transportation','Street','University','Mall','Other'];
  final List<String> governorates = ['Cairo','Giza','Alexandria','Beheira','Gharbia','Sharqia','Kafr EL-sheikh'];

  @override
  void initState() {
    super.initState();
    isEditing = false;
    currentItem = widget.item;

    titleController = TextEditingController(text: currentItem.title);
    descriptionController = TextEditingController(text: currentItem.description);
    otherLocationController = TextEditingController(text: !places.contains(currentItem.place)? currentItem.place : '');
    selectedCategory = currentItem.category;
    selectedCity = currentItem.city;
    selectedPlace = places.contains(currentItem.place)? currentItem.place : 'Other';
    selectedGovernorate = currentItem.governorate;
    selectedDate = DateTime.parse(currentItem.date);

    if(currentItem.images.isNotEmpty){
      pickedImage1 = currentItem.images.length>0 ? currentItem.images[0] : null;
      pickedImage2 = currentItem.images.length>1 ? currentItem.images[1] : null;
    }
  }

  void _pickImage(int index) async {
    final picker = ImagePicker();
    final image = await picker.pickImage(source: ImageSource.gallery);
    if(image != null){
      setState(() {
        if(index==1) pickedImage1 = File(image.path);
        if(index==2) pickedImage2 = File(image.path);
      });
    }
  }

  void _pickDate() async {
    final date = await showDatePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      initialDate: selectedDate ?? DateTime.now(),
    );
    if(date!=null){
      setState(() {
        selectedDate = date;
      });
    }
  }

  void _saveChanges() {
    final updatedItem = LostItem(
      refId: currentItem.refId,
      title: titleController.text,
      description: descriptionController.text,
      category: selectedCategory!,
      date: selectedDate!.toString().split(' ')[0],
      city: selectedCity!,
      place: selectedPlace=='Other'? otherLocationController.text : selectedPlace!,
      governorate: selectedGovernorate!,
      ownerId: currentItem.ownerId,
      images: [if(pickedImage1!=null)pickedImage1!, if(pickedImage2!=null)pickedImage2!],
    );

    Provider.of<LostItemsProvider>(context, listen: false).updateItem(currentItem.refId, updatedItem);
    setState(() {
      isEditing = false;
      currentItem = updatedItem;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Lost item updated successfully')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isOwner = currentItem.ownerId == widget.currentUserId;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        title: const Text('Lost Item Details'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          if(isOwner && !isEditing)
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                setState(() { isEditing = true; });
              },
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // الصور
            Row(
              children: [
                if(pickedImage1!=null) Image.file(pickedImage1!, width: 100, height: 100, fit: BoxFit.cover),
                const SizedBox(width: 10),
                if(pickedImage2!=null) Image.file(pickedImage2!, width: 100, height: 100, fit: BoxFit.cover),
              ],
            ),
            const SizedBox(height: 20),
            // Title
            TextField(
              controller: titleController,
              readOnly: !isEditing,
              decoration: const InputDecoration(labelText: 'Title', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 15),
            // Category
            DropdownButtonFormField<String>(
              value: selectedCategory,
              items: categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
              onChanged: isEditing ? (v)=>setState(()=>selectedCategory=v) : null,
              decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 15),
            // Governorate
            DropdownButtonFormField<String>(
              value: selectedGovernorate,
              items: governorates.map((g) => DropdownMenuItem(value: g, child: Text(g))).toList(),
              onChanged: isEditing ? (v)=>setState(()=>selectedGovernorate=v) : null,
              decoration: const InputDecoration(labelText: 'Governorate', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 15),
            // City
            DropdownButtonFormField<String>(
              value: selectedCity,
              items: cities.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
              onChanged: isEditing ? (v)=>setState(()=>selectedCity=v) : null,
              decoration: const InputDecoration(labelText: 'City', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 15),
            // Place
            DropdownButtonFormField<String>(
              value: selectedPlace != 'Other' ? selectedPlace : null,
              items: places.map((p) => DropdownMenuItem(value: p, child: Text(p))).toList(),
              onChanged: isEditing ? (v)=>setState(()=>selectedPlace=v) : null,
              decoration: const InputDecoration(labelText: 'Place', border: OutlineInputBorder()),
            ),
            if(selectedPlace=='Other')
              Padding(
                padding: const EdgeInsets.only(top: 10),
                child: TextField(
                  controller: otherLocationController,
                  readOnly: !isEditing,
                  decoration: const InputDecoration(labelText: 'Enter your location', border: OutlineInputBorder()),
                ),
              ),
            const SizedBox(height: 15),
            // Date
            ElevatedButton.icon(
              onPressed: isEditing ? _pickDate : null,
              icon: const Icon(Icons.date_range),
              label: Text(selectedDate==null ? 'Select Date' : selectedDate!.toString().split(' ')[0]),
            ),
            const SizedBox(height: 15),
            // Description
            TextField(
              controller: descriptionController,
              readOnly: !isEditing,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 20),
            if(isEditing)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _saveChanges,
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                  child: const Text('Save Changes', style: TextStyle(color: Colors.black)),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
