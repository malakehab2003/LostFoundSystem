import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_stripe/flutter_stripe.dart';

// Screens
import 'screens/auth/login_page.dart';
import 'screens/auth/signup_page.dart';
import 'screens/home/home_page.dart';
import 'screens/shop/shop_page.dart';
import 'screens/shop/cart_page.dart';
import 'screens/shop/checkout_page.dart';
import 'screens/shop/wishlist_page.dart';

// Providers
import 'core/providers/user_provider.dart';
import 'core/providers/cart_provider.dart';
import 'core/providers/item_provider.dart';
import 'core/providers/wishlist_provider.dart';
import 'core/providers/auth_provider.dart';
import 'core/providers/dashboard_provider.dart';
import 'core/providers/address_provider.dart';
import 'core/providers/notification_provider.dart';
import 'core/providers/chat_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  Stripe.publishableKey = 'pk_test_51TSm2IIOkMl7atsbhXQJEPLtNOhvL9oW7vXqeKWrWquEVovDU2LjODPODF54oasBEEFkhbk26YZaboJzsExuRZJT000J46QbVH';
  await Stripe.instance.applySettings();

  runApp(const MyAppRoot());
}

class MyAppRoot extends StatelessWidget {
  const MyAppRoot({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        /// Auth Provider
        ChangeNotifierProvider(
          create: (_) => AuthProvider()..loadUserFromPrefs(),
        ),

        /// Notification Provider
        ChangeNotifierProxyProvider<AuthProvider, NotificationProvider>(
          create: (_) => NotificationProvider(),
          update: (_, auth, notification) {
            final token = auth.token;
            if (token == null || token.isEmpty) return notification!;
            notification!.setToken(token);
            return notification;
          },
        ),

        /// Address Provider
        ChangeNotifierProvider(
          create: (_) => AddressProvider(),
        ),

        /// User Provider
        ChangeNotifierProxyProvider<AuthProvider, UserProvider>(
          create: (_) => UserProvider(),
          update: (_, auth, userProvider) {
            final token = auth.token;
            if (token == null || token.isEmpty) return userProvider!;
            userProvider!.setToken(token);
            return userProvider;
          },
        ),

        /// Cart Provider
        ChangeNotifierProxyProvider<AuthProvider, CartProvider>(
          create: (_) => CartProvider(),
          update: (_, auth, cart) {
            final token = auth.token;
            if (token == null || token.isEmpty) return cart!;
            cart!.setToken(token);
            return cart;
          },
        ),

        /// Dashboard Provider
        ChangeNotifierProxyProvider<AuthProvider, DashboardProvider>(
          create: (_) => DashboardProvider(),
          update: (_, auth, dashboard) {
            final token = auth.token;
            if (token == null || token.isEmpty) return dashboard!;
            dashboard!.setToken(token);
            return dashboard;
          },
        ),

        /// Items Provider
        ChangeNotifierProxyProvider<AuthProvider, ItemsProvider>(
          create: (_) => ItemsProvider(),
          update: (_, auth, items) {
            final token = auth.token;
            if (token == null || token.isEmpty) return items!;
            items!.setToken(token);
            return items;
          },
        ),

        /// Wishlist Provider
        ChangeNotifierProxyProvider<AuthProvider, WishlistProvider>(
          create: (_) => WishlistProvider(),
          update: (_, auth, wishlist) {
            final token = auth.token;
            if (token == null || token.isEmpty) return wishlist!;
            wishlist!.setToken(token);
            return wishlist;
          },
        ),

        /// Chat Provider
        ChangeNotifierProxyProvider<AuthProvider, ChatProvider>(
          create: (_) => ChatProvider(),
          update: (_, auth, chat) {
            final token = auth.token;
            if (token == null || token.isEmpty) return chat!;
            chat!.setToken(token);
            return chat;
          },
        ),
      ],
      child: const MyApp(),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute:'/login',
      routes: {
        '/login': (context) => const LoginPage(),
        '/signup': (context) => const SignUpPage(),
        '/home': (context) => const HomePage(products: []),
        '/shop': (context) => const ShopPage(),
        '/cart': (context) => const CartPage(),
        '/wishlist': (context) => const WishlistPage(),
      },
    );
  }
}