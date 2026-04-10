import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

// Import your existing files
import '../../components/app_bottom_nav.dart';          // your AppNavBar component
import 'organizations.dart'; // your OrganizationInfoScreen

// ─── Data Model ───────────────────────────────────────────────────────────────

class Organization {
  final String id;
  final String name;
  final List<String> tags;

  const Organization({
    required this.id,
    required this.name,
    required this.tags,
  });
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const _sampleOrgs = [
  Organization(id: '1', name: 'Organization Name', tags: ['Tags', 'Tags']),
  Organization(id: '2', name: 'Organization Name', tags: ['Tags', 'Tags']),
  Organization(id: '3', name: 'Organization Name', tags: ['Tags', 'Tags']),
  Organization(id: '4', name: 'Organization Name', tags: ['Tags', 'Tags']),
  Organization(id: '5', name: 'Organization Name', tags: ['Tags', 'Tags']),
  Organization(id: '6', name: 'Organization Name', tags: ['Tags', 'Tags']),
];

const _allCategories = [
  'All',
  'Music',
  'Food & Drink',
  'Business',
  'Religion & Spirituality',
  'Theater & Dance',
  'Social Justice & Human Rights',
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
  'Other',
];

// ─── Colors ───────────────────────────────────────────────────────────────────

const kYellow     = Color(0xFFF5C842);
const kDark       = Color(0xFF1A1A1A);
const kGray       = Color(0xFF9E9E9E);
const kLightGray  = Color(0xFFF0F0F0);
const kBorderGray = Color(0xFFE0E0E0);
const kHeaderBg   = Color(0xFFD9D9D9);
const kWhite      = Colors.white;

// ─── Main Screen ──────────────────────────────────────────────────────────────

class SearchOrganization extends StatefulWidget {
  const SearchOrganization({super.key});

  @override
  State<SearchOrganization> createState() => _SearchOrganizationState();
}

class _SearchOrganizationState extends State<SearchOrganization> {
  String _selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // ── Navigate to Organization Info page ──
  void _goToOrgInfo(Organization org) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => OrganizationScreen(),
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
          }
          Navigator.pop(context);
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
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(80), // Keep the height for spacing
          child: Container(
            color: kWhite, // White background for top section
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
                child: Align(
                  alignment: Alignment.bottomLeft,
                ),
              ),
            ),
          ),
        ),

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
                      fontSize: 28, // Adjusted size for typography
                      fontFamily: 'League Spartan',
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                      color: kDark,
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Search bar
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
                        prefixIcon:
                        Icon(Icons.search, size: 18, color: kGray),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Category chips + filter icon
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
                                  onTap: () => setState(
                                          () => _selectedCategory = cat),
                                  child: AnimatedContainer(
                                    duration:
                                    const Duration(milliseconds: 180),
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 14, vertical: 7),
                                    decoration: BoxDecoration(
                                      color: isSelected ? kYellow : kWhite,
                                      borderRadius:
                                      BorderRadius.circular(20),
                                      border: Border.all(
                                        color: isSelected
                                            ? kYellow
                                            : kBorderGray,
                                      ),
                                    ),
                                    child: Text(
                                      cat,
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: isSelected
                                            ? FontWeight.w600
                                            : FontWeight.w400,
                                        color:
                                        isSelected ? kDark : kGray,
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

                  const Text(
                    'Showing 1,232 results',
                    style: TextStyle(fontSize: 12, color: kGray),
                  ),
                ],
              ),
            ),

            // ── List ──
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: _sampleOrgs.length,
                separatorBuilder: (_, __) =>
                const Divider(height: 1, color: kBorderGray),
                itemBuilder: (_, index) => _OrgCard(
                  org: _sampleOrgs[index],
                  onViewPage: () => _goToOrgInfo(_sampleOrgs[index]),
                ),
              ),
            ),
          ],
        ),


      ),
    );
  }
}



class _OrgCard extends StatelessWidget {
  final Organization org;
  final VoidCallback onViewPage;

  const _OrgCard({required this.org, required this.onViewPage});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail
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
                const SizedBox(height: 6),
                Row(
                  children: org.tags.map((tag) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 3),
                        decoration: BoxDecoration(
                          color: kLightGray,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(tag,
                            style: const TextStyle(
                                fontSize: 11, color: kGray)),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    // ── View Page → navigates to OrganizationInfoScreen ──
                    GestureDetector(
                      onTap: onViewPage,
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text('View Page',
                              style: TextStyle(fontSize: 12, color: Colors.black)),
                          SizedBox(width: 2),
                          Icon(Icons.chevron_right,
                              size: 14, color: kGray),
                        ],
                      ),
                    ),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: kDark,
                        foregroundColor: kWhite,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 22, vertical: 9),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20)),
                        textStyle: const TextStyle(
                            fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                      child: const Text('Join'),
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