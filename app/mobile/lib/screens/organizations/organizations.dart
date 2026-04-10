import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

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

class Organization {
  final String id;
  final String name;
  final String description;
  final SocialLinks socialLinks;

  const Organization({
    required this.id, required this.name, required this.description, required this.socialLinks,
  });

  factory Organization.fromJson(Map<String, dynamic> json) => Organization(
    id: json['_id'] ?? '',
    name: json['name'] ?? '',
    description: json['description'] ?? '',
    socialLinks: SocialLinks.fromJson(json['socialLinks'] ?? {}),
  );
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
  const OrganizationScreen({super.key, this.orgId = ''});

  @override
  State<OrganizationScreen> createState() => _OrganizationScreenState();
}

class _OrganizationScreenState extends State<OrganizationScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  Organization? _org;
  List<UniversityEvent> _upcomingEvents = [];
  List<UniversityEvent> _pastEvents = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this)
      ..addListener(() => setState(() {}));
    _fetchData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _fetchData() async {
    await Future.delayed(const Duration(seconds: 2));
    if (!mounted) return;

    setState(() {
      _org = const Organization(
        id: '1',
        name: 'Organization Title',
        description:
        'This organization is dedicated to promoting civic engagement and education on various social topics to the UCF student body through educational and service projects.',
        socialLinks: SocialLinks(
          website: 'https://example.com',
          instagram: 'https://instagram.com',
          linkedin: 'https://linkedin.com',
          discord: 'https://discord.com',
        ),
      );
      _upcomingEvents = [
        UniversityEvent(
          id: 'e1',
          title: 'Event Title',
          startDate: DateTime(2025, 3, 23, 16),
          endDate: DateTime(2025, 3, 23, 22),
          location: 'BA221, Business Administration 1',
          isUpcoming: true,
        ),
        UniversityEvent(
          id: 'e2',
          title: 'Event Title',
          startDate: DateTime(2025, 3, 23, 16),
          endDate: DateTime(2025, 3, 23, 22),
          location: 'BA221, Business Administration 1',
          isUpcoming: true,
        ),
      ];
      _pastEvents = [
        UniversityEvent(
          id: 'e3',
          title: 'Event Title',
          startDate: DateTime(2025, 3, 23, 16),
          endDate: DateTime(2025, 3, 23, 22),
          location: 'BA221, Business Administration 1',
        ),
      ];
      _loading = false;
    });
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
          IconButton(
            icon: const Icon(Icons.reply_outlined, size: 24),
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildBannerHeader() {
    return Stack(
      alignment: Alignment.topCenter,
      clipBehavior: Clip.none,
      children: [
        Container(height: 100, width: double.infinity, color: const Color(0xFFF2F2F2)),
        Container(
          margin: const EdgeInsets.only(top: 80),
          width: double.infinity,
          decoration: const BoxDecoration(
            color: Colors.white,
            //borderRadius: BorderRadius.only(
             // topLeft: Radius.circular(32),
              //topRight: Radius.circular(32),
            //),
          ),
          padding: const EdgeInsets.fromLTRB(24, 60, 24, 0),
          child: Column(
            children: [
              _loading
                  ? const _PlaceholderBox(width: 150, height: 20)
                  : Text(
                _org!.name,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('Join'),
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
          const Text('Description', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          _ExpandableDescription(text: _org!.description),
          const SizedBox(height: 24),
          const Text('Websites', style: TextStyle(fontWeight: FontWeight.bold)),
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

    return Padding(
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