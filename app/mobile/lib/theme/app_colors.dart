import 'package:flutter/material.dart';

class AppColors {
  AppColors._(); // prevent instantiation

  // Brand
  static const Color primary = Color(0xFFFFC527); // yellow

  // Backgrounds
  static const Color background = Color(0xFFFAFAFA); // off-white page background
  static const Color inputFill = Color(0xFFF5F5F5);  // text field fill

  // Text
  static const Color textPrimary = Colors.black;
  static const Color textSecondary = Color(0xFF999999); // grey labels & hints
  static const Color textMuted = Colors.black54;

  // Chips (interests / tags)
  static const Color chipBackground = Color(0xFFFEF3C7); // light amber
  static const Color chipSelected = Colors.orangeAccent;

  // Misc
  static const Color transparent = Colors.transparent;
  static const Color white = Colors.white;
  static const Color black = Colors.black;
}
