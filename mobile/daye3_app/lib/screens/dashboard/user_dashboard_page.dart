import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../core/model/item_model.dart';
import '../../core/providers/dashboard_provider.dart';
import '../../core/providers/item_provider.dart';
import '../../core/providers/user_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/city_service.dart';
import '../../core/utils/government_service.dart';
import '../../core/model/government_model.dart';

import '../dashboard/address_page.dart';
import '../dashboard/personal_info_page.dart';
import '../lost/lost_item_details_page.dart';

class UserDashboardPage extends StatefulWidget {
  const UserDashboardPage({super.key});

  @override
  State<UserDashboardPage> createState() => _UserDashboardPageState();
}

class _UserDashboardPageState extends State<UserDashboardPage> {
  // ── dropdown data (زي ما هو في ItemsPage) ──
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

  bool isSubmitting = false;
  double uploadProgress = 0.0;

  @override
  void initState() {
    super.initState();

    Future.microtask(() {
      Provider.of<DashboardProvider>(context, listen: false).fetchDashboard();
      Provider.of<UserProvider>(context, listen: false).fetchUser();
      Provider.of<ItemsProvider>(context, listen: false).loadMyItems();
    });

    _loadGovernments();
    _loadCities();
  }

  Future<void> _loadGovernments() async {
    try {
      final data = await GovernmentService().getGovernments();
      setState(() => governments = data);
    } catch (_) {}
  }

  Future<void> _loadCities() async {
    try {
      final data = await CityService().getCities();
      setState(() => cities = List<Map<String, dynamic>>.from(data));
    } catch (_) {}
  }

  void _filterCities(String govId) {
    setState(() {
      selectedGovId = govId;
      selectedCity = null;
      filteredCities = cities
          .where((c) => c['government_id'].toString() == govId)
          .toList();
    });
  }

  // ================= DELETE =================

  void _confirmDelete(ItemModel item) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text("Delete Item"),
        content: const Text("Are you sure you want to delete this item?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Provider.of<ItemsProvider>(context, listen: false)
                  .deleteItem(item.id);
            },
            child: const Text("Delete", style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  // ================= EDIT FORM =================

  void _showEditItemForm(ItemModel item) {
    // ── pre-fill controllers ──
    final titleController = TextEditingController(text: item.title);
    final descriptionController = TextEditingController(text: item.description);

    // ── pre-select category ──
    final catIdx = categories.indexWhere(
          (c) => c.toLowerCase() == item.categoryName.toLowerCase(),
    );
    String? selectedCategory = catIdx != -1 ? categories[catIdx] : null;

    // ── pre-select place ──
    final placeIdx = places.indexWhere(
          (p) => p.toLowerCase() == item.place.toLowerCase(),
    );
    String? selectedPlace = placeIdx != -1 ? places[placeIdx] : null;

    // ── pre-select date ──
    DateTime? selectedDate;
    try {
      selectedDate = DateTime.parse(item.date);
    } catch (_) {}

    // ── pre-filter cities بناءً على government الـ item ──
    final govId = item.governmentId.toString();
    selectedGovId = govId;
    selectedCity = item.cityId.toString();
    filteredCities = cities
        .where((c) => c['government_id'].toString() == govId)
        .toList();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (_) => StatefulBuilder(
        builder: (context, setModalState) {

          Future<void> pickDate() async {
            final date = await showDatePicker(
              context: context,
              initialDate: selectedDate ?? DateTime.now(),
              firstDate: DateTime(2020),
              lastDate: DateTime(2035),
            );
            if (date != null) setModalState(() => selectedDate = date);
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

            final success = await provider.updateItem(
              id: item.id,
              body: {
                "title": titleController.text.trim(),
                "description": descriptionController.text.trim(),
                "type": item.type,
                "date": selectedDate!.toIso8601String().split("T")[0],
                "place": selectedPlace,
                "government_id": int.parse(selectedGovId!),
                "city_id": int.parse(selectedCity!),
                "category_id": categories.indexOf(selectedCategory!) + 1,
              },
            );

            setState(() {
              uploadProgress = 1.0;
              isSubmitting = false;
            });

            if (!mounted) return;

            if (success) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text("Item updated successfully ✅"),
                  backgroundColor: AppColors.primary,
                ),
              );
              Navigator.pop(context);
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Failed to update ❌"),
                  backgroundColor: Colors.red,
                ),
              );
            }
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
                  // handle bar
                  Container(
                    width: 40,
                    height: 4,
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),

                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      "Edit Item",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Title
                  TextField(
                    controller: titleController,
                    decoration: input("Item Title", Icons.title),
                  ),

