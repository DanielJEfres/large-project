
// ─── Data Model ───────────────────────────────────────────────────────────────
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../components/app_bottom_nav.dart';
import 'organizations.dart';
import '../../utils/getAPI.dart';
import '../../utils/auth_service.dart';
import 'dart:async';

// ─── Data Model ───────────────────────────────────────────────────────────────

class Organization {
  final String id;
  final String name;
  final String description;
  final String category;

  const Organization({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
  });

  factory Organization.fromJson(Map<String, dynamic> json) {
    return Organization(
      id: json['_id'] ?? '',
      name: json['name'] ?? 'Unknown',
      description: json['description'] ?? '',
      category: json['category'] ?? '',
    );
  }
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const kYellow     = Color(0xFFF5C842);
const kDark       = Color(0xFF1A1A1A);
const kGray       = Color(0xFF9E9E9E);
const kLightGray  = Color(0xFFF0F0F0);
const kBorderGray = Color(0xFFE0E0E0);
const kWhite      = Colors.white;

const _allCategories = [
  'All', 'Music', 'Food & Drink', 'Business', 'Religion & Spirituality',
  'Theater & Dance', 'Social Justice & Human Rights', 'Engineering & Technology',
  'Science', 'Career Development', 'Medicine', 'Government & Politics',
  'Education', 'Community & Culture', 'Humanities', 'Arts & Media',
  'Health & Wellness', 'Hobbies & Special Interest', 'Other',
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

class SearchOrganization extends StatefulWidget {
  const SearchOrganization({super.key});

  @override
  State<SearchOrganization> createState() => _SearchOrganizationState();
}

class _SearchOrganizationState extends State<SearchOrganization> {
  String _selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();

  List<Organization> _organizations = [];
  bool _isLoading = true;
  String? _errorMessage;
  int _totalResults = 0;
  final Set<String> _joinedOrgIds = {};
  final Set<String> _joiningOrgIds = {};

  @override
  void initState() {
    super.initState();
    _fetchOrganizations();

    _searchController.addListener(_onSearchChanged);
  }

// Add this outside initState
  Timer? _debounce;

  void _onSearchChanged() {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      if (mounted) _fetchOrganizations(query: _searchController.text.trim());
    });
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }



  Future<void> _fetchOrganizations({String? query}) async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Pass name only when there's an actual query
      final result = await getAPI.getOrganizations(
        name: (query != null && query.isNotEmpty) ? query : null,
      );

