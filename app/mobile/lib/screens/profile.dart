import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../utils/getAPI.dart';
import '../utils/auth_service.dart';
import 'tickets.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  List<Map<String, dynamic>> _attendedEvents = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchEvents();
  }

  Future<void> _fetchEvents() async {
    if (!AuthService.isLoggedIn) {
      setState(() => _loading = false);
      return;
    }
    final result = await getAPI.getUserEvents(AuthService.userId!);
    if (!mounted) return;
    setState(() {
      _attendedEvents = List<Map<String, dynamic>>.from(result['events'] ?? []);
      _loading = false;
    });
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

    final name =
        '${AuthService.firstName ?? ''} ${AuthService.lastName ?? ''}'.trim();

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: SingleChildScrollView(
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
                    const CircleAvatar(
                      radius: 44,
                      backgroundColor: AppColors.inputFill,
                      child: Icon(Icons.person_outline,
                          size: 40, color: AppColors.textMuted),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      name.isEmpty ? 'Your Name' : name,
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

              // "Attended (N)" label — tapping goes to My Events › Past tab
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: GestureDetector(
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const TicketsScreen(initialTab: 1),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Attended (${_attendedEvents.length})',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: AppColors.black,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                          height: 2, width: 80, color: AppColors.primary),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Event thumbnail grid
              if (_loading)
                const Padding(
                  padding: EdgeInsets.all(32),
                  child: Center(
                      child: CircularProgressIndicator(
                          color: AppColors.primary)),
                )
              else if (_attendedEvents.isEmpty)
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  child: Text('No attended events yet',
                      style: AppTextStyles.caption
                          .copyWith(color: AppColors.textMuted)),
                )
              else
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _attendedEvents.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 8,
                      mainAxisSpacing: 8,
                    ),
                    itemBuilder: (_, i) {
                      final flyer =
                          _attendedEvents[i]['flyer']?.toString();
                      final eventId =
                          _attendedEvents[i]['_id']?.toString();
                      return GestureDetector(
                        onTap: eventId != null
                            ? () => Navigator.pushNamed(
                                context, '/event/$eventId')
                            : null,
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: flyer != null
                              ? Image.network(flyer,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) =>
                                      _thumbPlaceholder())
                              : _thumbPlaceholder(),
                        ),
                      );
                    },
                  ),
                ),

              const SizedBox(height: 24),
              const Divider(color: AppColors.inputFill, height: 1),

              _buildNavRow(
                'My Organizations',
                onTap: () => Navigator.pushNamed(context, '/organizations'),
              ),

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
        padding:
            const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label,
                style: AppTextStyles.body
                    .copyWith(fontWeight: FontWeight.w600)),
            const Icon(Icons.chevron_right, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }

  Widget _thumbPlaceholder() => Container(
        color: AppColors.inputFill,
        child: const Center(
          child: Icon(Icons.image_outlined,
              size: 24, color: AppColors.textMuted),
        ),
      );
}
