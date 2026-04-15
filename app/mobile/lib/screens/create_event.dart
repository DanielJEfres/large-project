import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../utils/getAPI.dart';
import '../utils/auth_service.dart';
import '../components/app_button.dart';
import '../components/app_text_field.dart';

class CreateEventScreen extends StatefulWidget {
  const CreateEventScreen({super.key});

  @override
  State<CreateEventScreen> createState() => _CreateEventScreenState();
}

class _CreateEventScreenState extends State<CreateEventScreen> {
  // Step 1: pick type. Step 2: fill form.
  bool _typeSelected = false;
  bool _isRSO = false;

  // Form fields
  final _titleController = TextEditingController();
  final _locationController = TextEditingController();
  final _descController = TextEditingController();
  DateTime? _startDate;
  TimeOfDay? _startTime;
  DateTime? _endDate;
  TimeOfDay? _endTime;
  bool _rsvpEnabled = false;
  bool _isSubmitting = false;
  XFile? _flyerImage;

  final List<String> _allTags = [
    'Music', 'Food & Drink', 'Business', 'Religion & Spirituality',
    'Theater & Dance', 'Engineering & Technology', 'Science',
    'Career Development', 'Medicine', 'Government & Politics',
    'Education', 'Community & Culture', 'Humanities', 'Arts & Media',
    'Health & Wellness', 'Hobbies & Special Interest',
  ];
  final Set<String> _selectedTags = {};

  @override
  void dispose() {
    _titleController.dispose();
    _locationController.dispose();
    _descController.dispose();
    super.dispose();
  }

  DateTime? _combineDateAndTime(DateTime? date, TimeOfDay? time) {
    if (date == null) return null;
    final t = time ?? const TimeOfDay(hour: 0, minute: 0);
    return DateTime(date.year, date.month, date.day, t.hour, t.minute);
  }

