import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTextStyles {
  AppTextStyles._();

  // Headings — Bebas Neue, 5% letter spacing
  static TextStyle h1 = GoogleFonts.bebasNeue(
    fontSize: 64,
    fontWeight: FontWeight.w400,
    letterSpacing: 64 * 0.05,
    color: AppColors.textPrimary,
  );

  static TextStyle h2 = GoogleFonts.bebasNeue(
    fontSize: 40,
    fontWeight: FontWeight.w400,
    letterSpacing: 40 * 0.05,
    color: AppColors.textPrimary,
  );

  static TextStyle h3 = GoogleFonts.bebasNeue(
    fontSize: 32,
    fontWeight: FontWeight.w400,
    letterSpacing: 32 * 0.05,
    color: AppColors.textPrimary,
  );

  static TextStyle h4 = GoogleFonts.bebasNeue(
    fontSize: 20,
    fontWeight: FontWeight.w400,
    letterSpacing: 20 * 0.05,
    color: AppColors.textPrimary,
  );

  // Body — Inter
  static TextStyle body = GoogleFonts.inter(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
  );

  static TextStyle caption = GoogleFonts.inter(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
  );

  // Buttons — League Spartan, semibold
  static TextStyle button = GoogleFonts.leagueSpartan(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppColors.white,
  );
}
