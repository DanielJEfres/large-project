import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const _tokenKey = 'auth_token';
  static const _userIdKey = 'user_id';
  static const _firstNameKey = 'user_first_name';
  static const _lastNameKey = 'user_last_name';
  static const _emailKey = 'user_email';
  static const _onboardedKey = 'onboarding_done';

  static String? _token;
  static String? _userId;
  static String? _firstName;
  static String? _lastName;
  static String? _email;
  static bool _onboardingDone = false;

  static String? get token => _token;
  static String? get userId => _userId;
  static String? get firstName => _firstName;
  static String? get lastName => _lastName;
  static String? get email => _email;
  static bool get isLoggedIn => _token != null && _userId != null;
  static bool get onboardingDone => _onboardingDone;

  /// Call once at app startup to restore session from device storage.
  static Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(_tokenKey);
    _userId = prefs.getString(_userIdKey);
    _firstName = prefs.getString(_firstNameKey);
    _lastName = prefs.getString(_lastNameKey);
    _email = prefs.getString(_emailKey);
    _onboardingDone = prefs.getBool(_onboardedKey) ?? false;
  }

  /// Call after a successful login response.
  /// Pass [isNewUser: true] on first login to trigger the recommendations screen.
  static Future<void> saveSession({
    required String token,
    required String userId,
    required String firstName,
    required String lastName,
    required String email,
    bool isNewUser = false,
  }) async {
    _token = token;
    _userId = userId;
    _firstName = firstName;
    _lastName = lastName;
    _email = email;
    // Only reset onboarding flag for new users; keep it for returning users.
    if (isNewUser) _onboardingDone = false;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_userIdKey, userId);
    await prefs.setString(_firstNameKey, firstName);
    await prefs.setString(_lastNameKey, lastName);
    await prefs.setString(_emailKey, email);
    if (isNewUser) await prefs.setBool(_onboardedKey, false);
  }

  /// Mark recommendations as completed.
  static Future<void> completeOnboarding() async {
    _onboardingDone = true;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_onboardedKey, true);
  }

  /// Call on logout.
  static Future<void> clear() async {
    _token = null;
    _userId = null;
    _firstName = null;
    _lastName = null;
    _email = null;
    // Keep _onboardingDone so returning users skip it next time

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userIdKey);
    await prefs.remove(_firstNameKey);
    await prefs.remove(_lastNameKey);
    await prefs.remove(_emailKey);
  }
}
