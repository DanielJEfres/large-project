import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';
import '../../utils/getAPI.dart';
import '../../utils/auth_service.dart';
import 'organizations.dart';
import 'createOrganization.dart';

class MyOrganizationsScreen extends StatefulWidget {
  const MyOrganizationsScreen({super.key});

  @override
  State<MyOrganizationsScreen> createState() => _MyOrganizationsScreenState();
}

class _MyOrganizationsScreenState extends State<MyOrganizationsScreen> {
  List<Map<String, dynamic>> _organizations = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchOrganizations();
  }

  Future<void> _fetchOrganizations() async {
    try {
      if (!AuthService.isLoggedIn) {
        if (mounted) setState(() { _organizations = []; _loading = false; });
        return;
      }

      final result = await getAPI.getUserOrganizations();
      print('fetch result: $result');

      if (!mounted) return;

      setState(() {
        _organizations = List<Map<String, dynamic>>.from(result['organizations'] ?? []);
        _loading = false;
      });
    } catch (e) {
      print('_fetchOrganizations ERROR: $e');
      if (mounted) setState(() => _loading = false);
    }
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
              padding: const EdgeInsets.fromLTRB(10, 16, 16, 8),
              child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(
                            Icons.chevron_left,
                            color: AppColors.black,
                            size: 22,
                          ),
                          onPressed: () => Navigator.pop(context),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'My Organizations',
                          style: AppTextStyles.h3,
                        ),
                      ],
                    ),

                    GestureDetector(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const CreateOrganizationScreen(),
                        ),
                      ).then((_) => _fetchOrganizations()),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.black,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.add, size: 16, color: AppColors.white),
                            SizedBox(width: 4),
                            Text(
                              'New Org',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: AppColors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
              ),
            ),

            const Divider(color: AppColors.inputFill, height: 1),

            Expanded(
              child: RefreshIndicator(
                onRefresh: _fetchOrganizations,
                child: _loading
                    ? ListView(
                  children: const [
                    SizedBox(height: 300),
                    Center(
                      child: CircularProgressIndicator(
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                )
                    : _organizations.isEmpty
                    ? ListView(
                  children: [
                    const SizedBox(height: 300),
                    Center(
                      child: Text(
                        'No organizations yet',
                        style: TextStyle(color: AppColors.textMuted),
                      ),
                    ),
                  ],
                )
                    : ListView.separated(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 16,
                  ),
                  itemCount: _organizations.length,
                  separatorBuilder: (_, __) =>
                  const SizedBox(height: 12),
                  itemBuilder: (_, i) {
                    final org = _organizations[i];
                    final name =
                        org['name']?.toString() ?? 'Organization';
                    final role = org['role']?.toString() ?? '';
                    final logo = org['logo']?.toString();

                    final orgId = org['_id']?.toString() ??
                        org['id']?.toString() ??
                        org['organizationId']?.toString() ??
                        org['organization']?['_id']?.toString();

                    return GestureDetector(
                      onTap: orgId != null
                          ? () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                OrganizationScreen(
                                  orgId: orgId,
                                  initialTabIndex: 1,
                                ),
                          ),
                        );
                        _fetchOrganizations();
                      }
                          : null,
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.inputFill,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: logo != null
                                  ? Image.network(
                                logo,
                                width: 56,
                                height: 56,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) =>
                                    _logoPlaceholder(),
                              )
                                  : _logoPlaceholder(),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment:
                                CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    name,
                                    style: AppTextStyles.body.copyWith(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  if (role.isNotEmpty)
                                    Text(
                                      role,
                                      style: AppTextStyles.caption
                                          .copyWith(
                                        color: AppColors.textMuted,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                            const Icon(
                              Icons.chevron_right,
                              color: AppColors.textMuted,
                              size: 20,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _logoPlaceholder() => Container(
    width: 56,
    height: 56,
    color: Colors.grey.shade300,
    child: const Icon(
      Icons.group_outlined,
      size: 24,
      color: AppColors.textMuted,
    ),
  );
}