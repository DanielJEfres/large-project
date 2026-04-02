import 'dart:convert';
import 'package:flutter/material.dart';
import '../utils/GlobalData.dart';
import '../utils/getAPI.dart';
import  '../screens/verificationScreen.dart';


class SignUpScreen extends StatefulWidget {
  @override
  _SignUpScreenState createState() => _SignUpScreenState();
}
const Color myYellow = Color(0xFFFFC527);
class _SignUpScreenState extends State<SignUpScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(212, 255, 255, 255),
      body: MainPage(),
    );
  }
}

class MainPage extends StatefulWidget {
  @override
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  String message = '', newMessageText = '';
  String loginName = '', password = '';
  String firstName = '', lastName = '';

  changeText() {
    setState(() {
      message = newMessageText;
    });
  }
  final TextEditingController _SignUpController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(

      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        toolbarHeight: 80,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16.0),
          child: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black),
            onPressed: () {
              Navigator.pop(context);
            },
        ),
      ),),

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(

                  shape: BoxShape.circle, // 1. Makes the container a circle
                  image: DecorationImage(
                    image: AssetImage('assets/img.png'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const SizedBox(height: 40),
              Text(
                'Get Started'.toUpperCase(),
                style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              Text(
                'Sign up with your UCF email to get started',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.normal),
              ),
              const SizedBox(height: 30),


              buildTextField('First Name', (text) => firstName = text),
              const SizedBox(height: 16),
              buildTextField('Last Name', (text) => lastName = text),
              const SizedBox(height: 16),
              buildTextField('Email (.edu)', (text) => loginName = text),
              const SizedBox(height: 16),
              buildTextField('Password', (text) => password = text, isPassword: true),

              const SizedBox(height: 30),

              // Sign Up Button
              SizedBox(
                width: 150,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: myYellow,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
                  ),
                  onPressed: () => Navigator.pushNamed(context, '/verification'),
                  child: const Text('Continue', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }


  Widget buildTextField(String label, Function(String) onChanged, {bool isPassword = false}) {
    return TextField(
      obscureText: isPassword,
      onChanged: onChanged,
      decoration: InputDecoration(
        labelText: label,
        floatingLabelBehavior: FloatingLabelBehavior.always,
        filled: true,
        fillColor: Colors.grey[100],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }}