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
  final _ticketsKey = GlobalKey<TicketsScreenState>();
  final _profileKey = GlobalKey<ProfileScreenState>();

  late final List<Widget> _screens = [
    EventsScreen(),
    SearchOrganization(),
    CreateEventScreen(),
    TicketsScreen(key: _ticketsKey),
    ProfileScreen(key: _profileKey),
  ];

  void _onTabTapped(int i) {
    if (i == 3) _ticketsKey.currentState?.fetchData();
    if (i == 4) _profileKey.currentState?.fetchData();
    setState(() => _currentIndex = i);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: AppBottomNav(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
      ),
    );
  }
}
