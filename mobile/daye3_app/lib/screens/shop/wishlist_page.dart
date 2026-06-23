import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/providers/wishlist_provider.dart';
import '../../core/providers/cart_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/constants/app_constants.dart';
import 'models/product_model.dart';

class WishlistPage extends StatefulWidget {
  const WishlistPage({super.key});

  @override
  State<WishlistPage> createState() => _WishlistPageState();
}

class _WishlistPageState extends State<WishlistPage> {

  @override
  void initState() {
    super.initState();

    // 🔥 تحميل wishlist أول ما الصفحة تفتح
    Future.microtask(() {
      context
          .read<WishlistProvider>()
          .fetchWishlist(AppConstants.token);
    });
  }

  @override
  Widget build(BuildContext context) {
    final wishlistProvider = context.watch<WishlistProvider>();
    final cartProvider = context.read<CartProvider>();
    final items = wishlistProvider.wishlistItems;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Wishlist"),
        backgroundColor: AppColors.primary,
      ),
      backgroundColor: const Color(0xffF5F6FA),

      body: wishlistProvider.isLoading
          ? const Center(child: CircularProgressIndicator())

          : items.isEmpty
          ? const Center(
        child: Text(
          "Your wishlist is empty",
          style: TextStyle(fontSize: 18, color: Colors.grey),
        ),
      )

          : Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView.separated(
          itemCount: items.length,
          separatorBuilder: (_, __) =>
          const SizedBox(height: 16),
          itemBuilder: (context, index) {
            final product = items[index];

            return Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              elevation: 6,
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  children: [
                    // 🖼️ IMAGE
                    ClipRRect(
                      borderRadius: BorderRadius.circular(15),
                      child: Image.network(
                        product.image.isNotEmpty
                            ? product.image
                            : "https://placehold.co/150x150/png?text=No+Image",
                        width: 90,
                        height: 90,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Image.network(
                            "https://placehold.co/150x150/png?text=No+Image",
                            width: 90,
                            height: 90,
                            fit: BoxFit.cover,
                          );
                        },
                      ),
                    ),

                    const SizedBox(width: 12),

                    // ℹ️ Info
                    Expanded(
                      child: Column(
                        crossAxisAlignment:
                        CrossAxisAlignment.start,
                        children: [
                          Text(
                            product.name,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            "${product.price.toStringAsFixed(2)} EGP",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppColors.primary,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(width: 8),

                    // ⚙️ Actions
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // ➕ Add to cart (FIXED ONLY HERE)
                        GestureDetector(
                          onTap: () async {
                            try {
                              await cartProvider.addToCart(
                                productId: product.id,
                                color: '',
                                size: '',
                              );

                              ScaffoldMessenger.of(context)
                                  .showSnackBar(
                                const SnackBar(
                                  content: Text(
                                      "Product added to cart"),
                                ),
                              );
                            } catch (e) {
                              ScaffoldMessenger.of(context)
                                  .showSnackBar(
                                const SnackBar(
                                  content: Text(
                                      "Failed to add to cart"),
                                ),
                              );
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.add_shopping_cart,
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                        ),

                        const SizedBox(height: 8),

                        // ❌ Remove from wishlist
                        GestureDetector(
                          onTap: () {
                            wishlistProvider.toggleWishlist(
                              product,
                              AppConstants.token,
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: const BoxDecoration(
                              color: Colors.redAccent,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.delete,
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}