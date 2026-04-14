import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';
import '../../utils/getAPI.dart';
import '../../utils/auth_service.dart';
import '../../components/app_button.dart';
import '../../components/app_text_field.dart';

class CreateOrganizationScreen extends StatefulWidget {
  const CreateOrganizationScreen({super.key});

  @override
  State<CreateOrganizationScreen> createState() =>
      _CreateOrganizationScreenState();
}

class _CreateOrganizationScreenState extends State<CreateOrganizationScreen> {
  final _nameController = TextEditingController();
  final _descController = TextEditingController();
  final _websiteController = TextEditingController();
  final _instagramController = TextEditingController();
  final _emailController = TextEditingController();

  bool _isSubmitting = false;

  final List<String> _allTags = [
    'Music',
    'Food & Drink',
    'Business',
    'Religion & Spirituality',
    'Theater & Dance',
    'Engineering & Technology',
    'Science',
    'Career Development',
    'Medicine',
    'Government & Politics',
    'Education',
    'Community & Culture',
    'Humanities',
    'Arts & Media',
    'Health & Wellness',
    'Hobbies & Special Interest',
  ];
  final Set<String> _selectedTags = {};

  @override
  void dispose() {
    _nameController.dispose();
    _descController.dispose();
    _websiteController.dispose();
    _instagramController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_nameController.text.trim().isEmpty) {
      _showSnack('Organization name is required');
      return;
    }
    if (_descController.text.trim().isEmpty) {
      _showSnack('Description is required');
      return;
    }
    if (!AuthService.isLoggedIn) {
      _showSnack('You must be logged in to create an organization');
      return;
    }

    setState(() => _isSubmitting = true);

    // TODO: wire up real API call once backend endpoint is ready
    // final result = await getAPI.createOrganization(
    //   name: _nameController.text.trim(),
    //   description: _descController.text.trim(),
    //   orgType: 'rso',
    //   website: _websiteController.text.trim(),
    //   instagram: _instagramController.text.trim(),
    //   contactEmail: _emailController.text.trim(),
    //   tags: _selectedTags.toList(),
    //   createdBy: AuthService.userId!,
    // );

    final result = await getAPI.createOrganization(
      name: _nameController.text.trim(),
      description: _descController.text.trim(),
      createdBy: AuthService.userId!,
      contactEmail: _emailController.text.trim(),
      website: _websiteController.text.trim(),
      instagram: _instagramController.text.trim(),
      tags: _selectedTags.toList(),
    );

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (result['success'] == true) {
      _showSnack('Organization created!');
      setState(() {
        _nameController.clear();
        _descController.clear();
        _websiteController.clear();
        _instagramController.clear();
        _emailController.clear();
        _selectedTags.clear();
      });
      if (mounted) Navigator.pop(context);
    } else {
      _showSnack(
          (result['message'] as String?) ?? 'Failed to create organization');
    }
  }

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    if (!AuthService.isLoggedIn) {
      return Scaffold(
        backgroundColor: AppColors.white,
        body: SafeArea(
          child: Column(
            children: [
              // Add this back button row
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Log in to create organizations',
                        style: AppTextStyles.body.copyWith(color: AppColors.textMuted),
                      ),
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
            ],
          ),
        ),
      );
    }


    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(child: _buildForm()),
    );
  }

  Widget _buildForm() {
    return Column(
      children: [
        // Top nav — back arrow goes back to search page
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
              Text(
                'Creating an Organization',
                style:
                AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Logo upload
                Center(
                  child: Stack(
                    children: [
                      Container(
                        width: 96,
                        height: 96,
                        decoration: BoxDecoration(
                          color: AppColors.inputFill,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: const Icon(
                          Icons.add_photo_alternate_outlined,
                          size: 36,
                          color: AppColors.textMuted,
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AppColors.black,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.edit,
                              size: 14, color: AppColors.white),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 6),
                const Center(
                  child: Text(
                    'Organization Logo',
                    style:
                    TextStyle(fontSize: 12, color: AppColors.textMuted),
                  ),
                ),
                const SizedBox(height: 20),

                AppTextField(
                  label: 'Organization Name*',
                  controller: _nameController,
                  onChanged: (_) {},
                ),
                const SizedBox(height: 16),

                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Description*',
                      style: TextStyle(
                          fontSize: 14, color: AppColors.textSecondary),
                    ),
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
                        hintText: 'What does your organization do?',
                        hintStyle: const TextStyle(
                            fontSize: 14, color: AppColors.textMuted),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                AppTextField(
                  label: 'Contact Email',
                  controller: _emailController,
                  onChanged: (_) {},
                ),
                const SizedBox(height: 16),

                Text(
                  'Websites',
                  style:
                  AppTextStyles.body.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),

                _SocialField(
                  icon: Icons.language_outlined,
                  label: 'Website URL',
                  controller: _websiteController,
                ),
                const SizedBox(height: 10),

                _SocialField(
                  icon: Icons.camera_alt_outlined,
                  label: 'Instagram handle',
                  controller: _instagramController,
                  prefix: '@',
                ),
                const SizedBox(height: 16),

                Text(
                  'Tags',
                  style:
                  AppTextStyles.body.copyWith(fontWeight: FontWeight.bold),
                ),
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
                const SizedBox(height: 24),

                AppButton(
                  label: 'Create Organization',
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
}

// ─── Social / Website Field ───────────────────────────────────────────────────

class _SocialField extends StatelessWidget {
  final IconData icon;
  final String label;
  final TextEditingController controller;
  final String? prefix;

  const _SocialField({
    required this.icon,
    required this.label,
    required this.controller,
    this.prefix,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.inputFill,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const SizedBox(width: 12),
          Icon(icon, size: 20, color: AppColors.textMuted),
          const SizedBox(width: 8),
          if (prefix != null)
            Text(prefix!,
                style: const TextStyle(
                    fontSize: 14, color: AppColors.textMuted)),
          Expanded(
            child: TextField(
              controller: controller,
              decoration: InputDecoration(
                border: InputBorder.none,
                hintText: label,
                hintStyle: const TextStyle(
                    fontSize: 14, color: AppColors.textMuted),
                contentPadding:
                const EdgeInsets.symmetric(horizontal: 8, vertical: 14),
              ),
            ),
          ),
        ],
      ),
    );
  }
}