import 'package:flutter/material.dart';
import '../components/app_bottom_nav.dart';
import 'events/events.dart';
import 'organizations/searchOrg.dart';
import 'create_event.dart';
import 'tickets.dart';
import 'profile.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  // IndexedStack keeps all screens alive so scroll position is preserved
  final List<Widget> _screens = [
    EventsScreen(),
    SearchOrganization(),
    CreateEventScreen(),
    TicketsScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: AppBottomNav(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
      ),
    );
  }
}
