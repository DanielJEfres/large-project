import 'package:flutter/material.dart';
import '../utils/getAPI.dart';
import '../utils/GlobalData.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../components/app_button.dart';
import '../components/app_text_field.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  String loginName = '', password = '';
  String emailError = '';

  Future<void> _handleLogin() async {
    if (loginName.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all fields')),
      );
      return;
    }
    try {
      var response = await getAPI.login(loginName.trim(), password);
      if (!mounted) return;
      if (response['success'] == true) {
        if (response['isVerified'] == false) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Please verify your email first.')),
          );
          Navigator.pushNamed(context, '/verification');
        } else {
          final user = response['user'] as Map<String, dynamic>? ?? {};
          GlobalData.token = response['accessToken'] ?? '';
          GlobalData.mongoUserId = user['id']?.toString() ?? '';
          GlobalData.firstName = user['firstName']?.toString() ?? '';
          GlobalData.lastName = user['lastName']?.toString() ?? '';
          Navigator.pushNamed(context, '/event/events');
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'] ?? 'Login failed')),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Server unreachable. Are you online?')),
      );
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
            Padding(
              padding: const EdgeInsets.only(top: 16.0, left: 8.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.black, size: 20),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 32.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(height: 8),
                    Text('LOGIN', style: AppTextStyles.h3),
                    const SizedBox(height: 8),
                    Text(
                      'Sign in to join clubs, RSVP for events, and more.',
                      textAlign: TextAlign.center,
                      style: AppTextStyles.caption,
                    ),
                    const SizedBox(height: 24),
                    // Rounded rectangle image
                    Container(
                      width: double.infinity,
                      height: 220,
                      decoration: BoxDecoration(
                        color: AppColors.inputFill,
                        borderRadius: BorderRadius.circular(16),
                        image: const DecorationImage(
                          image: AssetImage('assets/img.png'),
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    const SizedBox(height: 28),
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
                      suffix: GestureDetector(
                        onTap: () {
                          // TODO: handle password reset
                        },
                        child: const Text(
                          'Reset',
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    AppButton(
                      label: 'Log in',
                      onPressed: _handleLogin,
                      width: double.infinity,
                    ),
                    const SizedBox(height: 20),
                    RichText(
                      text: TextSpan(
                        style: const TextStyle(fontSize: 15, color: AppColors.textSecondary),
                        children: [
                          const TextSpan(text: "Don't have an account? "),
                          WidgetSpan(
                            child: GestureDetector(
                              onTap: () => Navigator.pushNamed(context, '/signup'),
                              child: const Text(
                                'Sign Up',
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
