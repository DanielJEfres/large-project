import 'package:flutter/material.dart';
import '../utils/getAPI.dart';
import '../theme/app_colors.dart';
import '../components/app_button.dart';
import '../components/app_text_field.dart';

class SignUpScreen extends StatefulWidget {
  @override
  _SignUpScreenState createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  String loginName = '', password = '';
  String firstName = '', lastName = '';
  String emailError = '';
  bool _isLoading = false;

  Future<void> _handleSignUp() async {
    if (firstName.isEmpty || lastName.isEmpty || loginName.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all fields')),
      );
      return;
    }
    if (!loginName.trim().toLowerCase().endsWith('.edu')) {
      setState(() => emailError = 'Please enter a valid UCF email');
      return;
    }

    setState(() => _isLoading = true);

    try {
      var response = await getAPI.signUp(
        firstName.trim(),
        lastName.trim(),
        loginName.trim(),
        password,
      );
      if (!mounted) return;
      if (response['success'] == true) {
        Navigator.pushNamed(context, '/verification');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'] ?? 'Sign up failed')),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not connect to server')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Back button
            Align(
              alignment: Alignment.centerLeft,
              child: IconButton(
                icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.black, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(height: 8),
                    const Text(
                      'Get Started',
                      style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Sign up with your UCF email to get started.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 15, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 32),
                    AppTextField(
                      label: 'First name',
                      onChanged: (text) => firstName = text,
                    ),
                    const SizedBox(height: 16),
                    AppTextField(
                      label: 'Last name',
                      onChanged: (text) => lastName = text,
                    ),
                    const SizedBox(height: 16),
                    AppTextField(
                      label: 'Email (.edu)',
                      onChanged: (text) {
                        setState(() {
                          loginName = text;
                          emailError = text.isNotEmpty && !text.trim().toLowerCase().endsWith('.edu')
                              ? 'Must be a UCF email (.edu)'
                              : '';
                        });
                      },
                      error: emailError,
                    ),
                    const SizedBox(height: 16),
                    AppTextField(
                      label: 'Password',
                      onChanged: (text) => password = text,
                      isPassword: true,
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
            // Button pinned to bottom
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
              child: AppButton(
                label: 'Sign up',
                onPressed: _handleSignUp,
                isLoading: _isLoading,
                width: double.infinity,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
