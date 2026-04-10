import 'package:flutter/material.dart';
import 'package:mobile/screens/homeScreen.dart';
import 'package:mobile/screens/signUpScreen.dart';
import 'package:mobile/screens/loginPage.dart';
import 'package:mobile/screens/verificationScreen.dart';
import 'package:mobile/screens/recommendations.dart';
import 'package:mobile/screens/events/events.dart';
import 'package:mobile/screens/RsoStudent.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => HomeScreen(),  // Home screen is the initial route
        '/login': (context) => LoginScreen(),  // Login screen route
        '/signup': (context) => SignUpScreen(),
        '/verification': (context) => VerificationScreen(),
        '/recommendations': (context) => Recommendations(), // Sign Up screen route
        '/events':(context)=> EventsScreen(),
        '/RsoStudent':(context)=> RsoStudent(),
      },
    );
  }
}