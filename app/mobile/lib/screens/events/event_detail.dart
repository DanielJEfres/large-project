import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';
import '../../components/app_button.dart';
import '../../utils/getAPI.dart';
import '../../utils/auth_service.dart';

class EventDetailScreen extends StatefulWidget {
  final String eventId;

  const EventDetailScreen({super.key, required this.eventId});

  @override
  State<EventDetailScreen> createState() => _EventDetailScreenState();
}

class _EventDetailScreenState extends State<EventDetailScreen> {
  Map<String, dynamic>? _event;
  Map<String, dynamic>? _org;
  bool _loading = true;
  bool _descExpanded = false;
  bool _isAttending = false;

  @override
  void initState() {
    super.initState();
    _fetchEvent();
  }

  Future<void> _fetchEvent() async {
    final result = await getAPI.getEvent(widget.eventId);
    if (!mounted) return;
    final event = result['event'] as Map<String, dynamic>?;
    // Check if the current user is already in the attendees list
    bool alreadyAttending = false;
    if (event != null && AuthService.userId != null) {
      final attendees = (event['attendees'] as List<dynamic>?) ?? [];
      alreadyAttending = attendees.any((a) => a.toString() == AuthService.userId);
    }
    setState(() {
      _event = event;
      _isAttending = alreadyAttending;
      _loading = false;
    });
    if (event != null && event['organizationId'] != null) {
      _fetchOrg(event['organizationId'].toString());
    }
  }

  Future<void> _fetchOrg(String orgId) async {
    final result = await getAPI.getOrganization(orgId);
    if (!mounted) return;
    setState(() => _org = result['organization'] as Map<String, dynamic>?);
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return 'Date TBD';
    try {
      final dt = DateTime.parse(dateStr).toLocal();
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      return '${days[dt.weekday - 1]}, ${months[dt.month - 1]} ${dt.day}, ${dt.year}';
    } catch (_) {
      return 'Date TBD';
    }
  }

  String _formatTime(String? dateStr) {
    if (dateStr == null) return '';
    try {
      final dt = DateTime.parse(dateStr).toLocal();
      final hour = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
      final min = dt.minute.toString().padLeft(2, '0');
      final ampm = dt.hour >= 12 ? 'PM' : 'AM';
      return '$hour:$min $ampm';
    } catch (_) {
      return '';
    }
  }

  String _timeRange() {
    final start = _formatTime(_event?['startDate']?.toString());
    final end = _formatTime(_event?['endDate']?.toString());
    if (end.isEmpty) return start;
    return '$start - $end EST';
  }

  bool get _isPastEvent {
    if (_event?['startDate'] == null) return false;
    try {
      return DateTime.parse(_event!['startDate'].toString()).isBefore(DateTime.now());
    } catch (_) {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        backgroundColor: AppColors.white,
        body: const Center(child: CircularProgressIndicator(color: AppColors.primary)),
      );
    }

