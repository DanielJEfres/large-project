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

  // Get all events a user is attending
  static Future<Map<String, dynamic>> getUserEvents(String userId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/events/user/$userId'));
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true, "events": data is List ? data : []}
          : {"success": false, "events": []};
    } catch (e) {
      return {"success": false, "events": []};
    }
  }

  // Request a password reset email
  static Future<Map<String, dynamic>> requestPasswordReset(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/password-reset/request'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"ucfEmail": email}),
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true}
          : {"success": false, "message": data['message'] ?? "Failed to send reset email"};
    } catch (e) {
      return {"success": false, "message": "Could not connect to server."};
    }
  }

  // Create a new event
  static Future<Map<String, dynamic>> createEvent({
    required String title,
    required String location,
    required String description,
    required String startDate,
    String? endDate,
    required bool isRSO,
    required bool rsvpEnabled,
    required String createdBy,
    required List<String> tags,
    String? organizationId, // NEW
  }) async {
    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/events'),
      );
      request.headers['Authorization'] = 'Bearer ${AuthService.token}';
      request.fields['title'] = title;
      request.fields['location'] = location;
      request.fields['description'] = description;
      request.fields['startDate'] = startDate;
      request.fields['isRSO'] = isRSO.toString();
      request.fields['rsvpEnabled'] = rsvpEnabled.toString();
      request.fields['createdBy'] = createdBy;
      if (endDate != null) request.fields['endDate'] = endDate;
      if (organizationId != null) request.fields['organizationId'] = organizationId; // NEW
      request.fields['tags'] = jsonEncode(tags);

      final streamed = await request.send();
      final response = await http.Response.fromStream(streamed);
      final data = jsonDecode(response.body);
      return response.statusCode == 201 || response.statusCode == 200
          ? {'success': true, 'event': data['event'] ?? data['Event'] ?? data}
          : {'success': false, 'message': data['message'] ?? data['error'] ?? 'Failed to create event'};
    } catch (e) {
      return {'success': false, 'message': 'Could not connect to server.'};
    }
  }

  // Leave an organization by ID
  static Future<Map<String, dynamic>> leaveOrganization(String orgId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/organizations/leave'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AuthService.token}',
        },
        body: jsonEncode({'orgId': orgId}),
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {'success': true}
          : {'success': false, 'message': data['message'] ?? 'Failed to leave organization'};
    } catch (e) {
      return {'success': false, 'message': 'Could not connect to server.'};
    }
  }

  // Join an organization by ID
  static Future<Map<String, dynamic>> joinOrganization(String orgId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/organizations/join'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${AuthService.token}",
        },
        body: jsonEncode({"orgId": orgId}),
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {"success": true}
          : {"success": false, "message": data['message'] ?? "Failed to join organization"};
    } catch (e) {
      return {"success": false, "message": "Could not connect to server."};
    }
  }

  // PATCH /api/users/me — update profile fields
  static Future<Map<String, dynamic>> updateUserProfile(Map<String, String> fields) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/users/me'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AuthService.token}',
        },
        body: jsonEncode(fields),
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {'success': true, 'user': data['user']}
          : {'success': false, 'message': data['message'] ?? 'Failed to update profile'};
    } catch (e) {
      return {'success': false, 'message': 'Could not connect to server.'};
    }
  }

  // GET /api/users/me — fetch logged-in user's profile
  static Future<Map<String, dynamic>> getUserProfile() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/me'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AuthService.token}',
        },
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {'success': true, 'user': data['user']}
          : {'success': false, 'message': data['message'] ?? 'Failed to load profile'};
    } catch (e) {
      return {'success': false, 'message': 'Could not connect to server.'};
    }
  }

  // GET /api/users/me/organizations — fetch organizations user belongs to
  static Future<Map<String, dynamic>> getUserOrganizations() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/me/organizations'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AuthService.token}',
        },
      );

      print('getUserOrganizations status: ${response.statusCode}');
      print('getUserOrganizations body: ${response.body}');

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        final rawOrgs = List<Map<String, dynamic>>.from(data['organizations'] ?? []);

        final normalized = rawOrgs.map((org) {
          final map = Map<String, dynamic>.from(org);

          // Try to find the ID from any possible field
          map['_id'] ??= org['id'] ??
              org['organizationId'] ??
              (org['organization'] is Map ? org['organization']['_id'] : null);

          // If org is nested under 'organization', pull up name/logo/role too
          if (org['organization'] is Map) {
            final nested = org['organization'] as Map;
            map['name'] ??= nested['name'];
            map['logo'] ??= nested['logo'];
          }

          return map;
        }).toList();

        print('Normalized orgs: $normalized');
        return {'success': true, 'organizations': normalized};
      }

      return {'success': false, 'organizations': []};
    } catch (e) {
      print('getUserOrganizations ERROR: $e');
      return {'success': false, 'organizations': []};
    }
  }

  // PUT /api/events/:eventId — update an event (multipart, same as create)
  static Future<Map<String, dynamic>> updateEvent({
    required String eventId,
    required String title,
    required String location,
    required String description,
    required String startDate,
    String? endDate,
    required bool rsvpEnabled,
    required List<String> tags,
  }) async {
    try {
      final request = http.MultipartRequest(
        'PUT',
        Uri.parse('$baseUrl/events/$eventId'),
      );
      request.headers['Authorization'] = 'Bearer ${AuthService.token}';
      request.fields['title'] = title;
      request.fields['location'] = location;
      request.fields['description'] = description;
      request.fields['startDate'] = startDate;
      request.fields['rsvpEnabled'] = rsvpEnabled.toString();
      if (endDate != null) request.fields['endDate'] = endDate;
      request.fields['tags'] = jsonEncode(tags);

      final streamed = await request.send();
      final response = await http.Response.fromStream(streamed);
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {'success': true, 'event': data['Event'] ?? data['event'] ?? data}
          : {'success': false, 'message': data['message'] ?? 'Failed to update event'};
    } catch (e) {
      return {'success': false, 'message': 'Could not connect to server.'};
    }
  }
  // GET /api/events/created-by/:userId — fetch events created by the user
  static Future<Map<String, dynamic>> getCreatedEvents(String userId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/events/created-by/$userId'));
      final data = jsonDecode(response.body);
      final List events = data is List ? data : [];
      return {'success': true, 'events': events};
    } catch (e) {
      return {'success': false, 'events': []};
    }
  }

  // DELETE /api/events/:eventId — delete an event
  static Future<Map<String, dynamic>> deleteEvent(String eventId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/events/$eventId'),
        headers: {'Authorization': 'Bearer ${AuthService.token}'},
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 200
          ? {'success': true}
          : {'success': false, 'message': data['message'] ?? 'Failed to delete event'};
    } catch (e) {
      return {'success': false, 'message': 'Could not connect to server.'};
    }
  }

  // POST /api/organizations/create — create a new organization
  static Future<Map<String, dynamic>> createOrganization({
    required String name,
    required String description,
    required String createdBy,
    String? contactEmail,
    String? website,
    String? instagram,
    List<String> tags = const [],
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/organizations/create'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AuthService.token}',
        },
        body: jsonEncode({
          'name': name,
          'description': description,
          'createdBy': createdBy,
          if (contactEmail != null && contactEmail.isNotEmpty)
            'contactEmail': contactEmail,
          'socialLinks': {
            if (website != null && website.isNotEmpty) 'website': website,
            if (instagram != null && instagram.isNotEmpty) 'instagram': instagram,
          },
          if (tags.isNotEmpty) 'category': tags.first,
        }),
      );
      final data = jsonDecode(response.body);
      return response.statusCode == 201
          ? {'success': true, 'organization': data['Organization']}
          : {'success': false, 'message': data['message'] ?? 'Failed to create organization'};
    } catch (e) {
      return {'success': false, 'message': 'Could not connect to server.'};
    }
  }
}