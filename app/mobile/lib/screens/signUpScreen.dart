import 'dart:convert';
import 'package:flutter/material.dart';
import '../utils/getAPI.dart';

//Stateful to rebuild the widget tree each , by changing specific parts
class SignUpScreen extends StatefulWidget {
  @override
  _SignUpScreenState createState() => _SignUpScreenState();
}


const Color myYellow = Color(0xFFFFC527);


class _SignUpScreenState extends State<SignUpScreen> {
  String loginName = '', password = '';
  String firstName = '', lastName = '';
  String emailError = '';
  bool _isLoading = false;

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
            onPressed: () => Navigator.pop(context),
          ),
        ),
      ),
      //body safe area to avoid movememnts of the information
      body: SafeArea(
        //to much info then scroll
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          //organized by columns
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
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
              const Text(
                'Sign up with your UCF email to get started',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.normal, color: Colors.grey),
              ),
              const SizedBox(height: 30),

              buildTextField('First Name', (text) => firstName = text),
              const SizedBox(height: 16),
              buildTextField('Last Name', (text) => lastName = text),
              const SizedBox(height: 16),

              buildTextField(
                'Email (.edu)',
                    (text) {
                  setState(() {
                    loginName = text;
                    if (text.isNotEmpty && !text.trim().toLowerCase().endsWith('.edu')) {
                      emailError = 'Must be a UCF email (.edu)';
                    } else {
                      emailError = '';
                    }
                  });
                },
                error: emailError,
              ),

              const SizedBox(height: 16),
              buildTextField('Password', (text) => password = text, isPassword: true),
              const SizedBox(height: 30),

              SizedBox(
                width: 150,
                child: _isLoading
                    ? const Center(child: CircularProgressIndicator(color: myYellow))
                    : ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: myYellow,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
                  ),
                  onPressed: () async {
                    //Frontend Checks
                    if (firstName.isEmpty || lastName.isEmpty || loginName.isEmpty || password.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Please fill in all fields')),
                      );
                      return;
                    }
                    //check that the email is good format
                    if (!loginName.trim().toLowerCase().endsWith('.edu')) {
                      setState(() {
                        emailError = 'Please enter a valid UCF email';
                      });
                      return;
                    }

                    setState(() => _isLoading = true);

                    //Backend Call
                    try {
                      var response = await getAPI.signUp(
                          firstName.trim(),
                          lastName.trim(),
                          loginName.trim(),
                          password
                      );

                      if (response['success'] == true) {
                        // Send verification
                        Navigator.pushNamed(context, '/verification');
                      }
                      else {
                        // The user exist
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(response['message'] ?? 'Sign up failed')),
                        );
                      }
                    }
                    catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Could not connect to server')),
                      );
                    }
                    finally {
                      setState(() => _isLoading = false);
                    }
                  },
                  child: const Text('Continue', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildTextField(String label, Function(String) onChanged, {bool isPassword = false, String error = ''}) {
    return TextField(
      obscureText: isPassword,
      onChanged: onChanged,
      decoration: InputDecoration(
        labelText: label,
        errorText: error.isEmpty ? null : error,
        floatingLabelBehavior: FloatingLabelBehavior.always,
        filled: true,
        fillColor: Colors.grey[100],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}

