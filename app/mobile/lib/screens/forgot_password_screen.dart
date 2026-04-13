import 'package:flutter/material.dart';
import '../utils/getAPI.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../components/app_button.dart';
import '../components/app_text_field.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  String _email = '';
  bool _isLoading = false;
  bool _emailSent = false;

  Future<void> _handleSend() async {
    if (_email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your UCF email')),
      );
      return;
    }
    setState(() => _isLoading = true);
    try {
      final result = await getAPI.requestPasswordReset(_email.trim());
      if (!mounted) return;
      if (result['success'] == true) {
        setState(() => _emailSent = true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['message'] ?? 'Failed to send reset email')),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Connection error. Please try again.')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: AppColors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.black, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 16),
              Text('RESET PASSWORD', style: AppTextStyles.h3),
              const SizedBox(height: 10),
              Text(
                "Enter your UCF email and we'll send you a link to get back into your account.",
                style: AppTextStyles.caption,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              AppTextField(
                label: 'UCF Email',
                onChanged: (v) => setState(() => _email = v),
              ),
              const SizedBox(height: 12),
              if (_emailSent) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.check_circle_outline,
                        color: Colors.green, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Check your UCF email for reset instructions!',
                        style: AppTextStyles.caption.copyWith(color: Colors.green),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
              ],
              const SizedBox(height: 12),
              AppButton(
                label: 'Send Reset Link',
                onPressed: _emailSent ? null : _handleSend,
                isLoading: _isLoading,
                width: double.infinity,
              ),
              if (_emailSent) ...[
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => Navigator.pushNamedAndRemoveUntil(
                    context, '/login', (route) => false,
                  ),
                  child: const Text(
                    'Back to Login',
                    style: TextStyle(
                      color: AppColors.black,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
