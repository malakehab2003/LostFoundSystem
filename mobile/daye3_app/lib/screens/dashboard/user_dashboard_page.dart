// lib/screens/dashboard/user_dashboard_page.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import 'personal_info_page.dart';
import '../../core/providers/lost_items_provider.dart';
import '../../core/providers/user_provider.dart';

class UserDashboardPage extends StatelessWidget {
  final String currentUserId;

  const UserDashboardPage({super.key, required this.currentUserId});

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    final lostItemsProvider = Provider.of<LostItemsProvider>(context);

    final lostItems = lostItemsProvider.items
        .where((item) => item.ownerId == currentUserId)
        .toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        title: const Text("My Dashboard"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Profile card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [
                  BoxShadow(color: Colors.black12, blurRadius: 10),
                ],
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 30,
                    backgroundColor: AppColors.primary,
                    child: Icon(Icons.person, color: Colors.white, size: 30),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          userProvider.userData['name'] ?? "No Name",
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Text(
                          "Lost items reporter",
                          style: TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PersonalInfoPage(userData: userProvider.userData),
                        ),
                      );
                    },
                    child: const Text(
                      "Profile",
                      style: TextStyle(color: Colors.black),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 25),
            const Text(
              "My Lost Items",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            // Lost items list
            Expanded(
              child: lostItems.isEmpty
                  ? const Center(
                child: Text(
                  "You haven't added lost items yet",
                  style: TextStyle(fontSize: 16),
                ),
              )
                  : ListView.builder(
                itemCount: lostItems.length,
                itemBuilder: (_, index) {
                  final item = lostItems[index];
                  return Card(
                    child: ListTile(
                      leading: (item.images.isNotEmpty)
                          ? Image.file(item.images[0],
                          width: 50, height: 50, fit: BoxFit.cover)
                          : const Icon(Icons.report_problem),
                      title: Text(item.title),
                      subtitle: Text(
                          '${item.category} • ${item.date} • ${item.governorate}, ${item.city}, ${item.place}'),
                      onTap: () {

                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

