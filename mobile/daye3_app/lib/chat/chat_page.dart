import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'chat_provider.dart';
import 'message_bubble.dart';
import 'chat_message.dart';
import '../core/theme/app_colors.dart';

class ChatPage extends StatefulWidget {
  final int chatId;
  final int currentUserId;

  const ChatPage({Key? key, required this.chatId, required this.currentUserId}) : super(key: key);

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _controller = TextEditingController();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadMessages();
  }

  Future<void> _loadMessages() async {
    await Provider.of<ChatProvider>(context, listen: false)
        .fetchMessages(widget.chatId);
    setState(() {
      _isLoading = false;
    });
  }

  void _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    final newMessage = ChatMessage(
      id: 0, // مؤقت، السيرفر هيرجع id الحقيقي
      chatId: widget.chatId,
      senderId: widget.currentUserId,
      content: text,
      isRead: false,
      createdAt: DateTime.now(),
      senderName: 'You',
    );

    _controller.clear();
    await Provider.of<ChatProvider>(context, listen: false)
        .sendMessage(newMessage);
  }

  @override
  Widget build(BuildContext context) {
    final messages = Provider.of<ChatProvider>(context).messages;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chat'),
        backgroundColor: AppColors.primary,
      ),
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
              reverse: false,
              itemCount: messages.length,
              itemBuilder: (ctx, index) {
                final msg = messages[index];
                return MessageBubble(
                  message: msg,
                  isMe: msg.senderId == widget.currentUserId,
                  myColor: AppColors.primary,
                  otherColor: AppColors.secondary,
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            color: AppColors.background,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration.collapsed(
                      hintText: 'Type a message...',
                      hintStyle: TextStyle(color: AppColors.textSecondary),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.send, color: AppColors.primary),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}