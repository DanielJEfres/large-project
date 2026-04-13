import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const _tokenKey = 'auth_token';
  static const _userIdKey = 'user_id';
  static const _firstNameKey = 'user_first_name';
  static const _lastNameKey = 'user_last_name';
  static const _emailKey = 'user_email';

  static String? _token;
  static String? _userId;
  static String? _firstName;
  static String? _lastName;
  static String? _email;

  static String? get token => _token;
  static String? get userId => _userId;
  static String? get firstName => _firstName;
  static String? get lastName => _lastName;
  static String? get email => _email;
  static bool get isLoggedIn => _token != null && _userId != null;

  /// Call once at app startup to restore session from device storage.
  static Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(_tokenKey);
    _userId = prefs.getString(_userIdKey);
    _firstName = prefs.getString(_firstNameKey);
    _lastName = prefs.getString(_lastNameKey);
    _email = prefs.getString(_emailKey);
  }

  /// Call after a successful login response.
  static Future<void> saveSession({
    required String token,
    required String userId,
    required String firstName,
    required String lastName,
    required String email,
  }) async {
    _token = token;
    _userId = userId;
    _firstName = firstName;
    _lastName = lastName;
    _email = email;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_userIdKey, userId);
    await prefs.setString(_firstNameKey, firstName);
    await prefs.setString(_lastNameKey, lastName);
    await prefs.setString(_emailKey, email);
  }

  /// Call on logout.
  static Future<void> clear() async {
    _token = null;
    _userId = null;
    _firstName = null;
    _lastName = null;
    _email = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userIdKey);
    await prefs.remove(_firstNameKey);
    await prefs.remove(_lastNameKey);
    await prefs.remove(_emailKey);
  }
}
