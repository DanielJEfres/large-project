import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../utils/getAPI.dart';
import '../../utils/auth_service.dart';
import '../../theme/app_text_styles.dart';
import '../../theme/app_colors.dart';


// ─── Models ───────────────────────────────────────────────────────────────────

class SocialLinks {
  final String? website;
  final String? instagram;
  final String? discord;
  final String? linkedin;
  final String? linktree;

  const SocialLinks({
    this.website, this.instagram, this.discord, this.linkedin, this.linktree,
  });

  factory SocialLinks.fromJson(Map<String, dynamic> json) => SocialLinks(
    website: json['website'],
    instagram: json['instagram'],
    discord: json['discord'],
    linkedin: json['linkedin'],
    linktree: json['linktree'],
  );
}

class OrgDetail {
  final String id;
  final String name;
  final String description;
  final String? logo;
  final SocialLinks socialLinks;
  final List<String> memberIds;

  const OrgDetail({
    required this.id,
    required this.name,
    required this.description,
    this.logo,
    required this.socialLinks,
    required this.memberIds,
  });

  factory OrgDetail.fromJson(Map<String, dynamic> json) {
    final rawMembers = json['members'] as List<dynamic>? ?? [];
    final memberIds = rawMembers
        .map((m) => (m is Map ? m['userId']?.toString() : m?.toString()) ?? '')
        .where((id) => id.isNotEmpty)
        .toList();
    return OrgDetail(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      logo: json['logo']?.toString(),
      socialLinks: SocialLinks.fromJson(
          json['socialLinks'] is Map<String, dynamic> ? json['socialLinks'] : {}),
      memberIds: memberIds,
    );
  }
}

class UniversityEvent {
  final String id;
  final String title;
  final DateTime startDate;
  final DateTime? endDate;
  final String location;
  final bool isUpcoming;

  const UniversityEvent({
    required this.id,
    required this.title,
    required this.startDate,
    this.endDate,
    required this.location,
    this.isUpcoming = false,
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

class OrganizationScreen extends StatefulWidget {
  final String orgId;
  final int initialTabIndex; // 1. Add this variable

  // 2. Add it to the constructor with a default of 0
  const OrganizationScreen({
    super.key,
    this.orgId = '',
    this.initialTabIndex = 0,
  });

  @override
  State<OrganizationScreen> createState() => _OrganizationScreenState();
}

class _OrganizationScreenState extends State<OrganizationScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  OrgDetail? _org;
  List<UniversityEvent> _upcomingEvents = [];
  List<UniversityEvent> _pastEvents = [];
  bool _loading = true;
  bool _isMember = false;
  bool _isJoining = false;

  @override
  void initState() {
    super.initState();
    print('initialTabIndex = ${widget.initialTabIndex}');
    // Use widget.initialTabIndex to set the starting tab
    _tabController = TabController(
      length: 2,
      vsync: this,
      initialIndex: widget.initialTabIndex, // Add this line!
    )..addListener(() => setState(() {}));
    _fetchData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _joinOrg() async {
    if (_org == null || !AuthService.isLoggedIn) return;
    setState(() => _isJoining = true);
    final result = await getAPI.joinOrganization(_org!.id);
    if (!mounted) return;
    if (result['success'] == true) {
      setState(() {
        _isMember = true;
        _isJoining = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Joined ${_org!.name}!')),
      );
    } else {
      setState(() => _isJoining = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Failed to join organization')),
      );
    }
  }

  Future<void> _leaveOrg() async {
    if (_org == null) return;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Leave organization?'),
        content: Text('Are you sure you want to leave ${_org!.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Leave', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    setState(() => _isJoining = true);
    final result = await getAPI.leaveOrganization(_org!.id);
    if (!mounted) return;
    setState(() => _isJoining = false);
    if (result['success'] == true) {
      setState(() => _isMember = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Left ${_org!.name}')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Failed to leave organization')),
      );
    }
  }

  Future<void> _fetchData() async {
    setState(() => _loading = true);

    final result = await getAPI.getOrganizationById(widget.orgId);

    if (!mounted) return;

    if (result['success'] == true) {
      final org = OrgDetail.fromJson(result['organization']);

      // Split events into upcoming vs past by comparing to now
      final now = DateTime.now();
      final allEvents = (result['events'] as List).map((e) {
        final start = DateTime.tryParse(e['startDate'] ?? '') ?? now;
        final end = e['endDate'] != null
            ? DateTime.tryParse(e['endDate'])
            : null;
        return UniversityEvent(
          id: e['_id'] ?? '',
          title: e['title'] ?? 'Untitled',
          startDate: start,
          endDate: end,
          location: e['location'] ?? 'TBD',
          isUpcoming: start.isAfter(now),
        );
      }).toList();

      final currentUserId = AuthService.userId;
      final alreadyMember = currentUserId != null &&
          org.memberIds.contains(currentUserId);

      setState(() {
        _org = org;
        _upcomingEvents = allEvents.where((e) => e.isUpcoming).toList();
        _pastEvents = allEvents.where((e) => !e.isUpcoming).toList();
        _isMember = alreadyMember;
        _loading = false;
      });
    } else {
      setState(() => _loading = false);
      // Optionally show a snackbar
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not load organization.')),
        );
      }
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            _buildTopNav(),
            Expanded(
              child: LayoutBuilder(
                builder: (context, constraints) {
                  return SingleChildScrollView(
                    child: ConstrainedBox(
                      constraints: BoxConstraints(minHeight: constraints.maxHeight),
                      child: IntrinsicHeight(
                        child: Column(
                          children: [
                            _buildBannerHeader(),
                            _loading
                                ? _buildLoadingState()
                                : (_tabController.index == 0
                                ? _buildEventsTab()
                                : _buildAboutTab()),
                            const Spacer(),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  //BUTTON TO CREATE ORGANZIATION HAS TO GO WHERE THE USER IS RSO VERIFIED AND THE CORRECT PAGE
  Widget _buildTopNav() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
          Row(
            children: [
              GestureDetector(
                onTap: () => Navigator.pushNamed(context, '/createOrganization'),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.black,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.add, size: 16, color: AppColors.white),
                      SizedBox(width: 4),
                      Text('New Org', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.white)),
                    ],
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.reply_outlined, size: 24),
                onPressed: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }
//////////////////////////////////////////////////////////////////////
  Widget _buildBannerHeader() {
    return Stack(
      alignment: Alignment.topCenter,
      clipBehavior: Clip.none,
      children: [
        Container(height: 100, width: double.infinity, color: Colors.white),
        Container(
          margin: const EdgeInsets.only(top: 80),
          width: double.infinity,
          decoration: const BoxDecoration(color: Colors.white),
          padding: const EdgeInsets.fromLTRB(24, 48, 24, 0),
          child: Column(
            children: [
              _loading
                  ? const _PlaceholderBox(width: 150, height: 20)
                  : Text(
                      _org!.name,
                      style: AppTextStyles.h4.copyWith(color: AppColors.black),
                    ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: (_loading || _isJoining)
                      ? null
                      : () {
                          if (!AuthService.isLoggedIn) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('You need to be logged in to join an organization.')),
                            );
                            return;
                          }
                          _isMember ? _leaveOrg() : _joinOrg();
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isMember ? Colors.grey[300] : Colors.black,
                    foregroundColor: _isMember ? Colors.black54 : Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: _isJoining
                      ? const SizedBox(
                          height: 18,
                          width: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : Text(_isMember ? 'Joined' : 'Join'),
                ),
              ),
              const SizedBox(height: 12),
              TabBar(
                controller: _tabController,
                labelColor: Colors.black,
                indicatorColor: const Color(0xFFE8C547),
                tabs: const [Tab(text: 'Events'), Tab(text: 'About')],
              ),
            ],
          ),
        ),
        Positioned(
          top: 20,
          child: Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFFD9D9D9),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white, width: 4),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLoadingState() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: List.generate(3, (i) => const _EventPlaceholder()),
      ),
    );
  }

  Widget _buildEventsTab() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (_upcomingEvents.isNotEmpty) ...[
            const _SectionHeader(label: 'UPCOMING EVENTS'),
            const SizedBox(height: 16),
            ..._upcomingEvents.map((e) => _EventRow(event: e)),
            const SizedBox(height: 8),
          ],
          if (_pastEvents.isNotEmpty) ...[
            const _SectionHeader(label: 'PAST EVENTS'),
            const SizedBox(height: 16),
            ..._pastEvents.map((e) => _EventRow(event: e)),
          ],
        ],
      ),
    );
  }

  Widget _buildAboutTab() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Description', style: AppTextStyles.h4),
          const SizedBox(height: 8),
          _ExpandableDescription(text: _org!.description),
          const SizedBox(height: 24),
          Text('Websites', style: AppTextStyles.h4),
          const SizedBox(height: 12),
          _SocialLinksRow(links: _org!.socialLinks),
        ],
      ),
    );
  }
}

