import 'package:flutter/material.dart';
import 'package:mobile/screens/homeScreen.dart';
import 'package:mobile/screens/loginPage.dart';
import 'package:mobile/screens/signUpScreen.dart';
import 'package:mobile/screens/verificationScreen.dart';
import 'package:mobile/screens/recommendations.dart';
import 'package:mobile/screens/events/events.dart';
import 'package:mobile/screens/organizations/organizations.dart';
import 'package:mobile/screens/RsoStudent.dart';
import 'package:mobile/screens/organizations/searchOrg.dart';

class Routes {
  static const String LOGIN = '/';
  static const String SIGNUP = '/signup';
  static const String HOME = '/homeScreen';
  static const String VERIFICATION = '/verification';
  static const String EVENTS = '/events';
  static const String RECOMMENDATIONS = '/recommendations';
  static const String RSOSTUDENT = '/RsoStudent';
  //static const String ORGANIZATIONPAGE = '/organizations';
  //static const String SEARCHORGANIZATION = '/searchOrg';

  static Map<String, WidgetBuilder> get getRoutes => {
    LOGIN: (context) => LoginScreen(),
    SIGNUP: (context) => SignUpScreen(),
    HOME: (context) => HomeScreen(),
    VERIFICATION: (context) => VerificationScreen(),
    RECOMMENDATIONS: (context)=> Recommendations(),
    EVENTS: (context)=> EventsScreen(),
    RSOSTUDENT: (context)=> RsoStudent(),
    //ORGANIZATIONSCREEN: (context)=> OrganizationScreen(),
    //SEARCHORGANIZATION:(context)=> SearchOrganization(),
  };
}
