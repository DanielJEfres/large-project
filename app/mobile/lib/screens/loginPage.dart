import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';

const Color myYellow = Color(0xFFFFC527);

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  Widget build(BuildContext context) {
    return MainPage();
  }
}

class MainPage extends StatefulWidget {
  @override
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  String loginName = '', password = '';

  // 1. Define the recognizer here
  late TapGestureRecognizer _signUpRecognizer;

  @override
  void initState() {
    super.initState();
    // 2. Initialize it once in initState
    _signUpRecognizer = TapGestureRecognizer()
      ..onTap = () {
        Navigator.pushNamed(context, '/signup');
      };
  }

  @override
  void dispose() {

    _signUpRecognizer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 250, 250, 250),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        toolbarHeight: 80,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16.0),
          child: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black),
            onPressed: () => Navigator.pop(context),
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,

                  image: DecorationImage(
                    image: AssetImage('assets/img.png'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const SizedBox(height: 30),
              Text(
                'Welcome Back'.toUpperCase(),
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              const Text(
                'We\'ll use your UCF email to log into your account',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 40),
              TextField(
                onChanged: (text) => loginName = text,
                decoration: InputDecoration(
                  labelText: 'UCF email (.edu)',
                  filled: true,
                  fillColor: Colors.grey[200],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                obscureText: true,
                onChanged: (text) => password = text,
                decoration: InputDecoration(
                  labelText: 'Password',
                  filled: true,
                  fillColor: Colors.grey[200],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 30),
              SizedBox(
                width: 150,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: myYellow,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
                  ),
                  onPressed: () {
                    //enter page events not login just temporarily here

                    Navigator.pushNamed(context, '/login');
                  },
                  child: const Text('Log In', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 24),
              RichText(
                text: TextSpan(
                  style: const TextStyle(fontSize: 15, color: Colors.grey),
                  children: [
                    const TextSpan(text: "Don't have an account? "),
                    TextSpan(
                      text: 'SignUp',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
                      // 4. Reference the persistent recognizer here
                      recognizer: _signUpRecognizer,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              const Text(
                'Event Knight is a Student-built app and is not affiliated with UCF',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
