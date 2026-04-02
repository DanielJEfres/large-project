import 'package:flutter/material.dart';
import '../screens/signUpScreen.dart';

class verificationScreen extends StatelessWidget {
  String loginName = '';
  @override

  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation:0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),

      body: SafeArea(
        child: Padding( // Added 'child:' here
          padding: const EdgeInsets.all(24.0),
          child: SingleChildScrollView(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Text(
                    'Check your Inbox',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 30,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'We sent a code to your email',
                    style: TextStyle(
                      fontWeight: FontWeight.normal,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 40), // Added a little space
                  Container(
                    width: 300,
                    height: 300,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      image: DecorationImage(
                        image: AssetImage('assets/img.png'),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(height: 50),
                  TextField(
                    onChanged: (text) => loginName = text,
                    decoration: InputDecoration(
                      labelText: 'UCF email (.edu)',
                      filled: true,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),

                  const SizedBox(height:30),
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

                        Navigator.pushNamed(context, '/login');
                      },
                      child: const Text('Log In', style: TextStyle(fontWeight: FontWeight.bold)),
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
        ),
      ),
    );
  }
}