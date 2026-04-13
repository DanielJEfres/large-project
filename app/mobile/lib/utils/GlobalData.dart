class GlobalData {

  static int userId = -1;

  static String firstName = '';

  static String lastName = '';

  static String loginName = '';

  static String password = '';

  // Session fields — set on login, cleared on logout
  static String token = '';
  static String mongoUserId = '';

  static bool get isLoggedIn => token.isNotEmpty && mongoUserId.isNotEmpty;

}