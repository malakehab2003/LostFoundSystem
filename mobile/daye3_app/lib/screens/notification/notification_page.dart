
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/providers/notification_provider.dart';
import '../../core/model/notification_model.dart';
import '../../core/theme/app_colors.dart';

class NotificationsPage extends StatefulWidget {
const NotificationsPage({super.key});

@override
State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage>
with TickerProviderStateMixin {
@override
void initState() {
super.initState();

Future.microtask(() {
Provider.of<NotificationProvider>(
context,
listen: false,
).fetchNotifications();
});
}

String _timeAgo(DateTime date) {
final diff = DateTime.now().difference(date);

if (diff.inSeconds < 60) return "Just now";
if (diff.inMinutes < 60) return "${diff.inMinutes}m ago";
if (diff.inHours < 24) return "${diff.inHours}h ago";
if (diff.inDays < 7) return "${diff.inDays}d ago";

return "${date.day}/${date.month}/${date.year}";
}

@override
Widget build(BuildContext context) {
return Consumer<NotificationProvider>(
builder: (context, provider, _) {
final notifications = provider.notifications;
final unread = notifications.where((n) => !n.isRead).length;

return Scaffold(
backgroundColor: const Color(0xFFF5F7FB),

// ───────────────── APP BAR ─────────────────
body: SafeArea(
child: Column(
children: [
Container(
padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
decoration: BoxDecoration(
gradient: LinearGradient(
colors: [
AppColors.primary,
AppColors.primary.withOpacity(.85),
],
begin: Alignment.topLeft,
end: Alignment.bottomRight,
),
borderRadius: const BorderRadius.only(
bottomLeft: Radius.circular(30),
bottomRight: Radius.circular(30),
),
boxShadow: [
BoxShadow(
color: AppColors.primary.withOpacity(.25),
blurRadius: 24,
offset: const Offset(0, 10),
),
],
),
child: Column(
children: [
Row(
children: [
Container(
decoration: BoxDecoration(
color: Colors.white.withOpacity(.15),
borderRadius: BorderRadius.circular(14),
),
child: IconButton(
onPressed: () => Navigator.pop(context),
icon: const Icon(
Icons.arrow_back_ios_new_rounded,
color: Colors.white,
size: 18,
),
),
),

const Spacer(),

const Text(
"Notifications",
style: TextStyle(
color: Colors.white,
fontSize: 20,
fontWeight: FontWeight.w700,
),
),

const Spacer(),

Container(
padding: const EdgeInsets.all(12),
decoration: BoxDecoration(
color: Colors.white.withOpacity(.15),
borderRadius: BorderRadius.circular(14),
),
child: const Icon(
Icons.notifications_active_outlined,
color: Colors.white,
size: 20,
),
),
],
),

const SizedBox(height: 24),

// ───────── SUMMARY CARD ─────────
Container(
padding: const EdgeInsets.all(18),
decoration: BoxDecoration(
color: Colors.white.withOpacity(.14),
borderRadius: BorderRadius.circular(24),
border: Border.all(
color: Colors.white.withOpacity(.12),
),
),
child: Row(
children: [
Expanded(
child: _headerStat(
title: "Total",
value: "${notifications.length}",
icon: Icons.notifications_none_rounded,
),
),

Container(
width: 1,
height: 45,
color: Colors.white.withOpacity(.2),
),

Expanded(
child: _headerStat(
title: "Unread",
value: "$unread",
icon: Icons.mark_chat_unread_rounded,
),
),
],
),
),

if (unread > 0) ...[
const SizedBox(height: 16),

Align(
alignment: Alignment.centerRight,
child: GestureDetector(
onTap: () => provider.markAllAsRead(),
child: Container(
padding: const EdgeInsets.symmetric(
horizontal: 16,
vertical: 10,
),
decoration: BoxDecoration(
color: Colors.white,
borderRadius: BorderRadius.circular(14),
),
child: Row(
mainAxisSize: MainAxisSize.min,
children: const [
Icon(
Icons.done_all_rounded,
size: 18,
color: AppColors.primary,
),
SizedBox(width: 6),
Text(
"Mark all as read",
style: TextStyle(
color: AppColors.primary,
fontWeight: FontWeight.w600,
fontSize: 13,
),
),
],
),
),
),
),
],
],
),
),

// ───────────────── BODY ─────────────────
Expanded(
child: provider.isLoading
? const Center(
child: CircularProgressIndicator(),
)
    : notifications.isEmpty
? _emptyState()
    : RefreshIndicator(
color: AppColors.primary,
onRefresh: () =>
provider.fetchNotifications(),
child: ListView.builder(
physics:
const BouncingScrollPhysics(),
padding: const EdgeInsets.all(18),
itemCount: notifications.length,
itemBuilder: (_, index) {
return TweenAnimationBuilder(
duration: Duration(
milliseconds:
350 + (index * 80),
),
tween: Tween<double>(
begin: 0,
end: 1,
),
builder: (context, value, child) {
return Transform.translate(
offset:
Offset(0, 30 * (1 - value)),
child: Opacity(
opacity: value,
child: child,
),
);
},
child: _notificationCard(
context: context,
notification:
notifications[index],
provider: provider,
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
},
);
}

// ───────────────── HEADER STAT ─────────────────
Widget _headerStat({
required String title,
required String value,
required IconData icon,
}) {
return Column(
children: [
Container(
padding: const EdgeInsets.all(10),
decoration: BoxDecoration(
color: Colors.white.withOpacity(.12),
shape: BoxShape.circle,
),
child: Icon(
icon,
color: Colors.white,
size: 20,
),
),

const SizedBox(height: 10),

Text(
value,
style: const TextStyle(
color: Colors.white,
fontSize: 24,
fontWeight: FontWeight.bold,
),
),

const SizedBox(height: 4),

Text(
title,
style: TextStyle(
color: Colors.white.withOpacity(.8),
fontSize: 13,
),
),
],
);
}

// ───────────────── NOTIFICATION CARD ─────────────────
Widget _notificationCard({
required BuildContext context,
required NotificationModel notification,
required NotificationProvider provider,
}) {
final isRead = notification.isRead;

return GestureDetector(
onTap: () => provider.markAsRead(notification.id),
child: AnimatedContainer(
duration: const Duration(milliseconds: 250),
margin: const EdgeInsets.only(bottom: 16),
padding: const EdgeInsets.all(16),
decoration: BoxDecoration(
color: Colors.white,
borderRadius: BorderRadius.circular(24),
border: Border.all(
color: isRead
? Colors.grey.withOpacity(.08)
    : AppColors.primary.withOpacity(.18),
width: 1.3,
),
boxShadow: [
BoxShadow(
color: Colors.black.withOpacity(.04),
blurRadius: 18,
offset: const Offset(0, 8),
),
],
),
child: Row(
crossAxisAlignment: CrossAxisAlignment.start,
children: [
// ───────── ICON ─────────
Container(
width: 56,
height: 56,
decoration: BoxDecoration(
gradient: LinearGradient(
colors: isRead
? [
Colors.grey.shade200,
Colors.grey.shade100,
]
    : [
AppColors.primary,
AppColors.primary.withOpacity(.7),
],
begin: Alignment.topLeft,
end: Alignment.bottomRight,
),
borderRadius: BorderRadius.circular(18),
),
child: Icon(
_iconForEntity(notification.entity),
color: isRead ? Colors.grey.shade500 : Colors.white,
size: 26,
),
),

const SizedBox(width: 14),

// ───────── CONTENT ─────────
Expanded(
child: Column(
crossAxisAlignment:
CrossAxisAlignment.start,
children: [
Row(
crossAxisAlignment:
CrossAxisAlignment.start,
children: [
Expanded(
child: Text(
notification.message,
style: TextStyle(
fontSize: 15,
height: 1.3,
fontWeight: isRead
? FontWeight.w600
    : FontWeight.w800,
color: const Color(0xFF111827),
),
),
),

if (!isRead)
Container(
width: 10,
height: 10,
margin:
const EdgeInsets.only(top: 4),
decoration: const BoxDecoration(
color: AppColors.primary,
shape: BoxShape.circle,
),
),
],
),

const SizedBox(height: 8),

Text(
notification.description,
style: TextStyle(
fontSize: 13.5,
height: 1.5,
color: Colors.grey.shade600,
),
),

const SizedBox(height: 14),

Row(
children: [
Container(
padding: const EdgeInsets.all(6),
decoration: BoxDecoration(
color: Colors.grey.shade100,
shape: BoxShape.circle,
),
child: Icon(
Icons.schedule_rounded,
size: 14,
color: Colors.grey.shade500,
),
),

const SizedBox(width: 8),

Text(
_timeAgo(notification.createdAt),
style: TextStyle(
fontSize: 12.5,
fontWeight: FontWeight.w500,
color: Colors.grey.shade500,
),
),
],
),
],
),
),
],
),
),
);
}

// ───────────────── ICONS ─────────────────
IconData _iconForEntity(String entity) {
switch (entity) {
case 'item':
return Icons.inventory_2_rounded;

case 'comment':
return Icons.mode_comment_outlined;

case 'user':
return Icons.person_outline_rounded;

default:
return Icons.notifications_active_outlined;
}
}

// ───────────────── EMPTY STATE ─────────────────
Widget _emptyState() {
return Center(
child: Padding(
padding: const EdgeInsets.symmetric(horizontal: 30),
child: Column(
mainAxisAlignment: MainAxisAlignment.center,
children: [
Container(
width: 110,
height: 110,
decoration: BoxDecoration(
color: AppColors.primary.withOpacity(.08),
shape: BoxShape.circle,
),
child: Icon(
Icons.notifications_off_outlined,
size: 55,
color: AppColors.primary.withOpacity(.7),
),
),

const SizedBox(height: 26),

const Text(
"No Notifications Yet",
style: TextStyle(
fontSize: 22,
fontWeight: FontWeight.bold,
color: Color(0xFF111827),
),
),

const SizedBox(height: 10),

Text(
"You’re all caught up.\nNew updates and alerts will appear here.",
textAlign: TextAlign.center,
style: TextStyle(
fontSize: 14,
height: 1.6,
color: Colors.grey.shade500,
),
),
],
),
),
);
}
}

