import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../components/app_button.dart';
import '../utils/auth_service.dart';

class Recommendations extends StatefulWidget {
  @override
  State<Recommendations> createState() => _RecommendationsState();
}

class _RecommendationsState extends State<Recommendations> {
  final List<String> _interests = [
    "Music", "Food & Drink", "Business", "Religion & Spirituality",
    "Theater & Dance", "Social Justice & Human Rights", "Engineering & Technology",
    "Science", "Career Development", "Medicine", "Government & Politics",
    "Education", "Community & Culture", "Humanities", "Arts & Media",
    "Health & Wellness", "Hobbies & Special Interest", "Other"
  ];

  final Set<String> _selectedInterests = {};

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final screenHeight = size.height;
    final screenWidth = size.width;

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 100,
        leadingWidth: 70,
        toolbarHeight: 72,
        leading: Padding(
          padding: const EdgeInsets.only(top: 16.0, left: 8.0),
          child: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.black, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: TextButton(
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
              ),
              onPressed: () async {
                await AuthService.completeOnboarding();
                if (!context.mounted) return;
                Navigator.pushReplacementNamed(context, '/event/events');
              },
              child: const Text(
                'Skip',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 16),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            SizedBox(height: screenHeight * 0.04),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32.0),
              child: Column(
                children: [
                  Text('SELECT YOUR INTERESTS', style: AppTextStyles.h3, textAlign: TextAlign.center),
                  const SizedBox(height: 15),
                  Text(
                    'Choose your favorite topics to get personalized event and club recommendations.',
                    style: AppTextStyles.body.copyWith(color: AppColors.textMuted),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            Expanded(
              child: Container(
                padding: EdgeInsets.symmetric(
                  horizontal: screenWidth * 0.1,
                  vertical: 20,
                ),
                child: SingleChildScrollView(
                  child: Wrap(
                    spacing: 10.0,
                    runSpacing: 10.0,
                    alignment: WrapAlignment.center,
                    children: _interests.map((interest) {
                      final isSelected = _selectedInterests.contains(interest);
                      return FilterChip(
                        label: Text(interest),
                        selected: isSelected,
                        onSelected: (bool selected) {
                          setState(() {
                            if (selected) _selectedInterests.add(interest);
                            else _selectedInterests.remove(interest);
                          });
                        },
                        backgroundColor: AppColors.chipBackground,
                        selectedColor: AppColors.chipSelected,
                        showCheckmark: false,
                        shape: const StadiumBorder(side: BorderSide.none),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Padding(
              padding: EdgeInsets.only(
                bottom: screenHeight * 0.08,
                left: 20,
                right: 20,
              ),
              child: AppButton(
                label: 'Continue',
                onPressed: () async {
                  await AuthService.completeOnboarding();
                  if (!context.mounted) return;
                  Navigator.pushReplacementNamed(context, '/event/events');
                },
                width: screenWidth * 0.85,
                foregroundColor: AppColors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
