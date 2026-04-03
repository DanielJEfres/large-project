import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import '../utils/getAPI.dart';

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
  String emailError = '';

  late TapGestureRecognizer _signUpRecognizer;

  @override
  void initState() {
    super.initState();
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

  // 2. Added the missing helper function
  Widget buildTextField(String label, Function(String) onChanged,
      {bool isPassword = false, String error = ''}) {
    return TextField(
      obscureText: isPassword,
      onChanged: onChanged,
      decoration: InputDecoration(
        labelText: label,
        errorText: error.isEmpty ? null : error,
        filled: true,
        fillColor: Colors.grey[200],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
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
                decoration: const BoxDecoration(
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
              buildTextField(
                'Email (.edu)',
                    (text) {
                  setState(() {
                    loginName = text;
                    if (text.isNotEmpty && !text.trim().toLowerCase().endsWith('.edu')) {
                      emailError = 'Wrong format must be a UCF email (.edu)';
                    }
                    else {
                      emailError = '';
                    }
                  });
                },
                error: emailError,
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
                  onPressed: () async {
                    //  Basic Validation
                    if (loginName.isEmpty || password.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Please fill in all fields')),
                      );
                      return;
                    }

                    //  Call the getAPI login method
                    try {
                      var response = await getAPI.login(loginName.trim(), password);

                      if (response['success'] == true) {
                        // 3. Check if the user is verified
                        if (response['isVerified'] == false) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Please verify your email first.')),
                          );
                          // Send them to the verification screen instead of the events page
                          Navigator.pushNamed(context, '/verification');
                        } else {
                          // 4. Success! Save token (optional) and go to Events
                          print("Login Successful! Token: ${response['accessToken']}");
                          Navigator.pushNamed(context, '/events');
                        }
                      } else {
                        // 5. Show error from backend (e.g., "Invalid credentials")
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(response['message'] ?? 'Login failed')),
                        );
                      }
                    } catch (e) {
                      // Handling network/server issues
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Server unreachable. Are you online?')),
                      );
                    }
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
