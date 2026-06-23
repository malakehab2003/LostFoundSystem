import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:provider/provider.dart';
import '../shop/models/cart_item.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/providers/address_provider.dart';
import '../../core/model/address_model.dart';

// ======================================================
// APP COLORS
// ======================================================

class AppColors {
  static const Color background = Colors.white;
  static const Color foreground = Color(0xFF1F2937);
  static const Color primary = Color(0xFF7C3AED);
  static const Color secondary = Color(0xFF03DAC6);
  static const Color textSecondary = Color(0xFF888888);
  static const Color surface = Color(0xFFF9F8FF);
  static const Color border = Color(0xFFE8E4FF);
}

// ======================================================
// ENUMS
// ======================================================

enum DeliveryType { homeDelivery, storePickup }

enum PaymentMethod { cashOnDelivery, creditCard }

// ======================================================
// MODELS
// ======================================================

class PaymentResponse {
  final String clientSecret;
  final int amount;

  PaymentResponse({required this.clientSecret, required this.amount});

  factory PaymentResponse.fromJson(Map<String, dynamic> json) {
    return PaymentResponse(
      clientSecret: json['clientSecret'],
      amount: json['amount'],
    );
  }
}

// ======================================================
// API SERVICE
// ======================================================

class PaymentService {
  static const String baseUrl = 'http://10.0.2.2:5000/api';

  static Future<PaymentResponse> createPayment(List<CartItem> products) async {
    final url = Uri.parse('$baseUrl/payment/create-payment');
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    final bodyMap = {
      'products': products.map((p) {
        return {
          'id': p.productId,
          'productId': p.productId,
          '_id': p.productId,
          'quantity': p.quantity,
        };
      }).toList(),
    };

    final body = jsonEncode(bodyMap);

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return PaymentResponse.fromJson(data);
    } else {
      throw Exception(
        'Payment creation failed: ${response.statusCode}\n${response.body}',
      );
    }
  }
}

// ======================================================
// CHECKOUT PAGE
// ======================================================

class CheckoutPage extends StatefulWidget {
  final List<CartItem> cartProducts;

  const CheckoutPage({Key? key, required this.cartProducts}) : super(key: key);

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage>
    with TickerProviderStateMixin {
  bool _isLoading = false;
  bool _paymentSuccess = false;
  String? _errorMessage;

  // Delivery & Payment selections
  DeliveryType _deliveryType = DeliveryType.homeDelivery;
  PaymentMethod _paymentMethod = PaymentMethod.cashOnDelivery;
  AddressModel? _selectedAddress;

  late AnimationController _fadeController;
  late AnimationController _successController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _successScale;

  @override
  void initState() {
    super.initState();

    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _successController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeOut,
    );
    _successScale = CurvedAnimation(
      parent: _successController,
      curve: Curves.elasticOut,
    );

    _fadeController.forward();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AddressProvider>().loadAddresses(context);
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _successController.dispose();
    super.dispose();
  }

  double get _subtotal => widget.cartProducts.fold(
    0,
        (sum, p) => sum + (p.product.price * p.quantity),
  );

  double get _shipping =>
      _deliveryType == DeliveryType.storePickup ? 0 : (_subtotal > 500 ? 0 : 25);

  double get _total => _subtotal + _shipping;

  // ======================================================
  // PAYMENT HANDLER
  // ======================================================

  Future<void> _handlePayment() async {
    if (_isLoading) return;

    // Validate delivery address
    if (_deliveryType == DeliveryType.homeDelivery && _selectedAddress == null) {
      setState(() {
        _errorMessage = 'Please select a delivery address';
      });
      return;
    }

    // Cash on delivery — no Stripe needed
    if (_paymentMethod == PaymentMethod.cashOnDelivery) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      await Future.delayed(const Duration(milliseconds: 800));

      if (!mounted) return;
      setState(() {
        _paymentSuccess = true;
        _isLoading = false;
      });
      _successController.forward();
      HapticFeedback.heavyImpact();
      return;
    }

    // Credit card — use Stripe
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final paymentResponse = await PaymentService.createPayment(widget.cartProducts);

