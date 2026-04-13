import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../utils/getAPI.dart';
import '../utils/GlobalData.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? _user;
  List<Map<String, dynamic>> _organizations = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    if (!GlobalData.isLoggedIn) {
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

  @override
  Widget build(BuildContext context) {
    if (!GlobalData.isLoggedIn) {
      return Scaffold(
        backgroundColor: AppColors.white,
        body: SafeArea(
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Log in to view your profile',
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

    final firstName = _user?['firstName']?.toString() ?? GlobalData.firstName;
    final lastName = _user?['lastName']?.toString() ?? GlobalData.lastName;
    final fullName = '$firstName $lastName'.trim();
    final pfp = _user?['profilePicture']?.toString();

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: _loading
            ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
            : SingleChildScrollView(
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
                          CircleAvatar(
                            radius: 44,
                            backgroundColor: AppColors.inputFill,
                            backgroundImage: pfp != null ? NetworkImage(pfp) : null,
                            child: pfp == null
                                ? const Icon(Icons.person_outline,
                                    size: 40, color: AppColors.textMuted)
                                : null,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            fullName.isEmpty ? 'Your Name' : fullName,
                            style: AppTextStyles.h3,
                          ),
                          const SizedBox(height: 12),
                          ElevatedButton(
                            onPressed: () {},
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
                        child: Text('Not a member of any organizations yet.',
                            style: AppTextStyles.caption
                                .copyWith(color: AppColors.textMuted)),
                      )
                    else
                      SizedBox(
                        height: 120,
                        child: ListView.separated(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          scrollDirection: Axis.horizontal,
                          itemCount: _organizations.length,
                          separatorBuilder: (_, _) => const SizedBox(width: 12),
                          itemBuilder: (_, i) {
                            final org = _organizations[i];
                            final logo = org['logo']?.toString();
                            final role = org['role']?.toString() ?? 'member';
                            return SizedBox(
                              width: 90,
                              child: Column(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: Container(
                                      width: 72,
                                      height: 72,
                                      color: AppColors.inputFill,
                                      child: logo != null
                                          ? Image.network(logo,
                                              fit: BoxFit.cover,
                                              errorBuilder: (context, error, stack) =>
                                                  const Icon(Icons.group_outlined,
                                                      color: AppColors.textMuted))
                                          : const Icon(Icons.group_outlined,
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
                                    maxLines: 1,
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
                            );
                          },
                        ),
                      ),

                    const SizedBox(height: 24),
                    const Divider(color: AppColors.inputFill, height: 1),

                    _buildNavRow('Interests', onTap: () {}),

                    const Divider(color: AppColors.inputFill, height: 1),
                    const SizedBox(height: 40),
                  ],
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
                style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
            const Icon(Icons.chevron_right, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }

  String _capitalize(String s) =>
      s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);
}
