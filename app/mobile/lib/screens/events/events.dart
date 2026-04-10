import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';
import '../../utils/getAPI.dart';
import '../../components/event_card.dart';

// Placeholder events shown while API loads (or when API is unreachable)
final List<Map<String, dynamic>> _placeholderEvents = [
  {
    'organizationName': 'UCF SGA',
    'title': 'Spring Hackathon 2026',
    'location': 'Student Union Hall',
    'startDate': '2026-04-20T10:00:00Z',
    'isRSO': true,
    'flyer': null,
  },
  {
    'organizationName': 'ACM UCF',
    'title': 'Figma & UI/UX Workshop',
    'location': 'HEC 101',
    'startDate': '2026-04-22T16:00:00Z',
    'isRSO': true,
    'flyer': null,
  },
  {
    'organizationName': 'UCF Music Club',
    'title': 'Open Mic Night',
    'location': 'Student Union Pegasus Ballroom',
    'startDate': '2026-04-25T19:00:00Z',
    'isRSO': true,
    'flyer': null,
  },
  {
    'organizationName': 'Pre-Med Society',
    'title': 'MCAT Study Session',
    'location': 'Health Sciences Campus',
    'startDate': '2026-04-27T14:00:00Z',
    'isRSO': true,
    'flyer': null,
  },
  {
    'organizationName': 'Knight Hacks',
    'title': 'Build Night — Mobile Apps',
    'location': 'Engineering 2 Room 203',
    'startDate': '2026-04-28T18:00:00Z',
    'isRSO': true,
    'flyer': null,
  },
  {
    'organizationName': 'UCF Dance Marathon',
    'title': 'Fundraiser Kickoff Event',
    'location': 'Recreation & Wellness Center',
    'startDate': '2026-05-01T11:00:00Z',
    'isRSO': false,
    'flyer': null,
  },
  {
    'organizationName': 'Sofia Flores',
    'title': 'Study Group — COP3502',
    'location': 'Library Room 214',
    'startDate': '2026-04-21T13:00:00Z',
    'isRSO': false,
    'flyer': null,
  },
];

class EventsScreen extends StatefulWidget {
  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  String _activeTab = 'RSO';
  String _selectedCategory = 'All';
  String _searchQuery = '';
  bool _loading = false;

  List<Map<String, dynamic>> _upcomingEvents = [];
  List<Map<String, dynamic>> _trendingEvents = [];

  final List<String> _categories = [
    'All',
    'Music',
    'Humanities',
    'Arts & Media',
    'Science',
    'Business',
    'Engineering',
  ];

  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Show placeholders immediately
    _upcomingEvents = List.from(_placeholderEvents);
    _trendingEvents = List.from(_placeholderEvents.reversed);
    _fetchEvents();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchEvents() async {
    final upcomingResult = await getAPI.getUpcomingEvents();
    final trendingResult = await getAPI.getTrendingEvents();
    if (!mounted) return;
    final upcoming = List<Map<String, dynamic>>.from(
      upcomingResult['events'] ?? [],
    );
    final trending = List<Map<String, dynamic>>.from(
      trendingResult['events'] ?? [],
    );
    setState(() {
      if (upcoming.isNotEmpty) _upcomingEvents = upcoming;
      if (trending.isNotEmpty) _trendingEvents = trending;
      _loading = false;
    });
  }

  List<Map<String, dynamic>> get _forYou {
    return _upcomingEvents
        .where(
          (e) => _activeTab == 'RSO' ? e['isRSO'] == true : e['isRSO'] != true,
        )
        .toList();
  }

  List<Map<String, dynamic>> get _trending {
    return _trendingEvents
        .where(
          (e) => _activeTab == 'RSO' ? e['isRSO'] == true : e['isRSO'] != true,
        )
        .toList();
  }

  List<Map<String, dynamic>> get _upcoming {
    return _upcomingEvents
        .where(
          (e) => _activeTab == 'RSO' ? e['isRSO'] == true : e['isRSO'] != true,
        )
        .toList();
  }

