import 'dart:convert';
import 'package:http/http.dart' as http;

class getAPI {
  //Domain fo the page connection
  static const String baseUrl = "https://api.eventknight.org/api";

  //Sign up path connection
  static Future<Map<String, dynamic>> signUp(
    String first,
    String last,
    String email,
    String password,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/signup'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "firstName": first,
          "lastName": last,
          "ucfEmail": email,
          "password": password,
        }),
      );

      final data = jsonDecode(response.body);
      return response.statusCode == 201
          ? {"success": true, "message": data['message']}
          : {"success": false, "message": data['message'] ?? "Signup failed"};
    } catch (e) {
      return {"success": false, "message": "Could not connect to server."};
    }
  }

  //log In connection
  static Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"ucfEmail": email, "password": password}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {
          "success": true,
          "accessToken": data['accessToken'],
          "isVerified":
              data['isVerified'] ??
              data['is_verified'], // Handle both naming styles
        };
      }
      return {
        "success": false,
        "message": data['message'] ?? "Invalid credentials",
      };
    } catch (e) {
      return {
        "success": false,
        "message": "Server error. Check CORS settings.",
      };
    }
  }

  // Fetch upcoming events
  static Future<Map<String, dynamic>> getUpcomingEvents() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/getEvents/getUpcoming'));
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true, "events": data['events'] ?? []}
          : {"success": false, "events": []};
    } catch (e) {
      return {"success": false, "events": []};
    }
  }

  // Fetch trending events
  static Future<Map<String, dynamic>> getTrendingEvents() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/getEvents/getTrending'));
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true, "events": data['events'] ?? []}
          : {"success": false, "events": []};
    } catch (e) {
      return {"success": false, "events": []};
    }
  }

  // Email verification
  static Future<Map<String, dynamic>> verifyEmail(
    String email,
    String token,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/verifyEmail/verify-email'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"ucfEmail": email, "token": token}),
      );

      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true, "message": "Verified!"}
          : {"success": false, "message": data['message'] ?? "Invalid Code"};
    } catch (e) {
      return {"success": false, "message": "Connection failed."};
    }
  }
}
