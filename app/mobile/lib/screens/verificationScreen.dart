import 'package:flutter/material.dart';
import '../utils/getAPI.dart';
import '../theme/app_colors.dart';
import '../components/app_button.dart';
import '../theme/app_text_styles.dart';
import 'package:flutter_svg/flutter_svg.dart';

class VerificationScreen extends StatefulWidget {
  const VerificationScreen({super.key});

  @override
  State<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  bool _isLoading = false;
  bool _emailSent = false;
  bool _initialSendDone = false;
  String _email = '';

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialSendDone) {
      _initialSendDone = true;
      final email = ModalRoute.of(context)?.settings.arguments as String? ?? '';
      _email = email;
      if (email.isNotEmpty) _resendEmail(email);
    }
  }

  Future<void> _resendEmail(String email) async {
    if (email.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      final response = await getAPI.requestVerificationEmail(email);
      if (!mounted) return;
      if (response['success'] == true) {
        setState(() => _emailSent = true);
        _showSnackBar("Verification email sent to $email");
      } else {
        _showSnackBar(response['message'] ?? "Failed to send email");
      }
    } catch (e) {
      if (!mounted) return;
      _showSnackBar("Connection error. Please try again.");
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final email = _email;

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: AppColors.transparent,
        elevation: 0,
        toolbarHeight: 72,
        leading: Padding(
          padding: const EdgeInsets.only(top: 16.0, left: 8.0),
          child: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.black),
            onPressed: () => Navigator.pop(context),
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 24.0),
          child: Column(
            children: [
              Text('CHECK YOUR INBOX', style: AppTextStyles.h3),
              const SizedBox(height: 10),
              Text(
                email.isNotEmpty
                    ? 'We sent a verification link to\n$email'
                    : 'We sent a verification link to your UCF email.',
                style: AppTextStyles.caption,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              ClipRect(
                child: Align(
                  alignment: Alignment.topCenter,
                  heightFactor: 0.82,
                  child: SvgPicture.asset(
                    'assets/knight.svg',
                    height: 220,
                  ),
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'Open your email and tap the link to verify your account. Then come back and log in.',
                style: AppTextStyles.body.copyWith(
                  color: AppColors.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              AppButton(
                label: _emailSent ? 'Email Sent!' : 'Resend Verification Email',
                onPressed: _emailSent ? null : () => _resendEmail(email),
                isLoading: _isLoading,
                width: double.infinity,
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () => Navigator.pushNamedAndRemoveUntil(
                  context,
                  '/login',
                  (route) => false,
                ),
                child: const Text(
                  "I've verified my email. Log in",
                  style: TextStyle(
                    color: AppColors.black,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