  List<Map<String, dynamic>> get _searchResults {
    return _upcomingEvents.where((e) {
      final title = (e['title'] ?? '').toString().toLowerCase();
      final desc = (e['description'] ?? '').toString().toLowerCase();
      final org = (e['organizationName'] ?? '').toString().toLowerCase();
      return title.contains(_searchQuery.toLowerCase()) ||
          desc.contains(_searchQuery.toLowerCase()) ||
          org.contains(_searchQuery.toLowerCase());
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Text('EVENTS', style: AppTextStyles.h2),
            ),
            // Search bar
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: AppColors.inputFill,
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: TextField(
                        controller: _searchController,
                        onChanged: (v) => setState(() => _searchQuery = v),
                        decoration: const InputDecoration(
                          hintText: 'Search Events',
                          hintStyle: TextStyle(
                            color: AppColors.textMuted,
                            fontSize: 14,
                          ),
                          prefixIcon: Icon(
                            Icons.search,
                            color: AppColors.textMuted,
                            size: 20,
                          ),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 14),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.inputFill,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: const Icon(Icons.tune, color: AppColors.textMuted),
                  ),
                ],
              ),
            ),
            // Category chips
            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: SizedBox(
                height: 36,
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  scrollDirection: Axis.horizontal,
                  itemCount: _categories.length,
                  separatorBuilder: (_, _) => const SizedBox(width: 8),
                  itemBuilder: (_, i) {
                    final cat = _categories[i];
                    final selected = cat == _selectedCategory;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedCategory = cat),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: selected
                              ? AppColors.primary
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: selected
                                ? AppColors.primary
                                : AppColors.textMuted.withValues(alpha: 0.35),
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          cat,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: selected
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color: selected
                                ? AppColors.white
                                : AppColors.textSecondary,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
            // Tabs
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
              child: Row(
                children: [
                  _buildTab('RSO Events', 'RSO'),
                  const SizedBox(width: 24),
                  _buildTab('Student Events', 'Student'),
                ],
              ),
            ),
            const Divider(height: 1, thickness: 1, color: AppColors.inputFill),
            // Body
            Expanded(
              child: _searchQuery.isNotEmpty
                  ? _buildSearchResults()
                  : _buildSections(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTab(String label, String value) {
    final active = _activeTab == value;
    return GestureDetector(
      onTap: () => setState(() => _activeTab = value),
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 15,
              color: active ? AppColors.black : AppColors.textMuted,
            ),
          ),
          const SizedBox(height: 8),
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            height: 2,
            width: active ? 90 : 0,
            color: AppColors.primary,
          ),
        ],
      ),
    );
  }

  Widget _buildSections() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          _buildSection('FOR YOU', _loading ? [] : _forYou),
          const SizedBox(height: 28),
          _buildSection('TRENDING', _loading ? [] : _trending),
          const SizedBox(height: 28),
          _buildSection('UPCOMING EVENTS', _loading ? [] : _upcoming),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSection(String title, List<Map<String, dynamic>> events) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(title, style: AppTextStyles.h4),
        ),
        const SizedBox(height: 14),
        SizedBox(
          height: 250,
          child: _loading
              ? _buildSkeletonRow()
              : events.isEmpty
              ? const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20, vertical: 40),
                  child: Text(
                    'No events found',
                    style: TextStyle(color: AppColors.textMuted),
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  scrollDirection: Axis.horizontal,
                  itemCount: events.length,
                  separatorBuilder: (_, _) => const SizedBox(width: 12),
                  itemBuilder: (_, i) => EventCard(event: events[i]),
                ),
        ),
      ],
    );
  }

  Widget _buildSkeletonRow() {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      scrollDirection: Axis.horizontal,
      itemCount: 3,
      separatorBuilder: (_, _) => const SizedBox(width: 12),
      itemBuilder: (_, _) => Container(
        width: 178,
        decoration: BoxDecoration(
          color: AppColors.inputFill,
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  Widget _buildSearchResults() {
    final results = _searchResults;
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('SEARCH RESULTS', style: AppTextStyles.h4),
          const SizedBox(height: 14),
          results.isEmpty
              ? const Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: Center(
                    child: Text(
                      'No events found',
                      style: TextStyle(color: AppColors.textMuted),
                    ),
                  ),
                )
              : GridView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  shrinkWrap: true,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.72,
                  ),
                  itemCount: results.length,
                  itemBuilder: (_, i) => EventCard(event: results[i]),
                ),
        ],
      ),
    );
  }
}
