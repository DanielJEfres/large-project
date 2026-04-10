import 'package:flutter/material.dart';
import 'package:mobile/screens/homeScreen.dart';
import 'package:mobile/screens/loginPage.dart';
import 'package:mobile/screens/signUpScreen.dart';
import 'package:mobile/screens/verificationScreen.dart';
import 'package:mobile/screens/recommendations.dart';
import 'package:mobile/screens/RsoStudent.dart';
import 'package:mobile/screens/shell.dart';

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
        '/': (context) => HomeScreen(),
        '/login': (context) => LoginScreen(),
        '/signup': (context) => SignUpScreen(),
        '/verification': (context) => VerificationScreen(),
        '/recommendations': (context) => Recommendations(),
        '/RsoStudent': (context) => RsoStudent(),
        // Both paths used across screens route to the main shell
        '/events': (context) => const MainShell(),
        '/event/events': (context) => const MainShell(),
      },
    );
  }
}
