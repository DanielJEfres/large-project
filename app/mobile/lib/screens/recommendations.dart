import 'package:flutter/material.dart';

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
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        // We use leadingWidth to give the back button enough room for your padding
        leadingWidth: 70,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16.0),
          child: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: TextButton(
              style: TextButton.styleFrom(
                // This is how you do padding INSIDE the button now
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
              ),
              onPressed: () {
                Navigator.pushNamed(context, '/event/events');
              },
              child: const Text(
                  "Skip",
                  style: TextStyle(color: Colors.grey, fontSize: 16)
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Space at the top
            SizedBox(height: screenHeight * 0.04),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40.0),
              child: Column(
                children: [
                  const Text(
                    'Select your interests',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 28),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 15),
                  const Text(
                    'Choose your favorite topics to get personalized event and club recommendations.',
                    style: TextStyle(fontSize: 16, color: Colors.black54),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            // Middle Section (Flexible)
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
                        backgroundColor: const Color(0xFFFEF3C7),
                        selectedColor: Colors.orangeAccent,
                        showCheckmark: false,
                        shape: const StadiumBorder(side: BorderSide.none),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ),

            // --- ADJUSTED BUTTON POSITION ---
            // Adding a small spacer here helps push the button slightly further from the bottom
            const SizedBox(height: 20),

            Padding(
              padding: EdgeInsets.only(
                // INCREASE THIS VALUE to move the button higher up
                bottom: screenHeight * 0.08,
                left: 20,
                right: 20,
              ),
              child: SizedBox(
                width: screenWidth * 0.85,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFFC107),
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                    elevation: 0,
                  ),
                  onPressed: () {},
                  child: const Text('Log in', style: TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}