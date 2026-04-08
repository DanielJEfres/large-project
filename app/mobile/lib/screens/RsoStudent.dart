import 'package:flutter/material.dart';

class RsoStudent extends StatefulWidget {
  @override
  State<RsoStudent> createState() => _RsoStudentState();
}

class _RsoStudentState extends State<RsoStudent> {

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
      ),
      body: SafeArea(
        child: Column(
          children: [
            // 1. THE ANCHOR (Top)
            // This stays at the top because it's first in the list.
            const SizedBox(height: 40),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 40.0),
              child: Text(
                'Are you an RSO Organizer?',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
                textAlign: TextAlign.center,
              ),
            ),

            // 2. THE TOP SPRING
            // This pushes the buttons down from the title.
            const Spacer(flex: 2),

            // --- PASTE THIS BLOCK FOR YOUR BUTTONS ---
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40.0),
              child: Column(
                children: [
                  // YES BUTTON (Black)
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(40), // Makes it a pill shape
                        ),
                      ),
                      onPressed: () {
                        Navigator.pushNamed(context, '/organizations');
                      },
                      child: const Text('Yes',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ),
                  ),

                  const SizedBox(height: 20), // Space between buttons

                  // NO BUTTON (Yellow)
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFFC107), // UCF Gold
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(40),
                        ),
                      ),
                      onPressed: () {
                        Navigator.pushNamed(context, '/recommendations');
                      },
                      child: const Text('No, just a UCF Student',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ),
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