                  const SizedBox(height: 12),

                  // Government
                  DropdownButtonFormField<String>(
                    value: selectedGovId,
                    decoration: input("Governorate", Icons.location_city),
                    items: governments
                        .map((g) => DropdownMenuItem(
                      value: g.id.toString(),
                      child: Text(g.name),
                    ))
                        .toList(),
                    onChanged: (v) {
                      if (v != null) {
                        _filterCities(v);
                        setModalState(() => selectedGovId = v);
                      }
                    },
                  ),

                  const SizedBox(height: 12),

                  // City
                  DropdownButtonFormField<String>(
                    value: selectedCity,
                    decoration: input("City", Icons.location_on),
                    items: filteredCities
                        .map((c) => DropdownMenuItem(
                      value: c['id'].toString(),
                      child: Text(c['name']),
                    ))
                        .toList(),
                    onChanged: (v) => setModalState(() => selectedCity = v),
                  ),

                  const SizedBox(height: 12),

                  // Category
                  DropdownButtonFormField<String>(
                    value: selectedCategory,
                    decoration: input("Category", Icons.category_outlined),
                    items: categories
                        .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                        .toList(),
                    onChanged: (v) =>
                        setModalState(() => selectedCategory = v),
                  ),

                  const SizedBox(height: 12),

                  // Place
                  DropdownButtonFormField<String>(
                    value: selectedPlace,
                    decoration: input("Place", Icons.place_outlined),
                    items: places
                        .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                        .toList(),
                    onChanged: (v) => setModalState(() => selectedPlace = v),
                  ),

                  const SizedBox(height: 12),

