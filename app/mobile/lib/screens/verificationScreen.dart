import 'package:flutter/material.dart';
//import 'package:http/http.dart' as http;
import '../utils/getAPI.dart';

class VerificationScreen extends StatefulWidget {
  @override
  _VerificationScreenState createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _codeController = TextEditingController();
  bool _isLoading = false;


  Future<void> _verifyEmail() async {
    if (_emailController.text.isEmpty || _codeController.text.isEmpty) {
      _showSnackBar("Please fill in all fields");
      return;
    }

    setState(() => _isLoading = true);

    try {
      // calling get apis
      var response = await getAPI.verifyEmail(
          _emailController.text.trim(),
          _codeController.text.trim()
      );

      if (response['success'] == true) {
        _showSnackBar("Email Verified! You can now log in.");
        Navigator.pushNamed(context, '/login');
      }
      else {
        _showSnackBar(response['message'] ?? "Verification failed");
      }
    }
    catch (e) {
      _showSnackBar("Connection error. Check if your Node.js server is running!");
    }
    finally {
      setState(() => _isLoading = false);
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const Text('Check your Inbox',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30)),
              const SizedBox(height: 10),
              const Text('Enter the code sent to your UCF email',
                  style: TextStyle(fontSize: 15, color: Colors.grey)),
              const SizedBox(height: 40),

              // Image placeholder
              CircleAvatar(
                radius: 80,
                backgroundColor: Colors.grey[200],
                backgroundImage: const AssetImage('assets/img.png'),
              ),

              const SizedBox(height: 40),

              // Email Field
              TextField(
                controller: _emailController,
                decoration: InputDecoration(
                  labelText: 'UCF Email',
                  filled: true,
                  fillColor: Colors.grey[100],
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 16),

              // Code Field
              TextField(
                controller: _codeController,
                decoration: InputDecoration(
                  labelText: 'Verification Code',
                  hintText: 'Enter token',
                  filled: true,
                  fillColor: Colors.grey[100],
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
              ),

              const SizedBox(height: 30),

              _isLoading
                  ? const CircularProgressIndicator()
                  : SizedBox(
                width: 200,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFFD700),
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
                  ),
                  onPressed: () {
                    _verifyEmail(); // 1. Run your verification logic
                    Navigator.pushNamed(context, '/recommendations'); // 2. Then move to the next page
                  },
                  child: const Text('Verify Email', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}