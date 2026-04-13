import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../utils/getAPI.dart';
import '../utils/auth_service.dart';

class TicketsScreen extends StatefulWidget {
  final int initialTab;
  const TicketsScreen({super.key, this.initialTab = 0});

  @override
  State<TicketsScreen> createState() => _TicketsScreenState();
}

class _TicketsScreenState extends State<TicketsScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  List<Map<String, dynamic>> _upcoming = [];
  List<Map<String, dynamic>> _past = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this, initialIndex: widget.initialTab)
      ..addListener(() => setState(() {}));
    _fetchEvents();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _fetchEvents() async {
    if (!AuthService.isLoggedIn) {
      setState(() => _loading = false);
      return;
    }
    final result = await getAPI.getUserEvents(AuthService.userId!);
    if (!mounted) return;
    final events = List<Map<String, dynamic>>.from(result['events'] ?? []);
    final now = DateTime.now();
    setState(() {
      _upcoming = events.where((e) {
        try {
          return DateTime.parse(e['startDate'].toString()).isAfter(now);
        } catch (_) {
          return true;
        }
      }).toList();
      _past = events.where((e) {
        try {
          return DateTime.parse(e['startDate'].toString()).isBefore(now);
        } catch (_) {
          return false;
        }
      }).toList();
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Text('MY EVENTS', style: AppTextStyles.h2),
            ),
            const SizedBox(height: 16),
            // Tabs
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _buildTab('Upcoming', 0),
                  const SizedBox(width: 24),
                  _buildTab('Past', 1),
                ],
              ),
            ),
            const Divider(height: 1, thickness: 1, color: AppColors.inputFill),
            Expanded(
              child: !AuthService.isLoggedIn
                  ? _buildNotLoggedIn()
                  : _loading
                      ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                      : _tabController.index == 0
                          ? _buildEventList(_upcoming)
                          : _buildEventList(_past),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTab(String label, int index) {
    final active = _tabController.index == index;
    return GestureDetector(
      onTap: () => _tabController.animateTo(index),
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
            width: active ? 70 : 0,
            color: AppColors.primary,
          ),
        ],
      ),
    );
  }

  Widget _buildEventList(List<Map<String, dynamic>> events) {
    if (events.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'No Events yet',
              style: AppTextStyles.body.copyWith(
                  fontWeight: FontWeight.bold, color: AppColors.black),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/event/events'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.black,
                foregroundColor: AppColors.white,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24)),
              ),
              child: const Text('Browse Events',
                  style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
      itemCount: events.length,
      separatorBuilder: (_, _) => const Divider(color: AppColors.inputFill),
      itemBuilder: (_, i) => _EventRow(event: events[i]),
    );
  }

  Widget _buildNotLoggedIn() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('Log in to see your events',
              style: AppTextStyles.body.copyWith(color: AppColors.textMuted)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, '/login'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.black,
              foregroundColor: AppColors.white,
              padding:
                  const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24)),
            ),
            child: const Text('Log in'),
          ),
        ],
      ),
    );
  }
}

class _EventRow extends StatelessWidget {
  final Map<String, dynamic> event;
  const _EventRow({required this.event});

  String _formatDate(String? dateStr) {
    if (dateStr == null) return 'Date TBD';
    try {
      final dt = DateTime.parse(dateStr).toLocal();
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      final h1 = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
      final m1 = dt.minute.toString().padLeft(2, '0');
      final a1 = dt.hour >= 12 ? 'PM' : 'AM';
      return '${days[dt.weekday - 1]}, ${months[dt.month - 1]} ${dt.day} · $h1:$m1 $a1';
    } catch (_) {
      return 'Date TBD';
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = event['title']?.toString() ?? 'Event';
    final location = event['location']?.toString() ?? 'Location TBD';
    final flyer = event['flyer']?.toString();
    final eventId = event['_id']?.toString();
    final isRSO = event['isRSO'] == true;
    final orgName = isRSO
        ? (event['organizationName'] ?? event['organizationId'] ?? '').toString()
        : null;
    final createdById = AuthService.userId;
    final isCreator = event['createdBy']?.toString() == createdById ||
        (event['createdBy'] is Map &&
            event['createdBy']['_id']?.toString() == createdById);

    return GestureDetector(
      onTap: eventId != null
          ? () => Navigator.pushNamed(context, '/event/$eventId')
          : null,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: SizedBox(
                width: 72,
                height: 72,
                child: flyer != null
                    ? Image.network(flyer, fit: BoxFit.cover,
                        errorBuilder: (_, _, _) => _placeholder())
                    : _placeholder(),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (orgName != null && orgName.isNotEmpty)
                    Text(
                      orgName.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  Text(
                    title,
                    style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppColors.black),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatDate(event['startDate']?.toString()),
                    style: const TextStyle(
                        fontSize: 12, color: AppColors.textMuted),
                  ),
                  Text(
                    location,
                    style: const TextStyle(
                        fontSize: 12, color: AppColors.textMuted),
                  ),
                ],
              ),
            ),
            if (isCreator)
              Icon(Icons.edit_outlined, size: 18, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }

  Widget _placeholder() => Container(
        color: AppColors.inputFill,
        child: const Center(
          child: Icon(Icons.image_outlined,
              size: 24, color: AppColors.textMuted),
        ),
      );
}
