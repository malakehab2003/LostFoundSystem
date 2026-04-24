import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/providers/cart_provider.dart';
import '../../core/providers/user_provider.dart';
import '../../core/theme/app_colors.dart';

class CheckoutPage extends StatefulWidget {
  const CheckoutPage({super.key});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  final _addressController = TextEditingController();
  final _promoController = TextEditingController();

  String receiveType = "Pickup";
  String paymentType = "Cash";
  double discount = 0;

  void applyPromo(double subtotal) {
    if (_promoController.text.trim().toUpperCase() == "DAY3") {
      setState(() {
        discount = subtotal * 0.1; // خصم 10%
      });
    } else {
      setState(() {
        discount = 0;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context);
    final cartItems = cartProvider.items;
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final userId = int.tryParse(userProvider.userData['id'] ?? '0') ?? 0;

    double subtotal = cartItems.fold(0, (sum, item) => sum + item.totalPrice);
    double finalTotal = subtotal - discount;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        title: const Text("Checkout"),
      ),
      body: cartItems.isEmpty
          ? const Center(child: Text("Your cart is empty"))
          : SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Order Summary",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: cartItems.length,
              itemBuilder: (_, index) {
                final item = cartItems[index];
                return ListTile(
                  leading: Image.asset(
                    item.product.image,
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                  ),
                  title: Text(item.product.name),
                  subtitle: Text(
                      "Qty: ${item.quantity}, Color: ${item.selectedColor}, Size: ${item.selectedSize}"),
                  trailing: Text("\$${item.totalPrice.toStringAsFixed(2)}"),
                );
              },
            ),
            const SizedBox(height: 20),
            const Text(
              "Receive Type",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: RadioListTile<String>(
                    title: const Text("Pickup"),
                    value: "Pickup",
                    groupValue: receiveType,
                    onChanged: (value) {
                      setState(() {
                        receiveType = value!;
                      });
                    },
                  ),
                ),
                Expanded(
                  child: RadioListTile<String>(
                    title: const Text("Delivery"),
                    value: "Delivery",
                    groupValue: receiveType,
                    onChanged: (value) {
                      setState(() {
                        receiveType = value!;
                      });
                    },
                  ),
                ),
              ],
            ),
            if (receiveType == "Delivery") ...[
              const SizedBox(height: 10),
              TextField(
                controller: _addressController,
                decoration: const InputDecoration(
                  labelText: "Delivery Address",
                  border: OutlineInputBorder(),
                ),
              ),
            ],
            const SizedBox(height: 25),
            const Text(
              "Promo Code",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _promoController,
                    decoration: const InputDecoration(
                      hintText: "Enter promo code",
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  ),
                  onPressed: () => applyPromo(subtotal),
                  child: const Text(
                    "Apply",
                    style: TextStyle(
                      fontSize: 16,          // حجم الخط
                      fontWeight: FontWeight.bold, // سمك الخط
                      color: Colors.white,   // لون الخط
                    ),
                  ),
                ),

              ],
            ),
            const SizedBox(height: 25),
            const Text(
              "Payment Method",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              children: ["Cash", "Card", "PayPal", "Online Wallet"].map((method) {
                final isSelected = paymentType == method;
                return ChoiceChip(
                  label: Text(method),
                  selected: isSelected,
                  selectedColor: AppColors.primary,
                  onSelected: (_) {
                    setState(() {
                      paymentType = method;
                    });
                  },
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : Colors.black,
                    fontWeight: FontWeight.w500,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 25),
            const Divider(),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("Subtotal"),
                Text("\$${subtotal.toStringAsFixed(2)}"),
              ],
            ),
            if (discount > 0)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Discount"),
                  Text("- \$${discount.toStringAsFixed(2)}"),
                ],
              ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Total",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Text(
                  "\$${finalTotal.toStringAsFixed(2)}",
                  style: const TextStyle(fontSize: 18),
                ),
              ],
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 15),
                ),
                onPressed: () {
                  if (receiveType == "Delivery" && _addressController.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Please enter delivery address")),
                    );
                    return;
                  }

                  // تكوين الداتا عشان تبعت للـ backend
                  final orderData = {
                    'total_price': finalTotal,
                    'order_status': 'processing',
                    'receive_type': receiveType.toLowerCase(),
                    'payment_type': paymentType.toLowerCase(),
                    'user_id': userId,
                    'address': _addressController.text.trim(),
                    'promo_code': _promoController.text.trim(),
                    'items': cartProvider.items.map((item) {
                      return {
                        'product_id': item.product.id,
                        'quantity': item.quantity,
                        'price': item.product.price,
                        'selected_color': item.selectedColor,
                        'selected_size': item.selectedSize,
                      };
                    }).toList(),
                  };

                  cartProvider.clearCart();

                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Order placed successfully!"),
                    ),
                  );

                  Navigator.pop(context);
                },
                child: const Text(
                  "Confirm Order",
                  style: TextStyle(color: Colors.black),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
