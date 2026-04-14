import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../utils/getAPI.dart';
import '../utils/auth_service.dart';
import 'organizations/organizations.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => ProfileScreenState();
}

class ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? _user;
  List<Map<String, dynamic>> _organizations = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    if (!AuthService.isLoggedIn) {
      setState(() => _loading = false);
      return;
    }
    final results = await Future.wait([
      getAPI.getUserProfile(),
      getAPI.getUserOrganizations(),
    ]);
    if (!mounted) return;
    setState(() {
      if (results[0]['success'] == true) {
        _user = results[0]['user'] as Map<String, dynamic>;
      }
      _organizations = List<Map<String, dynamic>>.from(
          results[1]['organizations'] ?? []);
      _loading = false;
    });
  }

  void _openEditProfile() {
    final firstCtrl = TextEditingController(
        text: _user?['firstName']?.toString() ?? AuthService.firstName ?? '');
    final lastCtrl = TextEditingController(
        text: _user?['lastName']?.toString() ?? AuthService.lastName ?? '');
    final bioCtrl = TextEditingController(
        text: _user?['bio']?.toString() ?? '');
    bool saving = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModal) => Padding(
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 24,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 32,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36, height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.inputFill,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text('Edit Profile', style: AppTextStyles.h3),
              const SizedBox(height: 20),
              _modalField('First Name', firstCtrl),
              const SizedBox(height: 14),
              _modalField('Last Name', lastCtrl),
              const SizedBox(height: 14),
              _modalField('Bio', bioCtrl, maxLines: 3),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: saving
                      ? null
                      : () async {
                          setModal(() => saving = true);
                          final updates = <String, String>{};
                          if (firstCtrl.text.trim().isNotEmpty) {
                            updates['firstName'] = firstCtrl.text.trim();
                          }
                          if (lastCtrl.text.trim().isNotEmpty) {
                            updates['lastName'] = lastCtrl.text.trim();
                          }
                          updates['bio'] = bioCtrl.text.trim();

                          final result = await getAPI.updateUserProfile(updates);
                          if (!mounted) return;
                          final messenger = ScaffoldMessenger.of(context);
                          Navigator.pop(ctx);
                          if (result['success'] == true) {
                            setState(() {
                              _user = {
                                ...?_user,
                                ...result['user'] as Map<String, dynamic>,
                              };
                            });
                            messenger.showSnackBar(
                              const SnackBar(content: Text('Profile updated!')),
                            );
                          } else {
                            messenger.showSnackBar(
                              SnackBar(content: Text(
                                result['message'] ?? 'Failed to update profile')),
                            );
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.black,
                    foregroundColor: AppColors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24)),
                  ),
                  child: saving
                      ? const SizedBox(
                          height: 18, width: 18,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: AppColors.white))
                      : const Text('Save'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _modalField(String label, TextEditingController ctrl, {int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
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
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
      ],
    );
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
                Text('Log in to view your profile',
                    style: AppTextStyles.body
                        .copyWith(color: AppColors.textMuted)),
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
          ),
        ),
      );
    }

    final firstName =
        _user?['firstName']?.toString() ?? AuthService.firstName ?? '';
    final lastName =
        _user?['lastName']?.toString() ?? AuthService.lastName ?? '';
    final fullName = '$firstName $lastName'.trim();
    final pfp = _user?['profilePicture']?.toString();

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: _loading
            ? const Center(
                child: CircularProgressIndicator(color: AppColors.primary))
            : RefreshIndicator(
                onRefresh: fetchData,
                color: AppColors.primary,
                child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top action icons
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 8, 8, 0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.ios_share_outlined,
                                size: 22, color: AppColors.black),
                            onPressed: () {},
                          ),
                          IconButton(
                            icon: const Icon(Icons.settings_outlined,
                                size: 22, color: AppColors.black),
                            onPressed: () {},
                          ),
                        ],
                      ),
                    ),

                    // Avatar + name + edit button
                    Center(
                      child: Column(
                        children: [
                          GestureDetector(
                            onTap: _pickAndUploadProfilePicture,
                            child: Stack(
                              children: [
                                CircleAvatar(
                                  radius: 44,
                                  backgroundColor: AppColors.inputFill,
                                  backgroundImage: _user?['_localPfp'] == true
                                      ? FileImage(File(_user!['profilePicture']))
                                      : pfp != null
                                          ? NetworkImage(pfp) as ImageProvider
                                          : null,
                                  child: (pfp == null && _user?['_localPfp'] != true)
                                      ? const Icon(Icons.person_outline,
                                          size: 40, color: AppColors.textMuted)
                                      : null,
                                ),
                                Positioned(
                                  bottom: 0,
                                  right: 0,
                                  child: Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      color: AppColors.black,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.camera_alt,
                                        size: 14, color: AppColors.white),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            fullName.isEmpty ? 'Your Name' : fullName,
                            style: AppTextStyles.h3,
                          ),
                          const SizedBox(height: 12),
                          ElevatedButton(
                            onPressed: _openEditProfile,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.black,
                              foregroundColor: AppColors.white,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 40, vertical: 10),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(24)),
                              elevation: 0,
                            ),
                            child: const Text('Edit Profile',
                                style: TextStyle(fontSize: 14)),
                          ),
                          const SizedBox(height: 24),
                        ],
                      ),
                    ),

                    const Divider(color: AppColors.inputFill, height: 1),

                    // My Organizations
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
                      child: Text('My Organizations',
                          style: AppTextStyles.body
                              .copyWith(fontWeight: FontWeight.w600)),
                    ),
                    if (_organizations.isEmpty)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Text(
                          'Not a member of any organizations yet.',
                          style: AppTextStyles.caption
                              .copyWith(color: AppColors.textMuted),
                        ),
                      )
                    else
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Wrap(
                          spacing: 12,
                          runSpacing: 16,
                          children: _organizations.map((org) {
                            final logo = org['logo']?.toString();
                            final role =
                                org['role']?.toString() ?? 'member';
                            final orgId = org['id']?.toString();
                            return GestureDetector(
                              onTap: orgId != null
                                  ? () => Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => OrganizationScreen(
                                              orgId: orgId),
                                        ),
                                      )
                                  : null,
                              child: SizedBox(
                                width: 80,
                                child: Column(
                                  children: [
                                    ClipRRect(
                                      borderRadius:
                                          BorderRadius.circular(10),
                                      child: Container(
                                        width: 72,
                                        height: 72,
                                        color: AppColors.inputFill,
                                        child: logo != null
                                            ? Image.network(logo,
                                                fit: BoxFit.cover,
                                                errorBuilder:
                                                    (context, error, stack) =>
                                                        const Icon(
                                                            Icons.group_outlined,
                                                            color: AppColors
                                                                .textMuted))
                                            : const Icon(
                                                Icons.group_outlined,
                                                color: AppColors.textMuted),
                                      ),
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      org['name']?.toString() ?? '',
                                      style: const TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          color: AppColors.black),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      textAlign: TextAlign.center,
                                    ),
                                    Text(
                                      _capitalize(role),
                                      style: const TextStyle(
                                          fontSize: 10,
                                          color: AppColors.textMuted),
                                      textAlign: TextAlign.center,
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),

                    const SizedBox(height: 24),
                    const Divider(color: AppColors.inputFill, height: 1),

                    _buildNavRow('Interests', onTap: () {}),

                    const Divider(color: AppColors.inputFill, height: 1),
                    const SizedBox(height: 16),

                    // Sign out
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: SizedBox(
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: _signOut,
                          icon: const Icon(Icons.logout,
                              size: 18, color: Colors.red),
                          label: const Text('Sign Out',
                              style: TextStyle(color: Colors.red)),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.red),
                            padding:
                                const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(24)),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
              ),
      ),
    );
  }

  Widget _buildNavRow(String label, {required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label,
                style:
                    AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
            const Icon(Icons.chevron_right, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }

  Future<void> _pickAndUploadProfilePicture() async {
    final picked = await ImagePicker().pickImage(
      source: ImageSource.gallery,
      imageQuality: 85,
    );
    if (picked == null || !mounted) return;

    // Optimistically show the new image immediately
    setState(() => _user = {...?_user, 'profilePicture': picked.path, '_localPfp': true});

    final result = await getAPI.updateUserProfile({}, profilePicture: picked);
    if (!mounted) return;

    if (result['success'] == true) {
      setState(() {
        _user = {
          ...?_user,
          ...result['user'] as Map<String, dynamic>,
          '_localPfp': false,
        };
      });
    } else {
      // Revert on failure
      setState(() => _user = {...?_user, '_localPfp': false});
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Failed to upload photo')),
      );
    }
  }

  Future<void> _signOut() async {
    await AuthService.clear();
    if (!mounted) return;
    Navigator.pushNamedAndRemoveUntil(context, '/', (_) => false);
  }

  String _capitalize(String s) =>
      s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);
}
