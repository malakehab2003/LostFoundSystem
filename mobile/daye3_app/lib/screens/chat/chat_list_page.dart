import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/utils/chat_service.dart';
import '../../core/providers/user_provider.dart';
import 'chat_page.dart';

class ChatListPage extends StatefulWidget {
  const ChatListPage({super.key});

  @override
  State<ChatListPage> createState() => _ChatListPageState();
}

class _ChatListPageState extends State<ChatListPage> {
  final ChatService _chatService = ChatService();
  List<dynamic> _chats = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadChats();
  }

  Future<void> _loadChats() async {
    setState(() => _loading = true);
    final chats = await _chatService.getChatList();

    // ── Sort: latest message always on top ──────────────────────────────
    chats.sort((a, b) {
      final aTime = _parseTime(a['last_message_time']);
      final bTime = _parseTime(b['last_message_time']);
      return bTime.compareTo(aTime);
    });

    setState(() {
      _chats = chats;
      _loading = false;
    });
  }

  DateTime _parseTime(dynamic raw) {
    if (raw == null) return DateTime.fromMillisecondsSinceEpoch(0);
    try {
      return DateTime.parse(raw.toString()).toLocal();
    } catch (_) {
      return DateTime.fromMillisecondsSinceEpoch(0);
    }
  }

  String _getInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    } else if (parts.isNotEmpty && parts[0].isNotEmpty) {
      return parts[0][0].toUpperCase();
    }
    return '?';
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  }

  String _formatTime(dynamic raw) {
    if (raw == null) return '';
    try {
      final dt = DateTime.parse(raw.toString()).toLocal();
      final now = DateTime.now();
      final diff = now.difference(dt);

      if (diff.inMinutes < 1) return 'Now';
      if (diff.inMinutes < 60) return '${diff.inMinutes}m';
      if (diff.inHours < 24 && dt.day == now.day) {
        final h = dt.hour.toString().padLeft(2, '0');
        final m = dt.minute.toString().padLeft(2, '0');
        return '$h:$m';
      }
      if (diff.inDays == 1) return 'Yesterday';
      if (diff.inDays < 7) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days[dt.weekday - 1];
      }
      return '${dt.day}/${dt.month}';
    } catch (_) {
      return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F7),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        automaticallyImplyLeading: false,
        titleSpacing: 20,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              _getGreeting(),
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade500,
                fontWeight: FontWeight.w400,
              ),
            ),
            const Text(
              'Messages',
              style: TextStyle(
                color: Color(0xFF1A1A2E),
                fontWeight: FontWeight.w800,
                fontSize: 22,
                letterSpacing: -0.5,
              ),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 8),
            width: 36,
            height: 36,
            decoration: const BoxDecoration(
              color: Color(0xFFF4F4F8),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.search_rounded,
              color: Color(0xFF555555),
              size: 18,
            ),
          ),
          Container(
            margin: const EdgeInsets.only(right: 16),
            width: 36,
            height: 36,
            decoration: const BoxDecoration(
              color: Color(0xFFEDE8FD),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.edit_outlined,
              color: Color(0xFF5B21B6),
              size: 18,
            ),
          ),
        ],
      ),
      body: _loading
          ? const Center(
        child: CircularProgressIndicator(color: Colors.deepPurple),
      )
          : _chats.isEmpty
          ? Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: const BoxDecoration(
                color: Color(0xFFEDE8FD),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.chat_bubble_outline_rounded,
                color: Color(0xFF7C3AED),
                size: 32,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'No conversations yet',
              style: TextStyle(
                color: Color(0xFF1A1A2E),
                fontWeight: FontWeight.w700,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Start a new chat to get going',
              style: TextStyle(
                color: Colors.grey.shade500,
                fontSize: 13,
              ),
            ),
          ],
        ),
      )
          : RefreshIndicator(
        color: Colors.deepPurple,
        onRefresh: _loadChats,
        child: CustomScrollView(
          slivers: [
            // ── Search Bar ──────────────────────────────────────
            SliverToBoxAdapter(
              child: Container(
                color: Colors.white,
                padding:
                const EdgeInsets.fromLTRB(16, 8, 16, 14),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF4F4F8),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.search_rounded,
                          color: Colors.grey.shade400, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        'Search conversations...',
                        style: TextStyle(
                          color: Colors.grey.shade400,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // ── Section Label ───────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding:
                const EdgeInsets.fromLTRB(20, 16, 20, 6),
                child: Text(
                  'ALL MESSAGES',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade500,
                    letterSpacing: 0.8,
                  ),
                ),
              ),
            ),

            // ── Chat List ───────────────────────────────────────
            SliverPadding(
              padding:
              const EdgeInsets.symmetric(horizontal: 12),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                      (context, index) {
                    final chat = _chats[index];
                    final otherUser = chat['other_user'];
                    final lastMessage = chat['last_message'];
                    final int unread = chat['unread'] ?? 0;
                    final bool isUnread = unread > 0;

                    // I sent the last message and they haven't seen it
                    final bool iSentLast =
                        chat['i_sent_last'] == true;
                    final bool notSeenByThem =
                        iSentLast && (chat['seen'] == false);

                    final initials =
                    _getInitials(otherUser['name'] ?? '');

                    return GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => ChatPage(
                              chatId: chat['chat_id'],
                              otherUserName:
                              otherUser['name'] ?? '',
                              otherUserId: otherUser['id'],
                            ),
                          ),
                        ).then((_) => _loadChats());
                      },
                      child: _ChatTile(
                        initials: initials,
                        name: otherUser['name'] ?? '',
                        lastMessage:
                        lastMessage ?? 'No messages yet',
                        time: _formatTime(
                            chat['last_message_time']),
                        unread: unread,
                        isUnread: isUnread,
                        iSentAndNotSeen: notSeenByThem,
                      ),
                    );
                  },
                  childCount: _chats.length,
                ),
              ),
            ),

            const SliverToBoxAdapter(
              child: SizedBox(height: 80),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// _ChatTile — handles all 3 states:
//   1. isUnread      → they sent, I haven't read   → purple badge + bold
//   2. iSentNotSeen  → I sent, they haven't seen   → grey double-tick
//   3. normal        → seen by both sides           → blue double-tick
// ─────────────────────────────────────────────────────────────────────────────

class _ChatTile extends StatelessWidget {
  final String initials;
  final String name;
  final String lastMessage;
  final String time;
  final int unread;
  final bool isUnread;
  final bool iSentAndNotSeen;

  const _ChatTile({
    required this.initials,
    required this.name,
    required this.lastMessage,
    required this.time,
    required this.unread,
    required this.isUnread,
    required this.iSentAndNotSeen,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(
        // Unread from them → light purple tint background
        color: isUnread ? const Color(0xFFFAF8FF) : Colors.white,
        borderRadius: BorderRadius.circular(18),
        // I sent but not seen → subtle left accent border
        border: iSentAndNotSeen
            ? Border(
          left: BorderSide(
            color: Colors.deepPurple.shade200,
            width: 3,
          ),
        )
            : null,
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            // ── Avatar ─────────────────────────────────────────────────
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.deepPurple,
                    Colors.deepPurple.withOpacity(0.7),
                  ],
                ),
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              child: Text(
                initials,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
            ),

            const SizedBox(width: 14),

            // ── Name + Last Message ─────────────────────────────────────
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: TextStyle(
                      // Bold name when unread
                      fontWeight: isUnread
                          ? FontWeight.w800
                          : FontWeight.w600,
                      fontSize: 14,
                      color: const Color(0xFF1A1A2E),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      // Tick icons for messages I sent
                      if (iSentAndNotSeen) ...[
                        // Grey ticks → not seen yet
                        Icon(
                          Icons.done_all_rounded,
                          size: 14,
                          color: Colors.grey.shade400,
                        ),
                        const SizedBox(width: 4),
                      ] else if (!isUnread) ...[
                        // Blue/purple ticks → seen
                        Icon(
                          Icons.done_all_rounded,
                          size: 14,
                          color: Colors.deepPurple.shade300,
                        ),
                        const SizedBox(width: 4),
                      ],
                      Expanded(
                        child: Text(
                          lastMessage,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 12,
                            // Darker + bolder text when unread
                            color: isUnread
                                ? Colors.grey.shade700
                                : Colors.grey.shade400,
                            fontWeight: isUnread
                                ? FontWeight.w600
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(width: 8),

            // ── Time + Unread Badge ─────────────────────────────────────
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  time,
                  style: TextStyle(
                    fontSize: 11,
                    // Purple time when unread, grey otherwise
                    color: isUnread
                        ? const Color(0xFF7C3AED)
                        : Colors.grey.shade400,
                    fontWeight: isUnread
                        ? FontWeight.w700
                        : FontWeight.normal,
                  ),
                ),
                const SizedBox(height: 6),
                if (isUnread)
                  Container(
                    width: 20,
                    height: 20,
                    decoration: const BoxDecoration(
                      color: Color(0xFF7C3AED),
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      unread > 9 ? '9+' : unread.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  )
                else
                  const SizedBox(height: 20),
              ],
            ),
          ],
        ),
      ),
    );
  }
}