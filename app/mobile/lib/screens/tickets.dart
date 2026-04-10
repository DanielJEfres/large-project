import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class TicketsScreen extends StatelessWidget {
  const TicketsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('MY TICKETS', style: AppTextStyles.h2),
              const Spacer(),
              const Center(
                child: Text(
                  'Coming soon',
                  style: TextStyle(color: AppColors.textMuted),
                ),
              ),
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}