      print("CLIENT SECRET => ${paymentResponse.clientSecret}");

      await Stripe.instance.confirmPayment(
        paymentIntentClientSecret: paymentResponse.clientSecret,
        data: PaymentMethodParams.card(
          paymentMethodData: PaymentMethodData(),
        ),
      );

      print("PAYMENT SUCCESS");

      if (!mounted) return;

      setState(() {
        _paymentSuccess = true;
        _isLoading = false;
      });

      _successController.forward();
      HapticFeedback.heavyImpact();
    } on StripeException catch (e) {
      print("STRIPE ERROR => ${e.error}");
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        if (e.error.code != FailureCode.Canceled) {
          _errorMessage = e.error.localizedMessage ?? 'Payment failed';
        }
      });
    } catch (e) {
      print("PAYMENT ERROR => $e");
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _errorMessage = e.toString();
      });
    }
  }

  // ======================================================
  // BUILD
  // ======================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: _paymentSuccess ? _buildSuccessScreen() : _buildCheckoutScreen(),
    );
  }

  // ======================================================
  // SUCCESS SCREEN
  // ======================================================

  Widget _buildSuccessScreen() {
    return SafeArea(
      child: Center(
        child: ScaleTransition(
          scale: _successScale,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [AppColors.primary, Color(0xFF9F67FA)],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withOpacity(0.35),
                        blurRadius: 40,
                        spreadRadius: 10,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    color: Colors.white,
                    size: 60,
                  ),
                ),
                const SizedBox(height: 32),
                const Text(
                  'Order Placed! 🎉',
                  style: TextStyle(
                    color: AppColors.foreground,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  _paymentMethod == PaymentMethod.cashOnDelivery
                      ? 'Your order is confirmed.\nPay when it arrives!'
                      : 'Payment confirmed.\nYour order is on its way!',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 16,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 48),
                _PrimaryButton(
                  label: 'Back to Home',
                  onTap: () {
                    Navigator.of(context).popUntil((route) => route.isFirst);
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ======================================================
  // CHECKOUT SCREEN
  // ======================================================

  Widget _buildCheckoutScreen() {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SafeArea(
        child: Column(
          children: [
            _buildAppBar(),
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 24),

                    _buildSectionTitle('ITEMS'),
                    const SizedBox(height: 12),
                    ...widget.cartProducts.map((p) => _ProductCard(product: p)).toList(),

                    const SizedBox(height: 28),

                    _buildDeliveryTypeSection(),
                    const SizedBox(height: 20),

                    if (_deliveryType == DeliveryType.homeDelivery) ...[
                      _buildAddressSection(),
                      const SizedBox(height: 20),
                    ],

                    _buildPaymentMethodSection(),
                    const SizedBox(height: 20),

                    // CardField ظاهر دايماً لو اختار credit card
                    // بس مش بنعمل validation عليه — Stripe هيتكلم لو ناقص
                    if (_paymentMethod == PaymentMethod.creditCard) ...[
                      _buildCardField(),
                      const SizedBox(height: 20),
                    ],

                    _buildOrderSummary(),
                    const SizedBox(height: 20),

                    if (_errorMessage != null) _buildErrorBanner(),

                    const SizedBox(height: 16),
                    _buildPayButton(),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ======================================================
  // APP BAR
  // ======================================================

  Widget _buildAppBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: const Icon(
                Icons.arrow_back_ios_new_rounded,
                color: AppColors.primary,
                size: 18,
              ),
            ),
          ),
          const Expanded(
            child: Text(
              'Checkout',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.foreground,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF635BFF).withOpacity(0.08),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: const Color(0xFF635BFF).withOpacity(0.2),
              ),
            ),
            child: const Row(
              children: [
                Icon(Icons.lock_rounded, color: Color(0xFF635BFF), size: 13),
                SizedBox(width: 4),
                Text(
                  'Secure',
                  style: TextStyle(
                    color: Color(0xFF635BFF),
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ======================================================
  // DELIVERY TYPE SECTION
  // ======================================================

  Widget _buildDeliveryTypeSection() {
    return _SectionCard(
      title: 'DELIVERY TYPE',
      icon: Icons.local_shipping_outlined,
      child: Row(
        children: [
          Expanded(
            child: _DeliveryTypeOption(
              icon: Icons.home_rounded,
              label: 'Home Delivery',
              sublabel: 'Delivered to your door',
              isSelected: _deliveryType == DeliveryType.homeDelivery,
              onTap: () => setState(() {
                _deliveryType = DeliveryType.homeDelivery;
                _errorMessage = null;
              }),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _DeliveryTypeOption(
              icon: Icons.store_rounded,
              label: 'Store Pickup',
              sublabel: 'Pick up yourself',
              isSelected: _deliveryType == DeliveryType.storePickup,
              onTap: () => setState(() {
                _deliveryType = DeliveryType.storePickup;
                _selectedAddress = null;
                _errorMessage = null;
              }),
            ),
          ),
        ],
      ),
    );
  }

  // ======================================================
  // ADDRESS SECTION
  // ======================================================

  Widget _buildAddressSection() {
    return Consumer<AddressProvider>(
      builder: (context, provider, _) {
        return _SectionCard(
          title: 'DELIVERY ADDRESS',
          icon: Icons.location_on_outlined,
          child: provider.isLoading
              ? const Center(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: CircularProgressIndicator(
                color: AppColors.primary,
                strokeWidth: 2,
              ),
            ),
          )
              : provider.addresses.isEmpty
              ? _buildNoAddresses()
              : Column(
            children: provider.addresses
                .map((addr) => _AddressCard(
              address: addr,
              isSelected: _selectedAddress?.id == addr.id,
              onTap: () => setState(() {
                _selectedAddress = addr;
                _errorMessage = null;
              }),
            ))
                .toList(),
          ),
        );
      },
    );
  }

  Widget _buildNoAddresses() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.04),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Icon(Icons.location_off_rounded,
              color: AppColors.primary.withOpacity(0.4), size: 36),
          const SizedBox(height: 10),
          const Text(
            'No saved addresses',
            style: TextStyle(
              color: AppColors.foreground,
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Please add an address from your profile',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  // ======================================================
  // PAYMENT METHOD SECTION
  // ======================================================

  Widget _buildPaymentMethodSection() {
    return _SectionCard(
      title: 'PAYMENT METHOD',
      icon: Icons.payment_rounded,
      child: Column(
        children: [
          _PaymentOption(
            icon: Icons.money_rounded,
            label: 'Cash on Delivery',
            sublabel: 'Pay when you receive',
            isSelected: _paymentMethod == PaymentMethod.cashOnDelivery,
            onTap: () => setState(() {
              _paymentMethod = PaymentMethod.cashOnDelivery;
              _errorMessage = null;
            }),
          ),
          const SizedBox(height: 10),
          _PaymentOption(
            icon: Icons.credit_card_rounded,
            label: 'Credit / Debit Card',
            sublabel: 'Visa, Mastercard & more',
            isSelected: _paymentMethod == PaymentMethod.creditCard,
            onTap: () => setState(() {
              _paymentMethod = PaymentMethod.creditCard;
              _errorMessage = null;
            }),
          ),
        ],
      ),
    );
  }

  // ======================================================
  // CARD FIELD
  // بدون validation على _cardComplete —
  // Stripe نفسه هيرجع error لو الكارت ناقص
  // ======================================================

  Widget _buildCardField() {
    return _SectionCard(
      title: 'CARD DETAILS',
      icon: Icons.credit_card_rounded,
      child: Column(
        children: [
          CardField(
            style: const TextStyle(
              color: AppColors.foreground,
              fontSize: 16,
            ),
            decoration: InputDecoration(
              filled: true,
              fillColor: Colors.white,
              contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide:
                BorderSide(color: AppColors.primary.withOpacity(0.2)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide:
                BorderSide(color: AppColors.primary.withOpacity(0.15)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide:
                const BorderSide(color: AppColors.primary, width: 1.5),
              ),
            ),
            onCardChanged: (card) {
              // لا نعمل validation هنا — Stripe هو المسؤول
              print('Card changed: ${card?.complete}');
            },
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.lock_outline_rounded,
                  color: AppColors.textSecondary.withOpacity(0.5), size: 13),
              const SizedBox(width: 5),
              Text(
                'Secured & encrypted by Stripe',
                style: TextStyle(
                  color: AppColors.textSecondary.withOpacity(0.5),
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ======================================================
  // ORDER SUMMARY
  // ======================================================

  Widget _buildOrderSummary() {
    return _SectionCard(
      title: 'ORDER SUMMARY',
      icon: Icons.receipt_long_rounded,
      child: Column(
        children: [
          _buildSummaryRow('Subtotal', '\$${_subtotal.toStringAsFixed(2)}'),
          const SizedBox(height: 10),
          _buildSummaryRow(
            'Shipping',
            _deliveryType == DeliveryType.storePickup
                ? 'Free (Pickup) 🛍️'
                : (_shipping == 0 ? 'Free 🎁' : '\$${_shipping.toStringAsFixed(2)}'),
            valueColor: _shipping == 0 ? const Color(0xFF059669) : null,
          ),
          const SizedBox(height: 16),
          Container(height: 1, color: AppColors.border),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Total',
                style: TextStyle(
                  color: AppColors.foreground,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '\$${_total.toStringAsFixed(2)}',
                style: const TextStyle(
                  color: AppColors.primary,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          if (_deliveryType == DeliveryType.homeDelivery && _shipping > 0) ...[
            const SizedBox(height: 10),
            Container(
              padding:
              const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.06),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded,
                      color: AppColors.primary, size: 15),
                  const SizedBox(width: 8),
                  Text(
                    'Add \$${(500 - _subtotal).toStringAsFixed(0)} more for free shipping',
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: const TextStyle(
                color: AppColors.textSecondary, fontSize: 14)),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? AppColors.foreground,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  // ======================================================
  // ERROR BANNER
  // ======================================================

  Widget _buildErrorBanner() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.red.withOpacity(0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red.withOpacity(0.25)),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline_rounded, color: Colors.red, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              _errorMessage!,
              style: const TextStyle(color: Colors.red, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }

  // ======================================================
  // PAY BUTTON
  // ======================================================

  Widget _buildPayButton() {
    final bool isCash = _paymentMethod == PaymentMethod.cashOnDelivery;
    return _PrimaryButton(
      label: _isLoading
          ? 'Processing...'
          : isCash
          ? 'Place Order • \$${_total.toStringAsFixed(2)}'
          : 'Pay \$${_total.toStringAsFixed(2)}',
      isLoading: _isLoading,
      onTap: _isLoading ? null : _handlePayment,
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        color: AppColors.textSecondary,
        fontSize: 12,
        fontWeight: FontWeight.w700,
        letterSpacing: 1.8,
      ),
    );
  }
}

// ======================================================
// SECTION CARD WRAPPER
// ======================================================

class _SectionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Widget child;

  const _SectionCard({
    required this.title,
    required this.icon,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: AppColors.primary, size: 16),
              ),
              const SizedBox(width: 10),
              Text(
                title,
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.8,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }
}

// ======================================================
// DELIVERY TYPE OPTION
// ======================================================

class _DeliveryTypeOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final String sublabel;
  final bool isSelected;
  final VoidCallback onTap;

  const _DeliveryTypeOption({
    required this.icon,
    required this.label,
    required this.sublabel,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withOpacity(0.08) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primary
                        : AppColors.primary.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon,
                      color: isSelected ? Colors.white : AppColors.primary,
                      size: 18),
                ),
                const Spacer(),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 18,
                  height: 18,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isSelected ? AppColors.primary : Colors.transparent,
                    border: Border.all(
                      color: isSelected
                          ? AppColors.primary
                          : AppColors.textSecondary.withOpacity(0.3),
                      width: 1.5,
                    ),
                  ),
                  child: isSelected
                      ? const Icon(Icons.check_rounded,
                      color: Colors.white, size: 11)
                      : null,
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? AppColors.primary : AppColors.foreground,
                fontSize: 13,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              sublabel,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ======================================================
// ADDRESS CARD
// ======================================================

class _AddressCard extends StatelessWidget {
  final AddressModel address;
  final bool isSelected;
  final VoidCallback onTap;

  const _AddressCard({
    required this.address,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withOpacity(0.06) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.primary
                    : AppColors.primary.withOpacity(0.08),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                Icons.location_on_rounded,
                color: isSelected ? Colors.white : AppColors.primary,
                size: 18,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    address.name,
                    style: TextStyle(
                      color: isSelected ? AppColors.primary : AppColors.foreground,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    address.address,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                  if ((address.governmentName != null &&
                      address.governmentName!.isNotEmpty) ||
                      (address.cityName != null &&
                          address.cityName!.isNotEmpty)) ...[
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.map_outlined,
                            color: AppColors.textSecondary, size: 12),
                        const SizedBox(width: 4),
                        Text(
                          [address.cityName, address.governmentName]
                              .where((e) => e != null && e.isNotEmpty)
                              .join(', '),
                          style: const TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ],
                  if (address.landmark.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      '📍 ${address.landmark}',
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isSelected ? AppColors.primary : Colors.transparent,
                border: Border.all(
                  color: isSelected
                      ? AppColors.primary
                      : AppColors.textSecondary.withOpacity(0.3),
                  width: 1.5,
                ),
              ),
              child: isSelected
                  ? const Icon(Icons.check_rounded,
                  color: Colors.white, size: 12)
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}

// ======================================================
// PAYMENT OPTION
// ======================================================

class _PaymentOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final String sublabel;
  final bool isSelected;
  final VoidCallback onTap;

  const _PaymentOption({
    required this.icon,
    required this.label,
    required this.sublabel,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withOpacity(0.06) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.primary
                    : AppColors.primary.withOpacity(0.08),
                borderRadius: BorderRadius.circular(11),
              ),
              child: Icon(icon,
                  color: isSelected ? Colors.white : AppColors.primary,
                  size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      color: isSelected ? AppColors.primary : AppColors.foreground,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    sublabel,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isSelected ? AppColors.primary : Colors.transparent,
                border: Border.all(
                  color: isSelected
                      ? AppColors.primary
                      : AppColors.textSecondary.withOpacity(0.3),
                  width: 1.5,
                ),
              ),
              child: isSelected
                  ? const Icon(Icons.check_rounded,
                  color: Colors.white, size: 12)
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}

// ======================================================
// PRODUCT CARD
// ======================================================

class _ProductCard extends StatelessWidget {
  final CartItem product;

  const _ProductCard({required this.product});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              image: product.product.image.isNotEmpty
                  ? DecorationImage(
                image: NetworkImage(product.product.image),
                fit: BoxFit.cover,
              )
                  : null,
            ),
            child: product.product.image.isEmpty
                ? const Icon(Icons.shopping_bag_outlined,
                color: AppColors.primary, size: 28)
                : null,
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.product.name,
                  style: const TextStyle(
                    color: AppColors.foreground,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '\$${product.product.price.toStringAsFixed(2)} × ${product.quantity}',
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          Text(
            '\$${product.totalPrice.toStringAsFixed(2)}',
            style: const TextStyle(
              color: AppColors.primary,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

// ======================================================
// PRIMARY BUTTON
// ======================================================

class _PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;
  final bool isLoading;

  const _PrimaryButton({
    required this.label,
    this.onTap,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final bool enabled = onTap != null && !isLoading;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: double.infinity,
        height: 58,
        decoration: BoxDecoration(
          gradient: enabled
              ? const LinearGradient(
            colors: [AppColors.primary, Color(0xFF9F67FA)],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          )
              : null,
          color: !enabled ? const Color(0xFFE5E7EB) : null,
          borderRadius: BorderRadius.circular(16),
          boxShadow: enabled
              ? [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.3),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ]
              : null,
        ),
        child: Center(
          child: isLoading
              ? const SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(
              color: Colors.white,
              strokeWidth: 2.5,
            ),
          )
              : Text(
            label,
            style: TextStyle(
              color: enabled ? Colors.white : AppColors.textSecondary,
              fontSize: 17,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.3,
            ),
          ),
        ),
      ),
    );
  }
}