  Future<void> _pickDate(bool isStart) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
    );
    if (picked == null || !mounted) return;
    setState(() => isStart ? _startDate = picked : _endDate = picked);
  }

  Future<void> _pickTime(bool isStart) async {
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked == null || !mounted) return;
    setState(() => isStart ? _startTime = picked : _endTime = picked);
  }

  Future<void> _pickFlyer() async {
    final picked = await ImagePicker().pickImage(
      source: ImageSource.gallery,
      imageQuality: 85,
    );
    if (picked != null) setState(() => _flyerImage = picked);
  }

  Future<void> _submit() async {
    if (_titleController.text.trim().isEmpty) {
      _showSnack('Event name is required');
      return;
    }
    if (_startDate == null) {
      _showSnack('Start date is required');
      return;
    }
    if (!AuthService.isLoggedIn) {
      _showSnack('You must be logged in to create an event');
      return;
    }

    setState(() => _isSubmitting = true);

    final startDt = _combineDateAndTime(_startDate, _startTime);
    final endDt = _combineDateAndTime(_endDate, _endTime);

    final result = await getAPI.createEvent(
      title: _titleController.text.trim(),
      location: _locationController.text.trim(),
      description: _descController.text.trim(),
      startDate: startDt!.toUtc().toIso8601String(),
      endDate: endDt?.toUtc().toIso8601String(),
      isRSO: _isRSO,
      rsvpEnabled: _rsvpEnabled,
      createdBy: AuthService.userId!,
      tags: _selectedTags.toList(),
      flyerImage: _flyerImage,
    );

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (result['success'] == true) {
      _showSnack('Event created!');
      // Reset form
      setState(() {
        _typeSelected = false;
        _titleController.clear();
        _locationController.clear();
        _descController.clear();
        _startDate = null;
        _startTime = null;
        _endDate = null;
        _endTime = null;
        _selectedTags.clear();
        _rsvpEnabled = false;
        _flyerImage = null;
      });
    } else {
      _showSnack(result['message'] ?? 'Failed to create event');
    }
  }

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    if (!AuthService.isLoggedIn) {
      return Scaffold(
        backgroundColor: AppColors.white,
        body: SafeArea(
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Log in to create events',
                    style: AppTextStyles.body.copyWith(color: AppColors.textMuted)),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => Navigator.pushNamed(context, '/login'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.black,
                    foregroundColor: AppColors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  ),
                  child: const Text('Log in'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: _typeSelected ? _buildForm() : _buildTypePicker(),
      ),
    );
  }

  // ─── Step 1: Type Picker ──────────────────────────────────────────────────

  Widget _buildTypePicker() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('CREATE EVENT', style: AppTextStyles.h2),
          const Expanded(child: SizedBox()),
          const Center(
            child: Text(
              'Pick the Event Type to Get Started',
              style: TextStyle(fontSize: 15, color: AppColors.textSecondary),
            ),
          ),
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _TypeCard(
                label: 'RSO Event',
                icon: Icons.school_outlined,
                selected: false,
                onTap: () => setState(() {
                  _isRSO = true;
                  _typeSelected = true;
                }),
              ),
              const SizedBox(width: 16),
              _TypeCard(
                label: 'Student Event',
                icon: Icons.people_outline,
                selected: false,
                onTap: () => setState(() {
                  _isRSO = false;
                  _typeSelected = true;
                }),
              ),
            ],
          ),
          const Expanded(child: SizedBox()),
        ],
      ),
    );
  }

  // ─── Step 2: Form ─────────────────────────────────────────────────────────

  Widget _buildForm() {
    return Column(
      children: [
        // Top nav
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                onPressed: () => setState(() => _typeSelected = false),
              ),
              Text('Creating an Event',
                  style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Flyer picker
                GestureDetector(
                  onTap: _pickFlyer,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      width: double.infinity,
                      height: 160,
                      color: AppColors.inputFill,
                      child: _flyerImage != null
                          ? Image.file(File(_flyerImage!.path),
                              fit: BoxFit.cover)
                          : const Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.add_photo_alternate_outlined,
                                    size: 36, color: AppColors.textMuted),
                                SizedBox(height: 8),
                                Text('Upload Flyer',
                                    style: TextStyle(
                                        fontSize: 13,
                                        color: AppColors.textMuted)),
                              ],
                            ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Event name
                AppTextField(
                  label: 'Event Name*',
                  controller: _titleController,
                  onChanged: (_) {},
                ),
                const SizedBox(height: 16),

                // Date row
                Row(
                  children: [
                    Expanded(child: _buildDateButton(isStart: true)),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward_ios,
                        size: 14, color: AppColors.textMuted),
                    const SizedBox(width: 8),
                    Expanded(child: _buildDateButton(isStart: false)),
                  ],
                ),
                const SizedBox(height: 16),

                // Location
                AppTextField(
                  label: 'Location',
                  controller: _locationController,
                  onChanged: (_) {},
                ),
                const SizedBox(height: 16),

                // Description
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Description',
                        style: TextStyle(
                            fontSize: 14, color: AppColors.textSecondary)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _descController,
                      maxLines: 4,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AppColors.inputFill,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.all(16),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Tags
                Text('Tags',
                    style: AppTextStyles.body
                        .copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _allTags.map((tag) {
                    final selected = _selectedTags.contains(tag);
                    return GestureDetector(
                      onTap: () => setState(() => selected
                          ? _selectedTags.remove(tag)
                          : _selectedTags.add(tag)),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 7),
                        decoration: BoxDecoration(
                          color: selected
                              ? AppColors.primary
                              : AppColors.inputFill,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          tag,
                          style: TextStyle(
                            fontSize: 12,
                            color: selected
                                ? AppColors.white
                                : AppColors.textSecondary,
                            fontWeight: selected
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),

                // RSVP toggle
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Enable RSVP',
                        style: AppTextStyles.body
                            .copyWith(fontWeight: FontWeight.w600)),
                    Switch(
                      value: _rsvpEnabled,
                      onChanged: (v) => setState(() => _rsvpEnabled = v),
                      activeThumbColor: AppColors.primary,
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                AppButton(
                  label: 'Create Event',
                  onPressed: _submit,
                  isLoading: _isSubmitting,
                  width: double.infinity,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDateButton({required bool isStart}) {
    final date = isStart ? _startDate : _endDate;
    final time = isStart ? _startTime : _endTime;
    final label = isStart ? 'Start Date' : 'End Date (optional)';

    String text;
    if (date == null) {
      text = label;
    } else {
      final months = ['Jan','Feb','Mar','Apr','May','Jun',
                      'Jul','Aug','Sep','Oct','Nov','Dec'];
      final dateStr = '${months[date.month - 1]} ${date.day}';
      final timeStr = time != null
          ? ' · ${time.hourOfPeriod}:${time.minute.toString().padLeft(2, '0')} ${time.period.name.toUpperCase()}'
          : '';
      text = '$dateStr$timeStr';
    }

    return GestureDetector(
      onTap: () async {
        await _pickDate(isStart);
        if ((isStart ? _startDate : _endDate) != null) {
          await _pickTime(isStart);
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.inputFill,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 13,
            color: date == null ? AppColors.textMuted : AppColors.black,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ),
    );
  }
}

// ─── Type Card ────────────────────────────────────────────────────────────────

class _TypeCard extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;

  const _TypeCard({
    required this.label,
    required this.icon,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 140,
        height: 120,
        decoration: BoxDecoration(
          color: selected ? AppColors.primary.withValues(alpha: 0.1) : AppColors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: selected ? AppColors.primary : const Color(0xFFE0E0E0),
            width: 2,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 36, color: AppColors.black),
            const SizedBox(height: 10),
            Text(label,
                style: const TextStyle(
                    fontSize: 14, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
