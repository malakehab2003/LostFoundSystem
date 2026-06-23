import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/providers/address_provider.dart';

class AddressPage extends StatefulWidget {
  const AddressPage({super.key});

  @override
  State<AddressPage> createState() => _AddressPageState();
}

class _AddressPageState extends State<AddressPage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      final provider = context.read<AddressProvider>();

      provider.loadGovernments();
      provider.loadCities();
      provider.loadAddresses(context); // ✔️ FIXED
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AddressProvider>(
      builder: (context, provider, _) {
        return Scaffold(
          backgroundColor: const Color(0xFFF5F6FA),

          appBar: AppBar(
            title: const Text("My Addresses"),
            centerTitle: true,
            elevation: 0,
          ),

          floatingActionButton: FloatingActionButton(
            onPressed: () => _openAddAddressSheet(context, provider),
            child: const Icon(Icons.add),
          ),

          body: provider.isLoading
              ? const Center(child: CircularProgressIndicator())
              : provider.addresses.isEmpty
              ? _emptyState()
              : ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: provider.addresses.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final item = provider.addresses[index];

              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(Icons.location_on_outlined,
                        color: Colors.black54),
                    const SizedBox(width: 12),

                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.name,
                            style: const TextStyle(
                                fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "${item.address}, ${item.cityName ?? ''}",
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),

                    IconButton(
                      icon: const Icon(Icons.delete,
                          color: Colors.red),
                      onPressed: () {
                        provider.deleteAddress(context, item.id); // ✔️ FIXED
                      },
                    ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }

  // ================= EMPTY =================
  Widget _emptyState() {
    return const Center(
      child: Text(
        "No addresses yet\nPress + to add one",
        textAlign: TextAlign.center,
        style: TextStyle(color: Colors.grey),
      ),
    );
  }

  // ================= BOTTOM SHEET =================
  void _openAddAddressSheet(
      BuildContext context, AddressProvider provider) {
    final name = TextEditingController();
    final address = TextEditingController();
    final landmark = TextEditingController();
    final postal = TextEditingController();

    int? selectedGov;
    int? selectedCity;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Container(
              padding: EdgeInsets.only(
                left: 16,
                right: 16,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Add New Address",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 16),

                    _input(name, "Name"),
                    _input(address, "Address"),
                    _input(landmark, "Landmark"),
                    _input(postal, "Postal Code"),

                    const SizedBox(height: 10),

                    DropdownButtonFormField<int>(
                      value: selectedGov,
                      hint: const Text("Select Government"),
                      items: provider.governments
                          .map((g) => DropdownMenuItem(
                        value: g.id,
                        child: Text(g.name),
                      ))
                          .toList(),
                      onChanged: (val) {
                        setState(() {
                          selectedGov = val;
                          selectedCity = null;
                        });

                        if (val != null) {
                          provider.filterCitiesByGovernment(val);
                        }
                      },
                    ),

                    const SizedBox(height: 10),

                    DropdownButtonFormField<int>(
                      value: selectedCity,
                      hint: const Text("Select City"),
                      items: provider.filteredCities
                          .map((c) => DropdownMenuItem(
                        value: c.id,
                        child: Text(c.name),
                      ))
                          .toList(),
                      onChanged: (val) {
                        setState(() {
                          selectedCity = val;
                        });
                      },
                    ),

                    const SizedBox(height: 20),

                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () async {
                          if (selectedCity == null || selectedGov == null) {
                            return;
                          }

                          await provider.addAddress(
                            context: context, // ✔️ FIXED
                            name: name.text,
                            address: address.text,
                            landmark: landmark.text,
                            postalCode: postal.text,
                            cityId: selectedCity!,
                            governmentId: selectedGov!,
                          );

                          Navigator.pop(context);
                        },
                        child: const Text("Save Address"),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _input(TextEditingController c, String hint) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: TextField(
        controller: c,
        decoration: InputDecoration(
          hintText: hint,
          filled: true,
          fillColor: const Color(0xFFF5F5F5),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }
}