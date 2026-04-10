import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final double? width;
  final Color backgroundColor;
  final Color foregroundColor;

  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.width = 150,
    this.backgroundColor = AppColors.primary,
    this.foregroundColor = AppColors.white,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      child: isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: backgroundColor,
                foregroundColor: foregroundColor,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(32),
                ),
                elevation: 0,
              ),
              onPressed: onPressed,
              child: Text(
                label,
                style: AppTextStyles.button.copyWith(color: foregroundColor),
              ),
            ),
    );
  }
}
