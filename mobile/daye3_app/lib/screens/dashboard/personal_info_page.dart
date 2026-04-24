import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/providers/user_provider.dart';

class PersonalInfoPage extends StatefulWidget {
  final Map<String, String> userData;

  const PersonalInfoPage({super.key, required this.userData});

  @override
  State<PersonalInfoPage> createState() => _PersonalInfoPageState();
}

class _PersonalInfoPageState extends State<PersonalInfoPage> {
  bool isEditing = false;

  late TextEditingController nameController;
  late TextEditingController emailController;
  late TextEditingController phoneController;
  late TextEditingController dobController;
  late TextEditingController passwordController;
  late TextEditingController oldPasswordController;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController(text: widget.userData['name']);
    emailController = TextEditingController(text: widget.userData['email']);
    phoneController = TextEditingController(text: widget.userData['phone']);
    dobController = TextEditingController(text: widget.userData['dob']);
    passwordController = TextEditingController(text: '');
    oldPasswordController = TextEditingController(text: '');
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<UserProvider>(context, listen: false);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        centerTitle: true,
        title: const Text("Personal Information"),
        actions: [
          IconButton(
            icon: Icon(isEditing ? Icons.close : Icons.edit),
            onPressed: () {
              setState(() {
                isEditing = !isEditing;
              });
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            _infoField("Name", nameController, enabled: isEditing),
            _infoField("Phone", phoneController, enabled: isEditing),
            _infoField("Date of Birth", dobController, enabled: isEditing),
            const SizedBox(height: 15),
            if (isEditing)
              _infoField("Old Password", oldPasswordController,
                  isPassword: true, enabled: true),
            _infoField("New Password", passwordController,
                isPassword: true, enabled: isEditing),
            const SizedBox(height: 30),
            if (isEditing)
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  onPressed: () {
                    
                    if (oldPasswordController.text !=
                        widget.userData['password']) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text("Old password is incorrect")),
                      );
                      return;
                    }

                    provider.updateUser({
                      'name': nameController.text,
                      'email': emailController.text ?? '',
                      'phone': phoneController.text,
                      'dob': dobController.text,
                      'gender': widget.userData['gender'] ?? '',
                      'password': passwordController.text.isEmpty
                          ? widget.userData['password'] ?? ''
                          : passwordController.text,
                      'photo': widget.userData['photo'] as String? ?? '',
                    });

                    setState(() {
                      isEditing = false;
                      oldPasswordController.clear();
                      passwordController.clear();
                    });

                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Profile updated successfully")),
                    );
                  },
                  child: const Text(
                    "SAVE CHANGES",
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                ),
              ),
            const SizedBox(height: 15),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                onPressed: () {
                  provider.deleteUser();
                  Navigator.of(context).pop(); 
                },
                child: const Text(
                  "DELETE ACCOUNT",
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoField(String label, TextEditingController controller,
      {bool isPassword = false, bool enabled = false}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 8),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          TextField(
            controller: controller,
            obscureText: isPassword,
            enabled: enabled,
            decoration: InputDecoration(
              hintText: label,
              filled: true,
              fillColor: AppColors.primary.withOpacity(0.08),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
