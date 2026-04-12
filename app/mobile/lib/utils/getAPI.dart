import 'dart:convert';
import 'package:http/http.dart' as http;
import 'auth_service.dart';

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
          "isVerified": data['isVerified'] ?? data['is_verified'],
          "user": data['user'],
        };
      }
      // Some deployments return 403 when email is not verified
      final message = (data['message'] ?? '').toString().toLowerCase();
      if (response.statusCode == 403 || message.contains('verif')) {
        return {
          "success": false,
          "requiresVerification": true,
          "message": data['message'] ?? "Email verification required",
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

  // Fetch a single event by ID
  static Future<Map<String, dynamic>> getEvent(String eventId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/events/$eventId'));
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true, "event": data['event']}
          : {"success": false, "event": null};
    } catch (e) {
      return {"success": false, "event": null};
    }
  }

  // Fetch organization by ID
  static Future<Map<String, dynamic>> getOrganization(String orgId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/organizations/$orgId'));
      final data = jsonDecode(response.body);
      // Backend returns key "Organization" (capital O)
      return response.statusCode == 200
          ? {"success": true, "organization": data['Organization'] ?? data['organization'] ?? data}
          : {"success": false, "organization": null};
    } catch (e) {
      return {"success": false, "organization": null};
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

  // RSVP to an event
  static Future<Map<String, dynamic>> attendEvent(String eventId) async {
    final userId = AuthService.userId;
    if (userId == null) return {"success": false, "message": "Not logged in"};
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/events/attendEvent/$eventId'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${AuthService.token}",
        },
        body: jsonEncode({"userId": userId}),
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true}
          : {"success": false, "message": data['message'] ?? "RSVP failed"};
    } catch (e) {
      return {"success": false, "message": "Could not connect to server."};
    }
  }

  // Cancel RSVP
  static Future<Map<String, dynamic>> unattendEvent(String eventId) async {
    final userId = AuthService.userId;
    if (userId == null) return {"success": false, "message": "Not logged in"};
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/events/unattendEvent/$eventId'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${AuthService.token}",
        },
        body: jsonEncode({"userId": userId}),
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true}
          : {"success": false, "message": data['message'] ?? "Unattend failed"};
    } catch (e) {
      return {"success": false, "message": "Could not connect to server."};
    }
  }

  // Request a verification email to be sent
  static Future<Map<String, dynamic>> requestVerificationEmail(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/email-verification/request'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"ucfEmail": email}),
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true}
          : {"success": false, "message": data['message'] ?? "Failed to send email"};
    } catch (e) {
      return {"success": false, "message": "Connection failed."};
    }
  }
  static Future<Map<String, dynamic>> getOrganizations({String? name}) async {
    try {
      final uri = name != null && name.isNotEmpty
          ? Uri.parse('$baseUrl/organizations?name=${Uri.encodeComponent(name)}')
          : Uri.parse('$baseUrl/organizations');
      final response = await http.get(uri);
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true, "organizations": data['Organizations'] ?? []}
          : {"success": false, "organizations": []};
    } catch (e) {
      return {"success": false, "organizations": [], "message": "Error: $e"};
    }
  }

  static Future<Map<String, dynamic>> getOrganizationById(String orgId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/organizations/$orgId'));
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {
              "success": true,
              "organization": data['Organization'],
              "events": data['Events'] ?? [],
            }
          : {"success": false, "organization": null, "events": []};
    } catch (e) {
      return {"success": false, "organization": null, "events": []};
    }
  }

  // Join an organization by name
  static Future<Map<String, dynamic>> joinOrganization(String orgName) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/organizations/join'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${AuthService.token}",
        },
        body: jsonEncode({"orgName": orgName}),
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true}
          : {"success": false, "message": data['message'] ?? "Failed to join organization"};
    } catch (e) {
      return {"success": false, "message": "Could not connect to server."};
    }
  }
}
