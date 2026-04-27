import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// Screens
import 'screens/auth/login_page.dart';
import 'screens/auth/signup_page.dart';
import 'screens/home/home_page.dart';
import 'screens/shop/shop_page.dart';
import 'screens/shop/cart_page.dart';
import 'screens/shop/checkout_page.dart';
import 'screens/shop/demo_products.dart';
import 'screens/shop/wishlist_page.dart';
// Providers
import 'core/providers/user_provider.dart';
import 'core/providers/cart_provider.dart';
import 'core/providers/lost_items_provider.dart';
import 'core/providers/wishlist_provider.dart';
void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => LostItemsProvider()),
        ChangeNotifierProvider(create: (_) => WishlistProvider()),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginPage(),
        '/signup': (context) => const SignUpPage(),
        '/home': (context) => HomePage(products: demoProducts),
        '/shop': (context) => ShopPage(products: demoProducts),
        '/cart': (context) => const CartPage(),
        '/checkout': (context) => const CheckoutPage(),
      },
    );
  }
}