    if (_event == null) {
      return Scaffold(
        backgroundColor: AppColors.white,
        appBar: AppBar(
          backgroundColor: AppColors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.black, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: const Center(child: Text('Event not found.')),
      );
    }

    final event = _event!;
    final orgName = _org?['name']?.toString() ??
        (event['isRSO'] == true
            ? 'Organization'
            : '${event['createdBy']?['firstName'] ?? ''} ${event['createdBy']?['lastName'] ?? ''}'.trim());
    final title = event['title']?.toString() ?? 'Event';
    final description = event['description']?.toString() ?? '';
    final location = event['location']?.toString() ?? 'Location TBD';
    final flyer = event['flyer']?.toString();
    final tags = (event['tags'] as List<dynamic>?) ?? [];
    final attendees = (event['attendees'] as List<dynamic>?) ?? [];
    final rsvpEnabled = event['rsvpEnabled'] == true;
    final orgDescription = _org?['description']?.toString() ?? '';

    return Scaffold(
      backgroundColor: AppColors.white,
      body: Stack(
        children: [
          // Scrollable content
          CustomScrollView(
            slivers: [
              // App bar
              SliverAppBar(
                backgroundColor: AppColors.white,
                elevation: 0,
                pinned: false,
                leading: Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: IconButton(
                    icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.black, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                ),
                actions: [
                  Padding(
                    padding: const EdgeInsets.only(top: 8, right: 8),
                    child: IconButton(
                      icon: const Icon(Icons.ios_share_outlined, color: AppColors.black, size: 22),
                      onPressed: () {},
                    ),
                  ),
                ],
              ),

              SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Flyer image
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: AspectRatio(
                          aspectRatio: 4 / 3,
                          child: flyer != null
                              ? Image.network(
                                  flyer,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, _, _) => _flyerPlaceholder(),
                                )
                              : _flyerPlaceholder(),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Org name + title
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            orgName.toUpperCase(),
                            style: GoogleFonts.bebasNeue(
                              fontSize: 14,
                              color: AppColors.primary,
                              letterSpacing: 1,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            title,
                            style: const TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                              color: AppColors.black,
                              height: 1.2,
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Date
                          _infoRow(
                            Icons.calendar_today_outlined,
                            _formatDate(event['startDate']?.toString()),
                          ),
                          const SizedBox(height: 8),

                          // Time
                          if (_timeRange().isNotEmpty)
                            _infoRow(Icons.access_time_outlined, _timeRange()),

                          const SizedBox(height: 8),

                          // Location
                          _infoRow(Icons.location_on_outlined, location),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),
                    const Divider(color: AppColors.inputFill, height: 1),
                    const SizedBox(height: 20),

                    // Details / description
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Details', style: AppTextStyles.body.copyWith(fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          if (description.isNotEmpty) ...[
                            Text(
                              description,
                              style: AppTextStyles.body.copyWith(color: AppColors.textSecondary, height: 1.5),
                              maxLines: _descExpanded ? null : 4,
                              overflow: _descExpanded ? TextOverflow.visible : TextOverflow.ellipsis,
                            ),
                            if (description.length > 200)
                              GestureDetector(
                                onTap: () => setState(() => _descExpanded = !_descExpanded),
                                child: Padding(
                                  padding: const EdgeInsets.only(top: 4),
                                  child: Text(
                                    _descExpanded ? 'less' : '... more',
                                    style: AppTextStyles.body.copyWith(
                                      color: AppColors.textMuted,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                          ] else
                            Text(
                              'No description provided.',
                              style: AppTextStyles.body.copyWith(color: AppColors.textMuted),
                            ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),
                    const Divider(color: AppColors.inputFill, height: 1),
                    const SizedBox(height: 20),

                    // Who's Interested
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Who's Interested",
                                style: AppTextStyles.body.copyWith(fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${attendees.length} ${attendees.length == 1 ? 'person is' : 'others are'} going',
                                style: AppTextStyles.caption,
                              ),
                            ],
                          ),
                          TextButton(
                            onPressed: () {},
                            child: const Text(
                              'View all',
                              style: TextStyle(color: AppColors.black, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    // Attendee avatar row
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: _buildAttendeeAvatars(attendees),
                    ),

                    const SizedBox(height: 24),
                    const Divider(color: AppColors.inputFill, height: 1),
                    const SizedBox(height: 20),

                    // Event Tags
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Event Tags', style: AppTextStyles.body.copyWith(fontWeight: FontWeight.bold)),
                          const SizedBox(height: 10),
                          tags.isEmpty
                              ? Text('No tags', style: AppTextStyles.caption)
                              : Wrap(
                                  spacing: 8,
                                  runSpacing: 8,
                                  children: tags.map((tag) {
                                    final name = (tag['name'] ?? tag.toString()).toString();
                                    return Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                                      decoration: BoxDecoration(
                                        color: AppColors.primary,
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(
                                        name,
                                        style: const TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: AppColors.white,
                                        ),
                                      ),
                                    );
                                  }).toList(),
                                ),
                        ],
                      ),
                    ),

                    if (event['isRSO'] == true) ...[
                    const SizedBox(height: 24),
                    const Divider(color: AppColors.inputFill, height: 1),
                    const SizedBox(height: 20),

                    // Org card
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Container(
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        clipBehavior: Clip.hardEdge,
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Org image placeholder
                            Container(
                              width: 80,
                              height: 110,
                              color: AppColors.inputFill,
                            ),
                            Expanded(
                              child: Padding(
                                padding: const EdgeInsets.all(14),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      orgName.toUpperCase(),
                                      style: GoogleFonts.bebasNeue(
                                        fontSize: 16,
                                        color: AppColors.primary,
                                        letterSpacing: 0.8,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      orgDescription.isNotEmpty
                                          ? orgDescription
                                          : 'No description available.',
                                      style: AppTextStyles.caption,
                                      maxLines: 3,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 12),
                                    Row(
                                      children: [
                                        Expanded(
                                          child: OutlinedButton(
                                            onPressed: () {},
                                            style: OutlinedButton.styleFrom(
                                              side: const BorderSide(color: AppColors.black),
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(20),
                                              ),
                                              padding: const EdgeInsets.symmetric(vertical: 8),
                                            ),
                                            child: const Text(
                                              'Join',
                                              style: TextStyle(
                                                color: AppColors.black,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 13,
                                              ),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: OutlinedButton(
                                            onPressed: () {},
                                            style: OutlinedButton.styleFrom(
                                              side: const BorderSide(color: AppColors.black),
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(20),
                                              ),
                                              padding: const EdgeInsets.symmetric(vertical: 8),
                                            ),
                                            child: const Text(
                                              'More Events',
                                              style: TextStyle(
                                                color: AppColors.black,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 13,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    ], // end if (isRSO)

                    // Bottom padding so content isn't hidden behind button
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ],
          ),

          // Sticky Register button at bottom
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
              decoration: BoxDecoration(
                color: AppColors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 12,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: AppButton(
                label: _isPastEvent
                    ? 'Event Ended'
                    : !rsvpEnabled
                        ? 'No RSVP Required'
                        : _isAttending
                            ? 'Unregister'
                            : 'Register',
                onPressed: _isPastEvent || !rsvpEnabled ? null : _handleRSVP,
                width: double.infinity,
                backgroundColor: _isPastEvent
                    ? AppColors.textMuted
                    : _isAttending
                        ? AppColors.primary
                        : AppColors.black,
                foregroundColor: AppColors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _handleRSVP() async {
    if (!AuthService.isLoggedIn) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please log in to RSVP.')),
      );
      return;
    }

    final eventId = _event!['_id'].toString();
    final result = _isAttending
        ? await getAPI.unattendEvent(eventId)
        : await getAPI.attendEvent(eventId);

    if (!mounted) return;
    if (result['success'] == true) {
      setState(() => _isAttending = !_isAttending);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Something went wrong.')),
      );
    }
  }

  Widget _infoRow(IconData icon, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: AppColors.textMuted),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
          ),
        ),
      ],
    );
  }

  Widget _buildAttendeeAvatars(List<dynamic> attendees) {
    const maxShown = 5;
    final shown = attendees.length > maxShown ? maxShown : attendees.length;
    final extra = attendees.length - shown;

    return Row(
      children: [
        ...List.generate(shown, (i) => Padding(
          padding: const EdgeInsets.only(right: 6),
          child: CircleAvatar(
            radius: 18,
            backgroundColor: AppColors.inputFill,
            child: const Icon(Icons.person, size: 18, color: AppColors.textMuted),
          ),
        )),
        if (extra > 0)
          CircleAvatar(
            radius: 18,
            backgroundColor: AppColors.inputFill,
            child: Text(
              '+$extra',
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textMuted),
            ),
          ),
        if (attendees.isEmpty)
          Text('No attendees yet', style: AppTextStyles.caption),
      ],
    );
  }

  Widget _flyerPlaceholder() {
    return Container(
      color: AppColors.inputFill,
      child: const Center(
        child: Icon(Icons.image_outlined, size: 48, color: AppColors.textMuted),
      ),
    );
  }
}
