import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import '../../core/theme/app_colors.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  File? pickedImage;
  final picker = ImagePicker();

  final nameController = TextEditingController();
  final dobController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  String? gender;

  Future<void> _pickImage() async {
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        pickedImage = File(image.path);
      });
    }
  }

  Future<void> _pickDate() async {
    DateTime? date = await showDatePicker(
      context: context,
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      initialDate: DateTime(2000),
    );
    if (date != null) {
      setState(() {
        dobController.text = date.toLocal().toString().split(' ')[0];
      });
    }
  }

  Future<void> _submit() async {
    if (nameController.text.isEmpty ||
        dobController.text.isEmpty ||
        gender == null ||
        emailController.text.isEmpty ||
        phoneController.text.isEmpty ||
        pickedImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill all fields and select an image')));
      return;
    }

    final uri = Uri.parse('https://yourbackend.com/api/signup');
    var request = http.MultipartRequest('POST', uri);

    request.fields['name'] = nameController.text;
    request.fields['dob'] = dobController.text;
    request.fields['gender'] = gender!;
    request.fields['email'] = emailController.text;
    request.fields['phone'] = phoneController.text;

    request.files.add(await http.MultipartFile.fromPath(
      'photo',
      pickedImage!.path,
      contentType: MediaType('image', 'jpeg'),
    ));

    final response = await request.send();

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sign up successful')));
      Navigator.pop(context); // ارجع للصفحة السابقة أو Home
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sign up failed')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 40),
            child: Container(
              width: 350,
              padding: const EdgeInsets.all(25),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 20)],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  GestureDetector(
                    onTap: _pickImage,
                    child: CircleAvatar(
                      radius: 50,
                      backgroundColor: AppColors.primary.withOpacity(0.3),
                      backgroundImage:
                      pickedImage != null ? FileImage(pickedImage!) : null,
                      child: pickedImage == null
                          ? const Icon(Icons.person_add, size: 50, color: Colors.white)
                          : null,
                    ),
                  ),
                  if (pickedImage != null)
                    TextButton.icon(
                      onPressed: () {
                        setState(() {
                          pickedImage = null;
                        });
                      },
                      icon: const Icon(Icons.delete, color: Colors.red),
                      label: const Text('Remove Image', style: TextStyle(color: Colors.red)),
                    ),
                  const SizedBox(height: 20),
                  _inputField("Name", controller: nameController),
                  const SizedBox(height: 15),
                  TextField(
                    controller: dobController,
                    readOnly: true,
                    decoration: InputDecoration(
                      hintText: "Date of Birth",
                      filled: true,
                      fillColor: AppColors.primary.withOpacity(0.08),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.date_range),
                        onPressed: _pickDate,
                      ),
                    ),
                  ),
                  const SizedBox(height: 15),
                  Row(
                    children: [
                      Expanded(
                        child: ChoiceChip(
                          label: const Text("Male"),
                          selected: gender == "Male",
                          onSelected: (_) {
                            setState(() {
                              gender = "Male";
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: ChoiceChip(
                          label: const Text("Female"),
                          selected: gender == "Female",
                          onSelected: (_) {
                            setState(() {
                              gender = "Female";
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 15),
                  _inputField("Email", controller: emailController),
                  const SizedBox(height: 15),
                  _inputField("Phone Number", controller: phoneController),
                  const SizedBox(height: 25),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                      ),
                      onPressed: _submit,
                      child: const Text("SIGN UP", style: TextStyle(fontSize: 16, color: Colors.white)),
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: const Text("Already have an account? Login"),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _inputField(String hint, {TextEditingController? controller}) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        hintText: hint,
        filled: true,
        fillColor: AppColors.primary.withOpacity(0.08),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
