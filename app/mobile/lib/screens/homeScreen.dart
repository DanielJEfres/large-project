import 'package:flutter/material.dart';

const Color myYellow = Color(0xFFFFC527);
class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:SafeArea(
        child:Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(

                    shape: BoxShape.circle,
                    image: const DecorationImage(
                      image: AssetImage('assets/img.png'),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),



                SizedBox(height: 40),
                Text(
                  'EventKnight'.toUpperCase(),
                  style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: 10),

                Text(
                  'Discover clubs, events, and everything happening at UCF.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 18, color: Colors.grey),
                ),
                SizedBox(height: 40),


                ElevatedButton(
                  onPressed: () {
                    // Handle Login or Sign Up navigation
                    Navigator.pushNamed(context, '/login');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: myYellow,
                    padding: EdgeInsets.symmetric(horizontal: 50, vertical: 20),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child: Text(
                    'Login or Sign up',
                    style: TextStyle(fontSize: 18, color: Colors.black),
                  ),
                ),
                SizedBox(height: 20),

                ElevatedButton(
                  onPressed: () {

                    Navigator.pushNamed(context, '/events'); // Navigate to events page
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent, // Set a visible background color
                    padding: EdgeInsets.symmetric(horizontal: 50, vertical: 20),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child: Text(
                    'Browse Events',
                    style: TextStyle(fontSize: 18, color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
      ),),
    );
  }}
