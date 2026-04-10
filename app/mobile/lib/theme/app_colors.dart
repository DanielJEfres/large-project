import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Brand
  static const Color primary = Color(0xFFFEBE10);   // Figma yellow
  static const Color dark    = Color(0xFF1A1A1A);   // Figma black

  // Backgrounds
  static const Color background = Color(0xFFF6F6F6); // off-white (designer note: f6f6f6 preferred)
  static const Color inputFill  = Color(0xFFE5E5E5); // neutral-2

  // Neutrals
  static const Color neutral1 = Color(0xFFF2F2F2);
  static const Color neutral2 = Color(0xFFE5E5E5);
  static const Color neutral3 = Color(0xFFAFAFAF);
  static const Color neutral4 = Color(0xFF4B4B4B);

  // Text
  static const Color textPrimary   = dark;
  static const Color textSecondary = neutral3;
  static const Color textMuted     = neutral4;

  // Chips
  static const Color chipBackground = Color(0xFFFEF3C7);
  static const Color chipSelected   = Colors.orangeAccent;

  // Misc
  static const Color transparent = Colors.transparent;
  static const Color white       = Colors.white;
  static const Color black       = Colors.black;
}