      if (result['success'] == true) {
        final List<dynamic> raw = result['organizations'] ?? [];
        final orgs = raw.map((e) => Organization.fromJson(e)).toList();

        // Client-side category filter (the backend filters by name only)
        final filtered = _selectedCategory == 'All'
            ? orgs
            : orgs.where((o) => o.category == _selectedCategory).toList();

        setState(() {
          _organizations = filtered;
          _totalResults = filtered.length;
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = result['message'] ?? 'Failed to load organizations.';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'An unexpected error occurred.';
        _isLoading = false;
      });
    }
  }

  Future<void> _joinOrg(Organization org) async {
    setState(() => _joiningOrgIds.add(org.id));
    final result = await getAPI.joinOrganization(org.name);
    if (!mounted) return;
    setState(() => _joiningOrgIds.remove(org.id));
    if (result['success'] == true) {
      setState(() => _joinedOrgIds.add(org.id));
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Joined ${org.name}!')),
      );
    } else {
      final msg = result['message'] ?? '';
      final display = (msg.toLowerCase().contains('server') || msg.isEmpty)
          ? 'Could not join — please try again later.'
          : msg;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(display)),
      );
    }
  }

  void _goToOrgInfo(Organization org) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => OrganizationScreen(orgId: org.id), // pass the id
      ),
    );
  }

  void _openFilters() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: kWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => FiltersBottomSheet(
        categories: _allCategories.where((c) => c != 'All').toList(),
        onApply: (selected) {
          if (selected.isNotEmpty) {
            setState(() => _selectedCategory = selected.first);
          } else {
            setState(() => _selectedCategory = 'All');
          }
          Navigator.pop(context);
          // Re-fetch with the new category applied
          _fetchOrganizations(query: _searchController.text.trim());
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark,
      child: Scaffold(
        backgroundColor: kWhite,
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'ORGANIZATIONS',
                    style: TextStyle(
                      fontSize: 28,
                      fontFamily: 'League Spartan',
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                      color: kDark,
                    ),
                  ),
                  const SizedBox(height: 14),

                  // ── Search bar ──
                  Container(
                    height: 42,
                    decoration: BoxDecoration(
                      color: kLightGray,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: TextField(
                      controller: _searchController,
                      style: const TextStyle(fontSize: 14, color: kDark),
                      decoration: const InputDecoration(
                        hintText: 'Search Organizations',
                        hintStyle: TextStyle(fontSize: 14, color: kGray, fontFamily: 'Inter'),
                        prefixIcon: Icon(Icons.search, size: 18, color: kGray),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // ── Category chips + filter icon ──
                  Row(
                    children: [
                      Expanded(
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: _allCategories.map((cat) {
                              final isSelected = cat == _selectedCategory;
                              return Padding(
                                padding: const EdgeInsets.only(right: 8),
                                child: GestureDetector(
                                  onTap: () {
                                    setState(() => _selectedCategory = cat);
                                    _fetchOrganizations(
                                        query: _searchController.text.trim());
                                  },
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 180),
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 14, vertical: 7),
                                    decoration: BoxDecoration(
                                      color: isSelected ? kYellow : kWhite,
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(
                                        color: isSelected ? kYellow : kBorderGray,
                                      ),
                                    ),
                                    child: Text(
                                      cat,
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: isSelected
                                            ? FontWeight.w600
                                            : FontWeight.w400,
                                        color: isSelected ? kDark : kGray,
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      GestureDetector(
                        onTap: _openFilters,
                        child: Container(
                          width: 34,
                          height: 34,
                          decoration: BoxDecoration(
                            color: kLightGray,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.tune_rounded,
                              size: 18, color: kDark),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // ── Results count ──
                  Text(
                    _isLoading
                        ? 'Loading...'
                        : 'Showing ${_totalResults.toString()} result${_totalResults == 1 ? '' : 's'}',
                    style: const TextStyle(fontSize: 12, color: kGray),
                  ),
                ],
              ),
            ),

            // ── List / States ──
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _errorMessage != null
                  ? Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.error_outline,
                        color: kGray, size: 40),
                    const SizedBox(height: 8),
                    Text(_errorMessage!,
                        style: const TextStyle(color: kGray)),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () => _fetchOrganizations(
                          query: _searchController.text.trim()),
                      style: ElevatedButton.styleFrom(
                          backgroundColor: kDark,
                          foregroundColor: kWhite),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              )
                  : _organizations.isEmpty
                  ? const Center(
                child: Text('No organizations found.',
                    style: TextStyle(color: kGray)),
              )
                  : ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: _organizations.length,
                separatorBuilder: (_, __) =>
                const Divider(height: 1, color: kBorderGray),
                itemBuilder: (_, index) {
                  final org = _organizations[index];
                  return _OrgCard(
                    org: org,
                    onViewPage: () => _goToOrgInfo(org),
                    isMember: _joinedOrgIds.contains(org.id),
                    isJoining: _joiningOrgIds.contains(org.id),
                    onJoin: () => _joinOrg(org),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Org Card ─────────────────────────────────────────────────────────────────

class _OrgCard extends StatelessWidget {
  final Organization org;
  final VoidCallback onViewPage;
  final bool isMember;
  final bool isJoining;
  final VoidCallback? onJoin;

  const _OrgCard({
    required this.org,
    required this.onViewPage,
    this.isMember = false,
    this.isJoining = false,
    this.onJoin,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail placeholder
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: kLightGray,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: kBorderGray),
            ),
          ),
          const SizedBox(width: 14),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  org.name,
                  style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: kDark),
                ),
                const SizedBox(height: 4),

                // Show description as a subtitle if available
                if (org.description.isNotEmpty)
                  Text(
                    org.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 12, color: kGray),
                  ),
                const SizedBox(height: 6),

                // Category tag
                if (org.category.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: kLightGray,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(org.category,
                        style:
                        const TextStyle(fontSize: 11, color: kGray)),
                  ),
                const SizedBox(height: 10),

                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    GestureDetector(
                      onTap: onViewPage,
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text('View Page',
                              style: TextStyle(
                                  fontSize: 12, color: Colors.black)),
                          SizedBox(width: 2),
                          Icon(Icons.chevron_right,
                              size: 14, color: kGray),
                        ],
                      ),
                    ),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      onPressed: (isMember || isJoining)
                          ? null
                          : () {
                              if (!AuthService.isLoggedIn) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('You need to be logged in to join an organization.')),
                                );
                                return;
                              }
                              onJoin?.call();
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isMember ? Colors.grey[300] : kDark,
                        foregroundColor: isMember ? Colors.black54 : kWhite,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 22, vertical: 9),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20)),
                        textStyle: const TextStyle(
                            fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                      child: isJoining
                          ? const SizedBox(
                              height: 14,
                              width: 14,
                              child: CircularProgressIndicator(strokeWidth: 2, color: kWhite),
                            )
                          : Text(isMember ? 'Joined' : 'Join'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Filters Bottom Sheet ─────────────────────────────────────────────────────
// (unchanged — keeping your existing FiltersBottomSheet exactly as-is)



class FiltersBottomSheet extends StatefulWidget {
  final List<String> categories;
  final void Function(Set<String> selected) onApply;

  const FiltersBottomSheet({
    super.key,
    required this.categories,
    required this.onApply,
  });

  @override
  State<FiltersBottomSheet> createState() => _FiltersBottomSheetState();
}

class _FiltersBottomSheetState extends State<FiltersBottomSheet> {
  final Set<String> _selected = {};

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.65,
      minChildSize: 0.4,
      maxChildSize: 0.92,
      builder: (_, scrollController) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: kBorderGray,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton(
                  onPressed: () => setState(() => _selected.clear()),
                  child: const Text('Reset',
                      style: TextStyle(color: kGray, fontSize: 14)),
                ),
                const Text('Filters',
                    style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                        color: kDark)),
                IconButton(
                  icon: const Icon(Icons.close, color: kDark),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 4),
            const Text('Categories',
                style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: kDark)),
            const SizedBox(height: 12),
            Expanded(
              child: SingleChildScrollView(
                controller: scrollController,
                child: Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: widget.categories.map((cat) {
                    final isSelected = _selected.contains(cat);
                    return GestureDetector(
                      onTap: () => setState(() => isSelected
                          ? _selected.remove(cat)
                          : _selected.add(cat)),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? kYellow : kLightGray,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                              color: isSelected ? kYellow : kBorderGray),
                        ),
                        child: Text(
                          cat,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: isSelected
                                ? FontWeight.w600
                                : FontWeight.w400,
                            color: isSelected ? kDark : kGray,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
            const Divider(color: kBorderGray),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Sort by',
                  style: TextStyle(fontSize: 15, color: kDark)),
              trailing: const Icon(Icons.chevron_right, color: kGray),
              onTap: () {},
            ),
            SafeArea(
              top: false,
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => widget.onApply(_selected),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: kDark,
                    foregroundColor: kWhite,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    textStyle: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w600),
                  ),
                  child: const Text('Apply Filters'),
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}