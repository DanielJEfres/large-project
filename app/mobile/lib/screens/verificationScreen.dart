import 'package:flutter/material.dart';
import '../utils/getAPI.dart';
import '../theme/app_colors.dart';
import '../components/app_button.dart';
import '../components/app_text_field.dart';

class VerificationScreen extends StatefulWidget {
  @override
  _VerificationScreenState createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _codeController = TextEditingController();
  bool _isLoading = false;

  Future<void> _verifyEmail() async {
    if (_emailController.text.isEmpty || _codeController.text.isEmpty) {
      _showSnackBar("Please fill in all fields");
      return;
    }

    setState(() => _isLoading = true);

    try {
      var response = await getAPI.verifyEmail(
        _emailController.text.trim(),
        _codeController.text.trim(),
      );
      if (!mounted) return;
      if (response['success'] == true) {
        _showSnackBar("Email Verified! You can now log in.");
        Navigator.pushNamed(context, '/login');
      } else {
        _showSnackBar(response['message'] ?? "Verification failed");
      }
    } catch (e) {
      if (!mounted) return;
      _showSnackBar("Connection error. Check if your Node.js server is running!");
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const Text(
                'Check your Inbox',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
              ),
              const SizedBox(height: 10),
              const Text(
                'Enter the code sent to your UCF email',
                style: TextStyle(fontSize: 15, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 40),
              CircleAvatar(
                radius: 80,
                backgroundColor: AppColors.inputFill,
                backgroundImage: const AssetImage('assets/img.png'),
              ),
              const SizedBox(height: 40),
              AppTextField(
                label: 'UCF Email',
                controller: _emailController,
              ),
              const SizedBox(height: 16),
              AppTextField(
                label: 'Verification Code',
                controller: _codeController,
              ),
              const SizedBox(height: 30),
              AppButton(
                label: 'Verify Email',
                onPressed: () {
                  _verifyEmail();
                  Navigator.pushNamed(context, '/recommendations');
                },
                isLoading: _isLoading,
                width: 200,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
