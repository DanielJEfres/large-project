import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../utils/getAPI.dart';
import '../utils/auth_service.dart';

class TicketsScreen extends StatefulWidget {
  final int initialTab;
  const TicketsScreen({super.key, this.initialTab = 0});

  @override
  State<TicketsScreen> createState() => TicketsScreenState();
}

class TicketsScreenState extends State<TicketsScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  List<Map<String, dynamic>> _upcoming = [];
  List<Map<String, dynamic>> _past = [];
  List<Map<String, dynamic>> _created = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabController =
        TabController(length: 3, vsync: this, initialIndex: widget.initialTab)
          ..addListener(() => setState(() {}));
    fetchData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> fetchData() async {
    if (!AuthService.isLoggedIn) {
      if (mounted) setState(() => _loading = false);
      return;
    }
    if (mounted) setState(() => _loading = true);

    final results = await Future.wait([
      getAPI.getUserEvents(AuthService.userId!),
      getAPI.getCreatedEvents(AuthService.userId!),
    ]);
    if (!mounted) return;

    final attended =
        List<Map<String, dynamic>>.from(results[0]['events'] ?? []);
    final created =
        List<Map<String, dynamic>>.from(results[1]['events'] ?? []);

    final now = DateTime.now();
    setState(() {
      _upcoming = attended.where((e) {
        try {
          return DateTime.parse(e['startDate'].toString()).isAfter(now);
        } catch (_) {
          return true;
        }
      }).toList();
      _past = attended.where((e) {
        try {
          return DateTime.parse(e['startDate'].toString()).isBefore(now);
        } catch (_) {
          return false;
        }
      }).toList();
      _created = created;
      _loading = false;
    });
  }

  void _openEditModal(Map<String, dynamic> event) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => _EditEventSheet(
        event: event,
        onSaved: (updated) {
          setState(() {
            final idx =
                _created.indexWhere((e) => e['_id'] == event['_id']);
            if (idx != -1) _created[idx] = updated;
          });
        },
        onDeleted: () {
          setState(
              () => _created.removeWhere((e) => e['_id'] == event['_id']));
        },
      ),
    );
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
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _buildTab('Upcoming', 0, 80),
                  const SizedBox(width: 24),
                  _buildTab('Past', 1, 40),
                  const SizedBox(width: 24),
                  _buildTab('Created', 2, 66),
                ],
              ),
            ),
            const Divider(height: 1, thickness: 1, color: AppColors.inputFill),
            Expanded(
              child: !AuthService.isLoggedIn
                  ? _buildNotLoggedIn()
                  : _loading
                      ? const Center(
                          child: CircularProgressIndicator(
                              color: AppColors.primary))
                      : IndexedStack(
                          index: _tabController.index,
                          children: [
                            _buildAttendedList(_upcoming),
                            _buildAttendedList(_past),
                            _buildCreatedList(),
                          ],
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTab(String label, int index, double activeWidth) {
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
            width: active ? activeWidth : 0,
            color: AppColors.primary,
          ),
        ],
      ),
    );
  }

  Widget _buildAttendedList(List<Map<String, dynamic>> events) {
    if (events.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('No Events yet',
                style: AppTextStyles.body
                    .copyWith(fontWeight: FontWeight.bold, color: AppColors.black)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () =>
                  Navigator.pushNamed(context, '/event/events'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.black,
                foregroundColor: AppColors.white,
                padding: const EdgeInsets.symmetric(
                    horizontal: 32, vertical: 14),
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
      separatorBuilder: (_, _) =>
          const Divider(color: AppColors.inputFill),
      itemBuilder: (_, i) => _EventRow(event: events[i]),
    );
  }

  Widget _buildCreatedList() {
    if (_created.isEmpty) {
      return Center(
        child: Text('No events created yet.',
            style:
                AppTextStyles.body.copyWith(color: AppColors.textMuted)),
      );
    }
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
      itemCount: _created.length,
      separatorBuilder: (_, _) =>
          const Divider(color: AppColors.inputFill),
      itemBuilder: (_, i) => _EventRow(
        event: _created[i],
        showEditIcon: true,
        onEditTap: () => _openEditModal(_created[i]),
      ),
    );
  }

  Widget _buildNotLoggedIn() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('Log in to see your events',
              style:
                  AppTextStyles.body.copyWith(color: AppColors.textMuted)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, '/login'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.black,
              foregroundColor: AppColors.white,
              padding: const EdgeInsets.symmetric(
                  horizontal: 32, vertical: 14),
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

// ─── Event Row ───────────────────────────────────────────────────────────────

class _EventRow extends StatelessWidget {
  final Map<String, dynamic> event;
  final bool showEditIcon;
  final VoidCallback? onEditTap;

  const _EventRow({
    required this.event,
    this.showEditIcon = false,
    this.onEditTap,
  });

  String _formatDate(String? dateStr) {
    if (dateStr == null) return 'Date TBD';
    try {
      final dt = DateTime.parse(dateStr).toLocal();
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      final h = dt.hour > 12
          ? dt.hour - 12
          : (dt.hour == 0 ? 12 : dt.hour);
      final m = dt.minute.toString().padLeft(2, '0');
      final a = dt.hour >= 12 ? 'PM' : 'AM';
      return '${days[dt.weekday - 1]}, ${months[dt.month - 1]} ${dt.day} · $h:$m $a';
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
        ? (event['organizationName'] ?? event['organizationId'] ?? '')
            .toString()
        : null;

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
                    ? Image.network(flyer,
                        fit: BoxFit.cover,
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
            if (showEditIcon)
              GestureDetector(
                onTap: onEditTap,
                behavior: HitTestBehavior.opaque,
                child: const Padding(
                  padding: EdgeInsets.all(8),
                  child: Icon(Icons.edit_outlined,
                      size: 20, color: AppColors.textMuted),
                ),
              ),
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

// ─── Edit Event Sheet ─────────────────────────────────────────────────────────

class _EditEventSheet extends StatefulWidget {
  final Map<String, dynamic> event;
  final void Function(Map<String, dynamic>) onSaved;
  final VoidCallback onDeleted;

  const _EditEventSheet({
    required this.event,
    required this.onSaved,
    required this.onDeleted,
  });

  @override
  State<_EditEventSheet> createState() => _EditEventSheetState();
}

class _EditEventSheetState extends State<_EditEventSheet> {
  late final TextEditingController _titleCtrl;
  late final TextEditingController _locationCtrl;
  late final TextEditingController _descCtrl;
  DateTime? _startDate;
  TimeOfDay? _startTime;
  DateTime? _endDate;
  TimeOfDay? _endTime;
  bool _rsvpEnabled = false;
  final Set<String> _selectedTags = {};
  bool _saving = false;
  bool _deleting = false;

  static const _allTags = [
    'Music', 'Food & Drink', 'Business', 'Religion & Spirituality',
    'Theater & Dance', 'Engineering & Technology', 'Science',
    'Career Development', 'Medicine', 'Government & Politics',
    'Education', 'Community & Culture', 'Humanities', 'Arts & Media',
    'Health & Wellness', 'Hobbies & Special Interest',
  ];

  @override
  void initState() {
    super.initState();
    final e = widget.event;
    _titleCtrl = TextEditingController(text: e['title']?.toString() ?? '');
    _locationCtrl =
        TextEditingController(text: e['location']?.toString() ?? '');
    _descCtrl =
        TextEditingController(text: e['description']?.toString() ?? '');
    _rsvpEnabled = e['rsvpEnabled'] == true;

    try {
      final start =
          DateTime.parse(e['startDate'].toString()).toLocal();
      _startDate = start;
      _startTime = TimeOfDay.fromDateTime(start);
    } catch (_) {}

    if (e['endDate'] != null) {
      try {
        final end =
            DateTime.parse(e['endDate'].toString()).toLocal();
        _endDate = end;
        _endTime = TimeOfDay.fromDateTime(end);
      } catch (_) {}
    }

    final tags = e['tags'];
    if (tags is List) {
      for (final t in tags) {
        final name =
            t is Map ? t['name']?.toString() : t?.toString();
        if (name != null && _allTags.contains(name)) {
          _selectedTags.add(name);
        }
      }
    }
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _locationCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  DateTime? _combineDateAndTime(DateTime? date, TimeOfDay? time) {
    if (date == null) return null;
    final t = time ?? const TimeOfDay(hour: 0, minute: 0);
    return DateTime(date.year, date.month, date.day, t.hour, t.minute);
  }

  Future<void> _pickDate(bool isStart) async {
    final initial = (isStart ? _startDate : _endDate) ?? DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365 * 3)),
    );
    if (picked == null || !mounted) return;
    setState(() => isStart ? _startDate = picked : _endDate = picked);
  }

  Future<void> _pickTime(bool isStart) async {
    final initial =
        (isStart ? _startTime : _endTime) ?? TimeOfDay.now();
    final picked = await showTimePicker(
        context: context, initialTime: initial);
    if (picked == null || !mounted) return;
    setState(() => isStart ? _startTime = picked : _endTime = picked);
  }

  Future<void> _save() async {
    if (_titleCtrl.text.trim().isEmpty || _startDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Event name and start date are required')),
      );
      return;
    }
    final eventId = widget.event['_id']?.toString();
    if (eventId == null) return;

    setState(() => _saving = true);
    final startDt =
        _combineDateAndTime(_startDate, _startTime)!.toUtc().toIso8601String();
    final endDt = _combineDateAndTime(_endDate, _endTime)
        ?.toUtc()
        .toIso8601String();

    final result = await getAPI.updateEvent(
      eventId: eventId,
      title: _titleCtrl.text.trim(),
      location: _locationCtrl.text.trim(),
      description: _descCtrl.text.trim(),
      startDate: startDt,
      endDate: endDt,
      rsvpEnabled: _rsvpEnabled,
      tags: _selectedTags.toList(),
    );

    if (!mounted) return;
    setState(() => _saving = false);

    if (result['success'] == true) {
      final updated = result['event'];
      if (updated is Map<String, dynamic>) widget.onSaved(updated);
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Event updated!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(
                result['message'] ?? 'Failed to update event')),
      );
    }
  }

  Future<void> _confirmDelete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Event'),
        content: const Text(
            'Are you sure you want to delete this event? This cannot be undone.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete',
                style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;

    final eventId = widget.event['_id']?.toString();
    if (eventId == null) return;

    setState(() => _deleting = true);
    final result = await getAPI.deleteEvent(eventId);
    if (!mounted) return;
    setState(() => _deleting = false);

    if (result['success'] == true) {
      widget.onDeleted();
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Event deleted.')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(
                result['message'] ?? 'Failed to delete event')),
      );
    }
  }

  String _formatDateBtn(
      DateTime? date, TimeOfDay? time, String placeholder) {
    if (date == null) return placeholder;
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    final dateStr = '${months[date.month - 1]} ${date.day}';
    if (time == null) return dateStr;
    final h = time.hourOfPeriod == 0 ? 12 : time.hourOfPeriod;
    final m = time.minute.toString().padLeft(2, '0');
    final a = time.period.name.toUpperCase();
    return '$dateStr · $h:$m $a';
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 32,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle bar
            Center(
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.inputFill,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Edit Event', style: AppTextStyles.h3),
                _deleting
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.red))
                    : IconButton(
                        icon: const Icon(Icons.delete_outline,
                            color: Colors.red),
                        onPressed: _confirmDelete,
                        tooltip: 'Delete event',
                      ),
              ],
            ),
            const SizedBox(height: 16),

            // Title
            _field('Event Name*', _titleCtrl),
            const SizedBox(height: 14),

            // Date row
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () async {
                      await _pickDate(true);
                      if (_startDate != null) await _pickTime(true);
                    },
                    child: _dateBtn(
                      _formatDateBtn(
                          _startDate, _startTime, 'Start Date*'),
                      _startDate != null,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward_ios,
                    size: 12, color: AppColors.textMuted),
                const SizedBox(width: 8),
                Expanded(
                  child: GestureDetector(
                    onTap: () async {
                      await _pickDate(false);
                      if (_endDate != null) await _pickTime(false);
                    },
                    child: _dateBtn(
                      _formatDateBtn(_endDate, _endTime, 'End Date'),
                      _endDate != null,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Location
            _field('Location', _locationCtrl),
            const SizedBox(height: 14),

            // Description
            _field('Description', _descCtrl, maxLines: 3),
            const SizedBox(height: 14),

            // Tags
            Text('Tags',
                style: AppTextStyles.body
                    .copyWith(fontWeight: FontWeight.w600)),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _allTags.map((tag) {
                final sel = _selectedTags.contains(tag);
                return GestureDetector(
                  onTap: () => setState(() =>
                      sel
                          ? _selectedTags.remove(tag)
                          : _selectedTags.add(tag)),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: sel
                          ? AppColors.primary
                          : AppColors.inputFill,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      tag,
                      style: TextStyle(
                        fontSize: 12,
                        color: sel
                            ? AppColors.white
                            : AppColors.textSecondary,
                        fontWeight: sel
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 14),

            // RSVP toggle
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Enable RSVP',
                    style: AppTextStyles.body
                        .copyWith(fontWeight: FontWeight.w600)),
                Switch(
                  value: _rsvpEnabled,
                  onChanged: (v) =>
                      setState(() => _rsvpEnabled = v),
                  activeThumbColor: AppColors.primary,
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Save button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _saving ? null : _save,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.black,
                  foregroundColor: AppColors.white,
                  padding:
                      const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24)),
                ),
                child: _saving
                    ? const SizedBox(
                        height: 18,
                        width: 18,
                        child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: AppColors.white))
                    : const Text('Save Changes'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _field(String label, TextEditingController ctrl,
      {int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 13, color: AppColors.textSecondary)),
        const SizedBox(height: 6),
        TextField(
          controller: ctrl,
          maxLines: maxLines,
          decoration: InputDecoration(
            filled: true,
            fillColor: AppColors.inputFill,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(
                horizontal: 16, vertical: 12),
          ),
        ),
      ],
    );
  }

  Widget _dateBtn(String text, bool hasValue) {
    return Container(
      padding:
          const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.inputFill,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 13,
          color: hasValue ? AppColors.black : AppColors.textMuted,
        ),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
    );
  }
}
