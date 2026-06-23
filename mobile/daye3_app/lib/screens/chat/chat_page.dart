import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../core/providers/user_provider.dart';
import '../../core/utils/chat_service.dart';

class ChatPage extends StatefulWidget {
  final int chatId;
  final String otherUserName;
  final int otherUserId;

  const ChatPage({
    super.key,
    required this.chatId,
    required this.otherUserName,
    required this.otherUserId,
  });

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final ChatService _chatService = ChatService();

  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  List<dynamic> _messages = [];

  bool _loading = true;
  bool _sending = false;

  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();

    _loadMessages();

    _refreshTimer = Timer.periodic(
      const Duration(seconds: 3),
          (_) => _loadMessages(silent: true),
    );
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadMessages({bool silent = false}) async {
    if (!silent) {
      setState(() => _loading = true);
    }

    final messages = await _chatService.getMessages(widget.chatId);

    if (!mounted) return;

    final isAtBottom = _scrollController.hasClients &&
        _scrollController.position.maxScrollExtent -
            _scrollController.offset <
            80;

    setState(() {
      _messages = messages;
      if (!silent) _loading = false;
    });

    if (!silent || isAtBottom) {
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 200), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();

    if (text.isEmpty) return;

    HapticFeedback.lightImpact();

    setState(() => _sending = true);

    _controller.clear();

    final success = await _chatService.sendMessage(
      widget.chatId,
      text,
    );

    if (success) {
      await _loadMessages();
    }

    if (mounted) {
      setState(() => _sending = false);
    }
  }

  // ─────────────────────────────────────────────
  // AVATAR
  // ─────────────────────────────────────────────

