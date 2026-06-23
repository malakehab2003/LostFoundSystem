import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../../core/model/comment_model.dart';
import '../../core/model/item_model.dart';
import '../../core/providers/user_provider.dart';
import '../../core/utils/comment_service.dart';
import '../../core/utils/chat_service.dart';
import '../../core/theme/app_colors.dart';
import '../chat/chat_page.dart';

// ─────────────────────────────────────────────
// TOP-LEVEL CONSTANTS
// ─────────────────────────────────────────────

const Color cardColor   = Color(0xFFF8F8FC);
const Color borderColor = Color(0xFFE9E9F2);

// ─────────────────────────────────────────────

class ItemDetailsPage extends StatefulWidget {
  final ItemModel item;
  final String currentUserId;

  const ItemDetailsPage({
    super.key,
    required this.item,
    required this.currentUserId,
  });

  @override
  State<ItemDetailsPage> createState() => _ItemDetailsPageState();
}

class _ItemDetailsPageState extends State<ItemDetailsPage>
    with TickerProviderStateMixin {

  final commentController  = TextEditingController();
  final commentService     = CommentService();
  final chatService        = ChatService();
  final FocusNode commentFocusNode = FocusNode();
  final ScrollController scrollController = ScrollController();
  final PageController imagePageController = PageController();

  List<CommentModel> comments = [];
  bool isLoading = false;
  bool isChatLoading = false;
  int currentImageIndex = 0;

  Timer? commentTimer;

  late AnimationController pageAnimationController;
  late Animation<double> fadeAnimation;

  late AnimationController sendButtonController;
  late Animation<double> sendButtonScale;

  static const String baseImageUrl = "http://10.0.2.2:5000/uploads/";

  // ─── helper ────────────────────────────────

  String _resolveUrl(dynamic raw) {
    final s = raw.toString();
    return s.startsWith('http') ? s : baseImageUrl + s;
  }

  List<String> get imageUrls {
    if (widget.item.images.isEmpty) return [];
    return widget.item.images.map(_resolveUrl).toList();
  }

  // ─────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────

  @override
  void initState() {
    super.initState();

    pageAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    fadeAnimation = CurvedAnimation(
      parent: pageAnimationController,
      curve: Curves.easeOutCubic,
    );

    sendButtonController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 120),
      lowerBound: 0.92,
      upperBound: 1,
      value: 1,
    );
    sendButtonScale = CurvedAnimation(
      parent: sendButtonController,
      curve: Curves.easeOut,
    );

    pageAnimationController.forward();
    loadComments();

    commentTimer = Timer.periodic(
      const Duration(seconds: 5),
          (_) => loadComments(silent: true),
    );
  }

  @override
  void dispose() {
    commentController.dispose();
    commentFocusNode.dispose();
    scrollController.dispose();
    imagePageController.dispose();
    pageAnimationController.dispose();
    sendButtonController.dispose();
    commentTimer?.cancel();
    super.dispose();
  }

  // ─────────────────────────────────────────────
  // LOAD COMMENTS
  // ─────────────────────────────────────────────

  Future<void> loadComments({bool silent = false}) async {
    if (!silent) setState(() => isLoading = true);

    final token =
        Provider.of<UserProvider>(context, listen: false).token;

    try {
      final data = await commentService.getComments(
        widget.item.id,
        token: token,
      );
      if (!mounted) return;
      setState(() => comments = data);
    } catch (e) {
      debugPrint("LOAD COMMENTS ERROR: $e");
    }

    if (!silent && mounted) setState(() => isLoading = false);
  }

  // ─────────────────────────────────────────────
  // OPEN CHAT
  // ─────────────────────────────────────────────

  Future<void> openChat() async {
    setState(() => isChatLoading = true);

    try {
      final result = await chatService.createChat(widget.item.userId);
      if (!mounted) return;

      if (result != null) {
        final chatId = result['newChat']['id'];
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ChatPage(
              chatId: chatId,
              otherUserName: widget.item.userName,
              otherUserId: widget.item.userId,
            ),
          ),
        );
      } else {
        showSnack('Failed to open chat', isError: true);
      }
    } catch (e) {
      showSnack('Failed to open chat', isError: true);
    }

    if (mounted) setState(() => isChatLoading = false);
  }

  // ─────────────────────────────────────────────
  // SEND COMMENT
  // ─────────────────────────────────────────────

  Future<void> sendComment() async {
    if (commentController.text.trim().isEmpty) return;

    HapticFeedback.lightImpact();

    final text  = commentController.text.trim();
    final token =
        Provider.of<UserProvider>(context, listen: false).token;

    if (token.isEmpty) {
      showSnack("You must login first", isError: true);
      return;
    }

    await sendButtonController.reverse();
    await sendButtonController.forward();

    commentController.clear();
    commentFocusNode.unfocus();

    try {
      final newComment = await commentService.createComment(
        itemId: widget.item.id,
        content: text,
        token: token,
      );
      if (!mounted) return;
      setState(() => comments.insert(0, newComment));
      showSnack("Comment added");
    } catch (e) {
      showSnack("Failed to send comment", isError: true);
    }
  }

  // ─────────────────────────────────────────────
  // DELETE COMMENT
  // ─────────────────────────────────────────────

  Future<void> deleteComment(int id) async {
    final token =
        Provider.of<UserProvider>(context, listen: false).token;
    if (token.isEmpty) return;

    try {
      await commentService.deleteComment(id: id, token: token);
      if (!mounted) return;
      HapticFeedback.mediumImpact();
      setState(() => comments.removeWhere((c) => c.id == id));
      showSnack("Comment deleted");
    } catch (e) {
      showSnack("Delete failed", isError: true);
    }
  }

  // ─────────────────────────────────────────────
  // SNACKBAR
  // ─────────────────────────────────────────────

  void showSnack(String text, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: Colors.white,
        elevation: 8,
        margin: const EdgeInsets.all(18),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: BorderSide(
            color: isError
                ? Colors.red.withOpacity(.15)
                : borderColor,
          ),
        ),
        content: Row(
          children: [
            Icon(
              isError
                  ? Icons.error_outline_rounded
                  : Icons.check_circle_outline_rounded,
              color: isError ? Colors.red : AppColors.primary,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                text,
                style: const TextStyle(
                  color: AppColors.foreground,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────
  // BUILD
  // ─────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      extendBodyBehindAppBar: true,
      extendBody: true,
      body: FadeTransition(
        opacity: fadeAnimation,
        child: Stack(
          children: [
            CustomScrollView(
              controller: scrollController,
              physics: const BouncingScrollPhysics(),
              slivers: [

                // ── Image Gallery ─────────────────
                SliverToBoxAdapter(child: buildImageGallery()),

                // ── Details card ──────────────────
                SliverToBoxAdapter(child: buildDetails()),

                // ── Info grid ─────────────────────
                SliverToBoxAdapter(child: buildInfoGrid()),

                // ── Comments header ───────────────
                SliverToBoxAdapter(child: buildCommentsHeader()),

                // ── Comments list ─────────────────
                if (isLoading)
                  const SliverToBoxAdapter(child: CommentsLoading())
                else if (comments.isEmpty)
                  const SliverToBoxAdapter(child: EmptyComments())
                else
                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                          (_, i) => buildCommentCard(comments[i]),
                      childCount: comments.length,
                    ),
                  ),

                const SliverToBoxAdapter(
                  child: SizedBox(height: 150),
                ),
              ],
            ),

            // ── Sticky comment input ──────────────
            Align(
              alignment: Alignment.bottomCenter,
              child: buildCommentInput(),
            ),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────
  // IMAGE GALLERY
  // ─────────────────────────────────────────────

  Widget buildImageGallery() {
    final urls = imageUrls;

    return SizedBox(
        height: 300,
        width: double.infinity,
        child: Stack(
          fit: StackFit.expand,
          children: [

            // ── Main image ────────────────────────────
            urls.isEmpty
                ? _imageFallback()
                : PageView.builder(
              controller: imagePageController,
              itemCount: urls.length,
              onPageChanged: (i) =>
                  setState(() => currentImageIndex = i),
              itemBuilder: (_, i) => Image.network(
                urls[i],
                fit: BoxFit.cover,
                loadingBuilder: (_, child, progress) {
                  if (progress == null) return child;
                  return Container(
                    color: cardColor,
                    child: Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppColors.primary,
                        value: progress.expectedTotalBytes != null
                            ? progress.cumulativeBytesLoaded /
                            progress.expectedTotalBytes!
                            : null,
                      ),
                    ),
                  );
                },
                errorBuilder: (_, __, ___) => _imageFallback(),
              ),
            ),

            // ── Back button ───────────────────────────
            Positioned(
              top: MediaQuery.of(context).padding.top + 12,
              left: 16,
              child: _blurButton(
                icon: Icons.arrow_back_ios_new_rounded,
                onTap: () {
                  HapticFeedback.lightImpact();
                  Navigator.pop(context);
                },
              ),
            ),

            // ── Photo counter (top-right) ─────────────
            if (urls.length > 1)
              Positioned(
                top: MediaQuery.of(context).padding.top + 12,
                right: 16,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 13, vertical: 7,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(.35),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.photo_library_outlined,
                            color: Colors.white,
                            size: 12,
                          ),
                          const SizedBox(width: 5),
                          Text(
                            "${currentImageIndex + 1} / ${urls.length}",
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

            // ── Dot indicators ────────────────────────
            if (urls.length > 1)
              Positioned(
                bottom: 20,
                left: 0,
                right: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    urls.length,
                        (i) => GestureDetector(
                      onTap: () => imagePageController.animateToPage(
                        i,
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeOut,
                      ),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeOut,
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        width: i == currentImageIndex ? 24 : 7,
                        height: 7,
                        decoration: BoxDecoration(
                          color: i == currentImageIndex
                              ? AppColors.primary
                              : AppColors.primary.withOpacity(.30),
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        )
    );
  }

  Widget _imageFallback() {
    return Container(
      color: cardColor,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.image_not_supported_outlined,
              color: AppColors.textSecondary.withOpacity(.45),
              size: 52,
            ),
            const SizedBox(height: 10),
            Text(
              "No image available",
              style: TextStyle(
                color: AppColors.textSecondary.withOpacity(.65),
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _blurButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Material(
          color: Colors.black.withOpacity(.28),
          child: InkWell(
            onTap: onTap,
            child: SizedBox(
              width: 44,
              height: 44,
              child: Icon(icon, color: Colors.white, size: 17),
            ),
          ),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────
  // THUMBNAIL STRIP
  // ─────────────────────────────────────────────

  Widget buildThumbnailStrip() {
    final urls = imageUrls;
    if (urls.length <= 1) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: SizedBox(
        height: 68,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          itemCount: urls.length,
          itemBuilder: (_, i) {
            final selected = i == currentImageIndex;
            return GestureDetector(
              onTap: () {
                HapticFeedback.selectionClick();
                imagePageController.animateToPage(
                  i,
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeOut,
                );
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 220),
                curve: Curves.easeOut,
                margin: const EdgeInsets.only(right: 10),
                width: 68,
                height: 68,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: selected ? AppColors.primary : borderColor,
                    width: selected ? 2.5 : 1.5,
                  ),
                  boxShadow: selected
                      ? [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(.22),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ]
                      : [],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(11),
                  child: Image.network(
                    urls[i],
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      color: cardColor,
                      child: const Icon(
                        Icons.broken_image_outlined,
                        color: AppColors.textSecondary,
                        size: 20,
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────
  // DETAILS CARD
  // ─────────────────────────────────────────────

  Widget buildDetails() {
    final item = widget.item;

    final bool isLost = item.type.toLowerCase() == 'lost';
    final Color typeColor =
    isLost ? const Color(0xFFE05252) : const Color(0xFF3BAB72);
    final Color typeBg =
    isLost ? const Color(0xFFFFF0F0) : const Color(0xFFECFAF3);

    final bool isOwner = item.userId.toString() == widget.currentUserId;

    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 0, 18, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          buildThumbnailStrip(),

          // ── Main white card ────────────────────
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: borderColor),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(.045),
                  blurRadius: 28,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                // ── Type + City row ───────────────
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: typeBg,
                        borderRadius: BorderRadius.circular(100),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isLost
                                ? Icons.search_rounded
                                : Icons.check_circle_outline_rounded,
                            color: typeColor,
                            size: 13,
                          ),
                          const SizedBox(width: 5),
                          Text(
                            item.type.toUpperCase(),
                            style: TextStyle(
                              color: typeColor,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              letterSpacing: .8,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Spacer(),
                    if (item.cityName.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: cardColor,
                          borderRadius: BorderRadius.circular(100),
                          border: Border.all(color: borderColor),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.location_on_outlined,
                              size: 13,
                              color: AppColors.textSecondary,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              item.cityName,
                              style: const TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),

                const SizedBox(height: 16),

                // ── Title ─────────────────────────
                Text(
                  item.title,
                  style: const TextStyle(
                    color: AppColors.foreground,
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -.6,
                    height: 1.2,
                  ),
                ),

                const SizedBox(height: 18),

                // ── Gradient divider ──────────────
                Container(
                  height: 1,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        borderColor,
                        borderColor.withOpacity(.0),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 18),

                // ── Description label ─────────────
                const Text(
                  "DESCRIPTION",
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.2,
                  ),
                ),

                const SizedBox(height: 8),

                // ── Description body ──────────────
                Text(
                  item.description,
                  style: const TextStyle(
                    color: AppColors.foreground,
                    fontSize: 15,
                    height: 1.8,
                    fontWeight: FontWeight.w400,
                  ),
                ),


                if (!isOwner) ...[
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: GestureDetector(
                      onTap: isChatLoading ? null : openChat,
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [
                              AppColors.primary,
                              Color(0xFF7B6FEE),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.35),
                              blurRadius: 20,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: isChatLoading
                            ? const Center(
                          child: SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2.5,
                            ),
                          ),
                        )
                            : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.chat_bubble_outline_rounded,
                              color: Colors.white,
                              size: 20,
                            ),
                            const SizedBox(width: 10),
                            Text(
                              'Chat with ${item.userName.trim()}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 15,
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

          const SizedBox(height: 16),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────
  // INFO GRID
  // ─────────────────────────────────────────────

  Widget buildInfoGrid() {
    final item = widget.item;
    final tiles = <_InfoTile>[];

    if (item.categoryName.isNotEmpty) {
      tiles.add(_InfoTile(
        icon: Icons.inventory_2_outlined,
        label: "Category",
        value: item.categoryName,
        color: const Color(0xFF6C63FF),
      ));
    }

    if (item.place.isNotEmpty) {
      tiles.add(_InfoTile(
        icon: Icons.place_outlined,
        label: "Place",
        value: item.place,
        color: const Color(0xFF3BAB72),
      ));
    }

    if (item.date.isNotEmpty) {
      tiles.add(_InfoTile(
        icon: Icons.calendar_today_outlined,
        label: "Date",
        value: item.date,
        color: const Color(0xFFE09D2F),
      ));
    }

    if (item.governmentName.isNotEmpty) {
      tiles.add(_InfoTile(
        icon: Icons.location_city_outlined,
        label: "Governorate",
        value: item.governmentName,
        color: const Color(0xFF3A9BD5),
      ));
    }

    if (tiles.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 0, 18, 20),
      child: GridView.count(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        shrinkWrap: true,
        childAspectRatio: 2.6,
        physics: const NeverScrollableScrollPhysics(),
        children: tiles.map(buildInfoTile).toList(),
      ),
    );
  }

  Widget buildInfoTile(_InfoTile tile) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(.03),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: tile.color.withOpacity(.10),
              borderRadius: BorderRadius.circular(11),
            ),
            child: Icon(tile.icon, size: 17, color: tile.color),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  tile.label.toUpperCase(),
                  style: TextStyle(
                    color: AppColors.textSecondary.withOpacity(.7),
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    letterSpacing: .6,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  tile.value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.foreground,
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    height: 1.2,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────
  // COMMENTS HEADER
  // ─────────────────────────────────────────────

  Widget buildCommentsHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 16),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 22,
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          const SizedBox(width: 10),
          const Text(
            "Comments",
            style: TextStyle(
              color: AppColors.foreground,
              fontSize: 20,
              fontWeight: FontWeight.w800,
              letterSpacing: -.4,
            ),
          ),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 10, vertical: 4,
            ),
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(100),
            ),
            child: Text(
              comments.length.toString(),
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w800,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────
  // COMMENT CARD
  // ─────────────────────────────────────────────

  Widget buildCommentCard(CommentModel c) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 0, 18, 12),
      child: Dismissible(
        key: ValueKey(c.id),
        direction: DismissDirection.endToStart,
        background: Container(
          alignment: Alignment.centerRight,
          padding: const EdgeInsets.only(right: 22),
          decoration: BoxDecoration(
            color: Colors.red.withOpacity(.08),
            borderRadius: BorderRadius.circular(22),
          ),
          child: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(.12),
              borderRadius: BorderRadius.circular(11),
            ),
            child: const Icon(
              Icons.delete_outline_rounded,
              color: Colors.red,
              size: 18,
            ),
          ),
        ),
        onDismissed: (_) => deleteComment(c.id),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: borderColor),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(.03),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              buildAvatar(c.content),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          "User #${c.userId}",
                          style: const TextStyle(
                            color: AppColors.foreground,
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const Spacer(),
                        if (c.createdAt.isNotEmpty)
                          Text(
                            _formatTime(c.createdAt),
                            style: TextStyle(
                              color: AppColors.textSecondary.withOpacity(.7),
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 5),
                    Text(
                      c.content,
                      style: const TextStyle(
                        color: AppColors.foreground,
                        fontSize: 14,
                        height: 1.6,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatTime(String raw) {
    try {
      final dt = DateTime.parse(raw).toLocal();
      final diff = DateTime.now().difference(dt);
      if (diff.inSeconds < 60) return "just now";
      if (diff.inMinutes < 60) return "${diff.inMinutes}m ago";
      if (diff.inHours < 24)   return "${diff.inHours}h ago";
      if (diff.inDays < 7)     return "${diff.inDays}d ago";
      return "${dt.day}/${dt.month}/${dt.year}";
    } catch (_) {
      return "";
    }
  }

  Widget buildAvatar(String content) {
    final letter = content.isNotEmpty ? content[0].toUpperCase() : "?";

    final colors = [
      [const Color(0xFF6C63FF), const Color(0xFF8B84FF)],
      [const Color(0xFF3BAB72), const Color(0xFF5DC48A)],
      [const Color(0xFF3A9BD5), const Color(0xFF5BB3E8)],
      [const Color(0xFFE09D2F), const Color(0xFFEBB44D)],
      [const Color(0xFFE05252), const Color(0xFFEA7070)],
    ];
    final colorPair = colors[letter.codeUnitAt(0) % colors.length];

    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: colorPair,
        ),
      ),
      child: Center(
        child: Text(
          letter,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            fontSize: 15,
          ),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────
  // COMMENT INPUT
  // ─────────────────────────────────────────────

  Widget buildCommentInput() {
    return Padding(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom +
            MediaQuery.of(context).padding.bottom +
            16,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 22, sigmaY: 22),
          child: Container(
            padding: const EdgeInsets.fromLTRB(18, 8, 8, 8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(.92),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: borderColor),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(.07),
                  blurRadius: 28,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: commentController,
                    focusNode: commentFocusNode,
                    cursorColor: AppColors.primary,
                    style: const TextStyle(
                      color: AppColors.foreground,
                      fontSize: 14.5,
                      fontWeight: FontWeight.w500,
                    ),
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      hintText: "Write a comment...",
                      hintStyle: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 14,
                      ),
                      isDense: true,
                      contentPadding:
                      EdgeInsets.symmetric(vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ScaleTransition(
                  scale: sendButtonScale,
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(100),
                      onTap: sendComment,
                      child: Ink(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              AppColors.primary,
                              Color(0xFF7B6FEE),
                            ],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(.32),
                              blurRadius: 18,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.send_rounded,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────
  // TAG
  // ─────────────────────────────────────────────

  Widget buildTag({
    required String label,
    required IconData icon,
    bool isPrimary = false,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
      decoration: BoxDecoration(
        color: isPrimary
            ? AppColors.primary.withOpacity(.08)
            : cardColor,
        borderRadius: BorderRadius.circular(100),
        border: Border.all(
          color: isPrimary
              ? AppColors.primary.withOpacity(.12)
              : borderColor,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: isPrimary ? AppColors.primary : AppColors.textSecondary,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              color: isPrimary ? AppColors.primary : AppColors.textSecondary,
              fontSize: 13,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// DATA CLASS FOR INFO TILES
// ─────────────────────────────────────────────

class _InfoTile {
  final IconData icon;
  final String label;
  final String value;
  final Color color;
  const _InfoTile({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });
}

// ─────────────────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────────────────

class CommentsLoading extends StatefulWidget {
  const CommentsLoading({super.key});

  @override
  State<CommentsLoading> createState() => _CommentsLoadingState();
}

class _CommentsLoadingState extends State<CommentsLoading>
    with SingleTickerProviderStateMixin {
  late AnimationController controller;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18),
      child: Column(
        children: List.generate(
          3,
              (_) => AnimatedBuilder(
            animation: controller,
            builder: (_, __) => Opacity(
              opacity: .35 + (controller.value * .55),
              child: Container(
                margin: const EdgeInsets.only(bottom: 12),
                height: 78,
                decoration: BoxDecoration(
                  color: cardColor,
                  borderRadius: BorderRadius.circular(22),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────
// EMPTY COMMENTS
// ─────────────────────────────────────────────

class EmptyComments extends StatelessWidget {
  const EmptyComments({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 0, 18, 18),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 44, horizontal: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(26),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(.03),
              blurRadius: 18,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(.07),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.chat_bubble_outline_rounded,
                color: AppColors.primary,
                size: 30,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "No comments yet",
              style: TextStyle(
                color: AppColors.foreground,
                fontSize: 16,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              "Be the first to start the conversation",
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 13,
                height: 1.6,
              ),
            ),
          ],
        ),
      ),
    );
  }
}