// ─── Sub-Widgets ─────────────────────────────────────────────────────────────

class _SectionHeader extends StatelessWidget {
  final String label;
  const _SectionHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(width: 3, height: 16, color: const Color(0xFFE8C547)),
        const SizedBox(width: 8),
        Text(label,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900)),
      ],
    );
  }
}

class _EventRow extends StatelessWidget {
  final UniversityEvent event;
  const _EventRow({required this.event});

  @override
  Widget build(BuildContext context) {
    final timeStr = event.endDate != null
        ? '${DateFormat('EEE, MMM d').format(event.startDate)} · '
        '${DateFormat('h:mm a').format(event.startDate)} – '
        '${DateFormat('h:mm a').format(event.endDate!)}'
        : DateFormat('EEE, MMM d').format(event.startDate);

    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, '/event/${event.id}'),
      child: Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Taller image placeholder to match the design
          Container(
            width: 80,
            height: 90,
            decoration: BoxDecoration(
              color: const Color(0xFFD9D9D9),
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(event.title,
                    style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(timeStr,
                    style:
                    const TextStyle(color: Colors.grey, fontSize: 12)),
                const SizedBox(height: 2),
                Text(event.location,
                    style:
                    const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    ),
    );
  }
}

class _SocialLinksRow extends StatelessWidget {
  final SocialLinks links;
  const _SocialLinksRow({required this.links});

  @override
  Widget build(BuildContext context) {
    // Show only icons for links that are non-null, matching the design
    final items = <_SocialIcon>[
      if (links.website != null)
        const _SocialIcon(icon: Icons.language),
      if (links.instagram != null)
        const _SocialIcon(icon: Icons.camera_alt_outlined),
      if (links.linkedin != null)
        const _SocialIcon(icon: Icons.work_outline),
      if (links.discord != null)
        const _SocialIcon(icon: Icons.headset_mic_outlined),
    ];

    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: items,
    );
  }
}

class _SocialIcon extends StatelessWidget {
  final IconData icon;
  const _SocialIcon({required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFF2F2F2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Icon(icon, size: 20),
    );
  }
}

class _ExpandableDescription extends StatefulWidget {
  final String text;
  const _ExpandableDescription({required this.text});

  @override
  State<_ExpandableDescription> createState() =>
      _ExpandableDescriptionState();
}

class _ExpandableDescriptionState extends State<_ExpandableDescription> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.text,
          maxLines: _expanded ? null : 3,
          overflow: _expanded ? TextOverflow.visible : TextOverflow.ellipsis,
          style: const TextStyle(fontSize: 14, height: 1.5),
        ),
        if (!_expanded)
          GestureDetector(
            onTap: () => setState(() => _expanded = true),
            child: const Text(
              '...more',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
          ),
      ],
    );
  }
}

// ─── Loading Placeholders ─────────────────────────────────────────────────────

class _PlaceholderBox extends StatelessWidget {
  final double width, height;
  const _PlaceholderBox({required this.width, required this.height});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }
}

class _EventPlaceholder extends StatelessWidget {
  const _EventPlaceholder();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 80,
            height: 90,
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(width: 16),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _PlaceholderBox(width: 120, height: 14),
              SizedBox(height: 8),
              _PlaceholderBox(width: 160, height: 10),
              SizedBox(height: 6),
              _PlaceholderBox(width: 100, height: 10),
            ],
          ),
        ],
      ),
    );
  }
}