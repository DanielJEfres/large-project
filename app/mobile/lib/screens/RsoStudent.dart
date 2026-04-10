import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../components/app_button.dart';

class RsoStudent extends StatefulWidget {
  @override
  State<RsoStudent> createState() => _RsoStudentState();
}

class _RsoStudentState extends State<RsoStudent> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        leadingWidth: 70,
        toolbarHeight: 72,
        leading: Padding(
          padding: const EdgeInsets.only(top: 16.0, left: 8.0),
          child: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.black, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 40),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 32.0),
              child: Text(
                'ARE YOU AN RSO ORGANIZER?',
                style: AppTextStyles.h3,
                textAlign: TextAlign.center,
              ),
            ),
            const Spacer(flex: 2),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32.0),
              child: Column(
                children: [
                  AppButton(
                    label: 'Yes',
                    onPressed: () => Navigator.pushNamed(context, '/organizations'),
                    width: double.infinity,
                    backgroundColor: AppColors.black,
                    foregroundColor: AppColors.white,
                  ),
                  const SizedBox(height: 20),
                  AppButton(
                    label: 'No, just a UCF Student',
                    onPressed: () => Navigator.pushNamed(context, '/recommendations'),
                    width: double.infinity,
                    foregroundColor: AppColors.white,
                  ),
                ],
              ),
            ),
            const Spacer(flex: 3),
          ],
        ),
      ),
    );
  }
}
