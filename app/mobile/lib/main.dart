import 'package:flutter/material.dart';
import 'package:mobile/utils/auth_service.dart';
import 'package:mobile/screens/homeScreen.dart';
import 'package:mobile/screens/loginPage.dart';
import 'package:mobile/screens/signUpScreen.dart';
import 'package:mobile/screens/verificationScreen.dart';
import 'package:mobile/screens/recommendations.dart';
import 'package:mobile/screens/RsoStudent.dart';
import 'package:mobile/screens/shell.dart';
import 'package:mobile/screens/events/event_detail.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AuthService.init();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => HomeScreen(),
        '/login': (context) => LoginScreen(),
        '/signup': (context) => SignUpScreen(),
        '/verification': (context) => VerificationScreen(),
        '/recommendations': (context) => Recommendations(),
        '/RsoStudent': (context) => RsoStudent(),
        '/events': (context) => const MainShell(),
        '/event/events': (context) => const MainShell(),
      },
      onGenerateRoute: (settings) {
        // /event/:id  →  EventDetailScreen
        final uri = Uri.parse(settings.name ?? '');
        if (uri.pathSegments.length == 2 && uri.pathSegments[0] == 'event') {
          final eventId = uri.pathSegments[1];
          return MaterialPageRoute(
            builder: (_) => EventDetailScreen(eventId: eventId),
            settings: settings,
          );
        }
        return null;
      },
    );
  }
}
