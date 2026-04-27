import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../lost/lost_items_page.dart';
import '../found/found_items_page.dart';
import '../dashboard/user_dashboard_page.dart';
import '../../core/providers/user_provider.dart';
import '../shop/shop_page.dart';
import '../shop/models/product_model.dart';

class HomePage extends StatelessWidget {
  final List<Product> products;

  const HomePage({super.key, required this.products});

  @override
  Widget build(BuildContext context) {
    final currentUserId =
        Provider.of<UserProvider>(context, listen: false).userData['id'] ?? '';

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // ===== TOP SECTION =====
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
              decoration: const BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Column(
                      children: const [
                        Icon(Icons.location_on, size: 48, color: Colors.white),
                        SizedBox(height: 6),
                        Text(
                          'day3',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: AppColors.background,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),
                  Text(
                    'We are here to help\nyou find your lost items',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: AppColors.background,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Day3 is a free and easy way to search lost & found things.',
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.background.withOpacity(0.9),
                    ),
                  ),
                  const SizedBox(height: 25),
                  // ===== LOST / FOUND BUTTONS =====
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.black,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => LostItemsPage(
                                  currentUserId: currentUserId,
                                ),
                              ),
                            );
                          },
                          child: Text(
                            'Lost',
                            style: TextStyle(color: AppColors.background),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                            side: BorderSide(color: AppColors.background),
                          ),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => const FoundItemsPage(),
                              ),
                            );
                          },
                          child: Text(
                            'Found',
                            style: TextStyle(color: AppColors.background),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            // ===== MIDDLE TEXT =====
            Text(
              'Always On – In Case\nThey Wander Off',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.foreground,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Register things for free',
              style: TextStyle(fontSize: 16, color: AppColors.primary),
            ),
            const SizedBox(height: 40),
            // ===== ICONS ROW =====
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  HomeIcon(
                    icon: Icons.shopping_cart,
                    label: 'Shop',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ShopPage(products: products),
                        ),
                      );
                    },
                  ),
                  HomeIcon(
                    icon: Icons.person,
                    label: 'Dashboard',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => UserDashboardPage(
                            currentUserId: currentUserId,
                          ),
                        ),
                      );
                    },
                  ),
                  HomeIcon(
                    icon: Icons.notifications,
                    label: 'Alert',
                    onTap: () {},
                  ),
                  HomeIcon(
                    icon: Icons.mail,
                    label: 'Get Social',
                    onTap: () {},
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}

class HomeIcon extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const HomeIcon({
    super.key,
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          CircleAvatar(
            radius: 26,
            backgroundColor: AppColors.primary.withOpacity(0.15),
            child: Icon(icon, color: AppColors.primary),
          ),
          const SizedBox(height: 8),
          Text(label, style: TextStyle(color: AppColors.foreground)),
        ],
      ),
    );
  }
}