  Widget _buildAvatar(String name, {double size = 40}) {
    final parts = name.trim().split(' ');

    String initials = '?';

    if (parts.length >= 2) {
      initials =
          '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    } else if (parts.isNotEmpty && parts[0].isNotEmpty) {
      initials = parts[0][0].toUpperCase();
    }

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.deepPurple,
            Colors.deepPurple.withOpacity(0.7),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.deepPurple.withOpacity(0.28),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      alignment: Alignment.center,
      child: Text(
        initials,
        style: TextStyle(
          color: Colors.white,
          fontSize: size * 0.35,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────
  // TIME FORMAT
  // ─────────────────────────────────────────────

  String _formatTime(String? raw) {
    if (raw == null || raw.isEmpty) return '';

    try {
      final dt = DateTime.parse(raw).toLocal();

      final h = dt.hour.toString().padLeft(2, '0');
      final m = dt.minute.toString().padLeft(2, '0');

      return '$h:$m';
    } catch (_) {
      return '';
    }
  }

  // ─────────────────────────────────────────────
  // DATE CHECK
  // ─────────────────────────────────────────────

  bool _isDifferentDay(String? a, String? b) {
    if (a == null || b == null) return false;

    try {
      final da = DateTime.parse(a).toLocal();
      final db = DateTime.parse(b).toLocal();

      return da.day != db.day ||
          da.month != db.month ||
          da.year != db.year;
    } catch (_) {
      return false;
    }
  }

  Widget _buildDateSeparator(String? raw) {
    String label = '';

    if (raw != null) {
      try {
        final dt = DateTime.parse(raw).toLocal();
        final now = DateTime.now();

        final diff = now.difference(dt).inDays;

        if (diff == 0) {
          label = 'Today';
        } else if (diff == 1) {
          label = 'Yesterday';
        } else {
          label = '${dt.day}/${dt.month}/${dt.year}';
        }
      } catch (_) {}
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 18),
      child: Row(
        children: [
          Expanded(
            child: Container(
              height: 1,
              color: Colors.grey.withOpacity(0.15),
            ),
          ),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 14,
              vertical: 6,
            ),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 8,
                ),
              ],
            ),
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Container(
              height: 1,
              color: Colors.grey.withOpacity(0.15),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentUserId =
        Provider.of<UserProvider>(context).user?.id;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FB),
      extendBodyBehindAppBar: true,

      // ─────────────────────────────────────────
      // APP BAR
      // ─────────────────────────────────────────

      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(72),
        child: ClipRRect(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.85),
                border: Border(
                  bottom: BorderSide(
                    color: Colors.grey.withOpacity(0.12),
                  ),
                ),
              ),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(8, 8, 16, 8),
                  child: Row(
                    children: [
                      IconButton(
                        onPressed: () {
                          HapticFeedback.lightImpact();
                          Navigator.pop(context);
                        },
                        icon: const Icon(
                          Icons.arrow_back_ios_new_rounded,
                          size: 20,
                          color: Colors.black87,
                        ),
                      ),

                      _buildAvatar(widget.otherUserName),

                      const SizedBox(width: 12),

                      Expanded(
                        child: Column(
                          mainAxisAlignment:
                          MainAxisAlignment.center,
                          crossAxisAlignment:
                          CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.otherUserName.trim(),
                              style: const TextStyle(
                                color: Colors.black87,
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                letterSpacing: -0.3,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                Container(
                                  width: 7,
                                  height: 7,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF3BAB72),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 5),
                                const Text(
                                  'Online',
                                  style: TextStyle(
                                    color: Color(0xFF3BAB72),
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
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
              ),
            ),
          ),
        ),
      ),

      // ─────────────────────────────────────────
      // BODY
      // ─────────────────────────────────────────

      body: Column(
        children: [
          Expanded(
            child: _loading
                ? Center(
              child: CircularProgressIndicator(
                color: Colors.deepPurple.withOpacity(0.7),
                strokeWidth: 2.5,
              ),
            )
                : _messages.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
              controller: _scrollController,
              padding: EdgeInsets.only(
                top:
                MediaQuery.of(context).padding.top +
                    88,
                left: 16,
                right: 16,
                bottom: 16,
              ),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];

                final isMe =
                    msg['sender_id'] == currentUserId;

                final time =
                _formatTime(msg['created_at']);

                final showDate = index == 0 ||
                    _isDifferentDay(
                      _messages[index - 1]
                      ['created_at'],
                      msg['created_at'],
                    );

                return Column(
                  children: [
                    if (showDate)
                      _buildDateSeparator(
                        msg['created_at'],
                      ),

                    _buildMessageBubble(
                      isMe: isMe,
                      content: msg['content'] ?? '',
                      time: time,
                    ),
                  ],
                );
              },
            ),
          ),

          _buildInputBar(),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────
  // EMPTY STATE
  // ─────────────────────────────────────────────

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: Colors.deepPurple.withOpacity(0.08),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.waving_hand_rounded,
              color: Colors.deepPurple,
              size: 34,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Say hi! 👋',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Start the conversation',
            style: TextStyle(
              fontSize: 13,
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────
  // MESSAGE BUBBLE
  // ─────────────────────────────────────────────

  Widget _buildMessageBubble({
    required bool isMe,
    required String content,
    required String time,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment:
        isMe
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isMe) ...[
            _buildAvatar(widget.otherUserName, size: 34),
            const SizedBox(width: 8),
          ],

          Flexible(
            child: Column(
              crossAxisAlignment:
              isMe
                  ? CrossAxisAlignment.end
                  : CrossAxisAlignment.start,
              children: [
                Container(
                  constraints: BoxConstraints(
                    maxWidth:
                    MediaQuery.of(context).size.width *
                        0.68,
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 11,
                  ),
                  decoration: BoxDecoration(
                    gradient: isMe
                        ? const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.deepPurple,
                        Color(0xFF7B6FEE),
                      ],
                    )
                        : null,
                    color: isMe ? null : Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(20),
                      topRight: const Radius.circular(20),
                      bottomLeft:
                      Radius.circular(isMe ? 20 : 4),
                      bottomRight:
                      Radius.circular(isMe ? 4 : 20),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isMe
                            ? Colors.deepPurple.withOpacity(0.25)
                            : Colors.black.withOpacity(0.05),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Text(
                    content,
                    style: TextStyle(
                      color:
                      isMe
                          ? Colors.white
                          : Colors.black87,
                      fontSize: 14.5,
                      height: 1.45,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),

                const SizedBox(height: 4),

                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      time,
                      style: TextStyle(
                        color: Colors.grey.shade400,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    if (isMe) ...[
                      const SizedBox(width: 4),
                      const Icon(
                        Icons.done_all_rounded,
                        size: 14,
                        color: Colors.deepPurple,
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────
  // INPUT BAR
  // ─────────────────────────────────────────────

  Widget _buildInputBar() {
    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: EdgeInsets.fromLTRB(
            16,
            10,
            16,
            MediaQuery.of(context).padding.bottom + 12,
          ),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.9),
            border: Border(
              top: BorderSide(
                color: Colors.grey.withOpacity(0.12),
              ),
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFF4F7FB),
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(
                      color: Colors.grey.withOpacity(0.15),
                    ),
                  ),
                  child: TextField(
                    controller: _controller,
                    textCapitalization:
                    TextCapitalization.sentences,
                    minLines: 1,
                    maxLines: 4,
                    style: const TextStyle(
                      fontSize: 14.5,
                      color: Colors.black87,
                      fontWeight: FontWeight.w500,
                    ),
                    decoration: const InputDecoration(
                      hintText: 'Type a message...',
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 18,
                        vertical: 12,
                      ),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
              ),

              const SizedBox(width: 10),

              GestureDetector(
                onTap: _sending ? null : _sendMessage,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.deepPurple,
                        Color(0xFF7B6FEE),
                      ],
                    ),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.deepPurple.withOpacity(0.35),
                        blurRadius: 14,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: _sending
                      ? const Padding(
                    padding: EdgeInsets.all(13),
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 2,
                    ),
                  )
                      : const Icon(
                    Icons.send_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
