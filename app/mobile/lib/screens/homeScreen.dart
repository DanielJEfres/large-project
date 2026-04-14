import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../theme/app_colors.dart';
import '../components/app_button.dart';
import '../utils/auth_service.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    if (AuthService.isLoggedIn) {
      return _WelcomeBackScreen();
    }
    return _LandingScreen();
  }
}

// ─── Returning / logged-in user ──────────────────────────────────────────────

class _WelcomeBackScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final name = AuthService.firstName ?? '';
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              ClipRect(
                child: Align(
                  alignment: Alignment.topCenter,
                  heightFactor: 0.82,
                  child: SvgPicture.asset('assets/knight.svg', height: 320),
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'EVENTKNIGHT',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                name.isNotEmpty
                    ? 'Welcome back, $name!'
                    : 'Welcome back!',
                textAlign: TextAlign.center,
                style: const TextStyle(
                    fontSize: 16, color: AppColors.textSecondary),
              ),
              const Spacer(),
              AppButton(
                label: 'Get Started',
                onPressed: () => Navigator.pushReplacementNamed(
                    context, '/event/events'),
                width: double.infinity,
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── First-time / logged-out user ────────────────────────────────────────────

class _LandingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              ClipRect(
                child: Align(
                  alignment: Alignment.topCenter,
                  heightFactor: 0.82,
                  child: SvgPicture.asset('assets/knight.svg', height: 320),
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'EVENTKNIGHT',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Discover clubs, events, and everything happening at UCF.',
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: 16, color: AppColors.textSecondary),
              ),
              const Spacer(),
              AppButton(
                label: 'Log in or Sign up',
                onPressed: () =>
                    Navigator.pushNamed(context, '/login'),
                width: double.infinity,
              ),
              const SizedBox(height: 20),
              GestureDetector(
                onTap: () => Navigator.pushReplacementNamed(
                    context, '/events'),
                child: const Text(
                  'Skip to Browse Events',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
