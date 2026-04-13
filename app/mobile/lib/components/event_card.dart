import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class EventCard extends StatelessWidget {
  final Map<String, dynamic> event;
  final double width;
  final VoidCallback? onTap;

  const EventCard({
    super.key,
    required this.event,
    this.width = 178,
    this.onTap,
  });

  String _formatDate(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return 'Date TBD';
    try {
      final dt = DateTime.parse(dateStr).toLocal();
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      final hour = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
      final ampm = dt.hour >= 12 ? 'PM' : 'AM';
      return '${days[dt.weekday - 1]}, ${months[dt.month - 1]} ${dt.day} · $hour $ampm';
    } catch (_) {
      return 'Date TBD';
    }
  }

  @override
  Widget build(BuildContext context) {
    final isRSO = event['isRSO'] == true;
    final orgName = isRSO
        ? (event['organizationName'] ?? event['organizationId'] ?? 'Organization').toString()
        : null;
    final title = (event['title'] ?? 'Event Title').toString();
    final location = (event['location'] ?? 'Location TBD').toString();
    final date = _formatDate(event['startDate']?.toString());
    final flyer = event['flyer']?.toString();

    final eventId = event['_id']?.toString();

    return GestureDetector(
      onTap: onTap ??
          (eventId != null
              ? () => Navigator.pushNamed(context, '/event/$eventId')
              : null),
      child: Container(
        width: width,
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFEAEAEA)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Flyer image
            SizedBox(
              height: 155,
              width: double.infinity,
              child: flyer != null
                  ? Image.network(
                      flyer,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => _placeholder(),
                    )
                  : _placeholder(),
            ),
            // Info
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (orgName != null) ...[
                      Text(
                        orgName.toUpperCase(),
                        style: GoogleFonts.bebasNeue(
                          fontSize: 11,
                          color: AppColors.primary,
                          letterSpacing: 0.8,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 3),
                    ],
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppColors.black,
                        height: 1.3,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      date,
                      style: const TextStyle(
                        fontSize: 10,
                        color: AppColors.textMuted,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on_outlined,
                          size: 10,
                          color: AppColors.textMuted,
                        ),
                        const SizedBox(width: 2),
                        Expanded(
                          child: Text(
                            location,
                            style: const TextStyle(
                              fontSize: 10,
                              color: AppColors.textMuted,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
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
    );
  }

  Widget _placeholder() {
    return Container(
      color: AppColors.inputFill,
      child: const Center(
        child: Icon(Icons.image_outlined, color: AppColors.textMuted, size: 28),
      ),
    );
  }
}
