import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class AppTextField extends StatelessWidget {
  final String label;
  final ValueChanged<String>? onChanged;
  final TextEditingController? controller;
  final bool isPassword;
  final String error;
  final Widget? suffix;

  const AppTextField({
    super.key,
    required this.label,
    this.onChanged,
    this.controller,
    this.isPassword = false,
    this.error = '',
    this.suffix,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          obscureText: isPassword,
          onChanged: onChanged,
          decoration: InputDecoration(
            errorText: error.isEmpty ? null : error,
            filled: true,
            fillColor: AppColors.inputFill,
            suffix: suffix,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        ),
      ],
    );
  }
}