                  // Date
                  ElevatedButton.icon(
                    onPressed: pickDate,
                    icon: const Icon(Icons.date_range),
                    label: Text(
                      selectedDate == null
                          ? "Pick Date"
                          : selectedDate!.toIso8601String().split("T")[0],
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Description
                  TextField(
                    controller: descriptionController,
                    maxLines: 3,
                    decoration: input("Description", Icons.description),
                  ),

                  const SizedBox(height: 16),

                  if (isSubmitting)
                    LinearProgressIndicator(value: uploadProgress),

                  const SizedBox(height: 10),

                  // Save button
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: isSubmitting ? null : submit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: isSubmitting
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text(
                        "Save Changes",
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 15,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  // ================= BUILD =================

  @override
  Widget build(BuildContext context) {
    return Consumer3<DashboardProvider, UserProvider, ItemsProvider>(
      builder: (context, dashProvider, userProvider, itemsProvider, _) {
        final data = dashProvider.dashboard;
        final user = userProvider.user;

        String initials = '?';
        final name = user?.name ?? '';
        final parts = name.trim().split(' ');

        if (parts.length >= 2) {
          initials = '${parts[0][0]}${parts[1][0]}'.toUpperCase();
        } else if (parts.isNotEmpty && parts[0].isNotEmpty) {
          initials = parts[0][0].toUpperCase();
        }

        return Scaffold(
          backgroundColor: const Color(0xFFF7F8FC),
          body: dashProvider.isLoading
              ? const Center(child: CircularProgressIndicator())
              : data == null
              ? _emptyState()
              : CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              SliverToBoxAdapter(
                child: _topHeader(
                  context: context,
                  name: name,
                  initials: initials,
                  data: data,
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(18, 22, 18, 30),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    _sectionTitle("Quick Actions"),
                    const SizedBox(height: 14),
                    _quickActions(context),
                    const SizedBox(height: 28),
                    _sectionTitle("Top Selling Products"),
                    const SizedBox(height: 14),
                    ...List.generate(data.topSelling.length, (index) {
                      final item = data.topSelling[index];
                      return _productCard(
                        rank: index + 1,
                        name: item.name,
                        sales: item.salesCount,
                      );
                    }),
                    const SizedBox(height: 28),
                    _sectionTitle("Recent Activity"),
                    const SizedBox(height: 14),
                    _activityCard(itemsProvider),
                  ]),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ================= HEADER =================

  Widget _topHeader({
    required BuildContext context,
    required dynamic data,
    required String name,
    required String initials,
  }) {
    final topPadding = MediaQuery.of(context).padding.top;

    return Container(
      padding: EdgeInsets.fromLTRB(22, topPadding + 16, 22, 28),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(34),
          bottomRight: Radius.circular(34),
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _greeting(),
                      style: const TextStyle(color: Colors.white70, fontSize: 13),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      name.isEmpty ? "Welcome" : name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(.15),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Center(
                  child: Text(
                    initials,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 28),
          Row(
            children: [
              Expanded(
                child: _statCard(
                  title: "Revenue",
                  value: "\$${data.totalRevenue}",
                  icon: Icons.attach_money_rounded,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: _statCard(
                  title: "Orders",
                  value: "${data.totalOrders}",
                  icon: Icons.shopping_bag_outlined,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _statCard({
    required String title,
    required String value,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(.12),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(.12)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(height: 18),
          Text(title, style: const TextStyle(color: Colors.white70, fontSize: 13)),
          const SizedBox(height: 4),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }

  // ================= QUICK ACTIONS =================

  Widget _quickActions(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _actionButton(
            icon: Icons.message_outlined,
            title: "Messages",
            color: const Color(0xFF3B82F6),
            onTap: () {},
          ),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: _actionButton(
            icon: Icons.person_outline,
            title: "Profile",
            color: AppColors.primary,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const UserInfoPage()),
              );
            },
          ),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: _actionButton(
            icon: Icons.location_on_outlined,
            title: "Address",
            color: const Color(0xFF10B981),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AddressPage()),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _actionButton({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(.04),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: color.withOpacity(.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }

  // ================= PRODUCTS =================

  Widget _productCard({
    required int rank,
    required String name,
    required int sales,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(.04),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(.1),
              borderRadius: BorderRadius.circular(18),
            ),
            child: Center(
              child: Text(
                "#$rank",
                style: TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 5),
                Text(
                  "Top selling product",
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(.08),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Text(
              "$sales",
              style: TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ================= ACTIVITY =================

  Widget _activityCard(ItemsProvider provider) {
    if (provider.isLoading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (provider.items.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(.04),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(Icons.inventory_2_outlined, size: 42, color: Colors.grey.shade400),
            const SizedBox(height: 14),
            Text(
              "No items added yet",
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade700,
              ),
            ),
          ],
        ),
      );
    }

    return Column(
      children: provider.items.take(5).map((item) => _activityItemCard(item)).toList(),
    );
  }

  Widget _activityItemCard(ItemModel item) {
    final image = item.images.isNotEmpty ? item.images.first : '';
    final isLost = item.type == "lost";

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ItemDetailsPage(
              item: item,
              currentUserId: item.userId.toString(),
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(.04),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(24),
                bottomLeft: Radius.circular(24),
              ),
              child: image.isNotEmpty
                  ? Image.network(image, width: 100, height: 110, fit: BoxFit.cover)
                  : Container(
                width: 100,
                height: 110,
                color: Colors.grey.shade200,
                child: Icon(Icons.image_not_supported_outlined,
                    color: Colors.grey.shade500),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: () {},
                          child: PopupMenuButton<String>(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            onSelected: (value) {
                              if (value == "delete") {
                                _confirmDelete(item);
                              } else if (value == "edit") {
                                _showEditItemForm(item); // ✅
                              }
                            },
                            itemBuilder: (_) => [
                              const PopupMenuItem(
                                value: "edit",
                                child: Text("Edit"),
                              ),
                              const PopupMenuItem(
                                value: "delete",
                                child: Text(
                                  "Delete",
                                  style: TextStyle(color: Colors.red),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      item.description,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: isLost
                                ? Colors.red.withOpacity(.1)
                                : Colors.green.withOpacity(.1),
                            borderRadius: BorderRadius.circular(30),
                          ),
                          child: Text(
                            isLost ? "LOST" : "FOUND",
                            style: TextStyle(
                              color: isLost ? Colors.red : Colors.green,
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                        ),
                        const Spacer(),
                        Icon(Icons.location_on_outlined,
                            size: 16, color: Colors.grey.shade500),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            item.cityName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                                color: Colors.grey.shade600, fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ================= HELPERS =================

  Widget _sectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
    );
  }

  String _greeting() {
    final h = DateTime.now().hour;
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  }

  Widget _emptyState() {
    return const Center(child: Text("No data"));
  }
}