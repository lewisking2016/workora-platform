import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';

import '../workora/api/api_client.dart';

class FeedScreen extends StatefulWidget {
  final ApiClient api;
  const FeedScreen({super.key, required this.api});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  List<dynamic> _gigs = [];
  bool _isLoading = true;
  bool _isLoadingMore = false;
  String? _error;
  String _scope = 'new';
  String? _cursor;
  bool _hasMore = true;
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _loadFeed();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200 &&
        !_isLoadingMore && _hasMore) {
      _loadMore();
    }
  }

  Future<void> _loadFeed() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final data = await widget.api.getJson<List<dynamic>>('/gigs/feed?scope=$_scope&limit=20');
      setState(() {
        _gigs = data;
        _hasMore = data.length >= 20;
        if (data.isNotEmpty) _cursor = data.last['created_at'];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to load feed';
        _isLoading = false;
      });
    }
  }

  Future<void> _loadMore() async {
    if (_cursor == null) return;
    setState(() => _isLoadingMore = true);

    try {
      final data = await widget.api.getJson<List<dynamic>>(
        '/gigs/feed?scope=$_scope&limit=20&cursor=$_cursor',
      );
      setState(() {
        _gigs.addAll(data);
        _hasMore = data.length >= 20;
        if (data.isNotEmpty) _cursor = data.last['created_at'];
        _isLoadingMore = false;
      });
    } catch (_) {
      setState(() => _isLoadingMore = false);
    }
  }

  Future<void> _toggleLike(String gigId) async {
    try {
      final res = await widget.api.postJson<Map<String, dynamic>>('/gigs/$gigId/like', {});
      final liked = res['liked'] == true;
      setState(() {
        final idx = _gigs.indexWhere((g) => g['id'] == gigId);
        if (idx >= 0) {
          _gigs[idx]['liked_by_me'] = liked;
          _gigs[idx]['likes_count'] = (_gigs[idx]['likes_count'] ?? 0) + (liked ? 1 : -1);
        }
      });
    } catch (_) {}
  }

  Future<void> _toggleSave(String gigId) async {
    try {
      final res = await widget.api.postJson<Map<String, dynamic>>('/gigs/$gigId/save', {});
      final saved = res['saved'] == true;
      setState(() {
        final idx = _gigs.indexWhere((g) => g['id'] == gigId);
        if (idx >= 0) _gigs[idx]['saved_by_me'] = saved;
      });
    } catch (_) {}
  }

  void _changeScope(String scope) {
    setState(() => _scope = scope);
    _cursor = null;
    _loadFeed();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Workora', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
        actions: [
          IconButton(onPressed: _loadFeed, icon: const Icon(Icons.refresh)),
        ],
      ),
      body: Column(
        children: [
          // Scope chips
          SizedBox(
            height: 44,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _scopeChip('New', 'new'),
                _scopeChip('Trending', 'trending'),
                _scopeChip('Following', 'following'),
                _scopeChip('Recommended', 'recommended'),
                _scopeChip('Reels', 'reels'),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Feed list
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFF6C5CE7)))
                : _error != null
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(_error!, style: const TextStyle(color: Colors.grey)),
                            const SizedBox(height: 12),
                            ElevatedButton(onPressed: _loadFeed, child: const Text('Retry')),
                          ],
                        ),
                      )
                    : _gigs.isEmpty
                        ? const Center(
                            child: Text('No posts yet.\nBe the first to share your work!',
                                textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadFeed,
                            child: ListView.builder(
                              controller: _scrollController,
                              itemCount: _gigs.length + (_isLoadingMore ? 1 : 0),
                              itemBuilder: (ctx, i) {
                                if (i == _gigs.length) {
                                  return const Padding(
                                    padding: EdgeInsets.all(16),
                                    child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
                                  );
                                }
                                return _GigCard(
                                  gig: _gigs[i],
                                  onLike: () => _toggleLike(_gigs[i]['id']),
                                  onSave: () => _toggleSave(_gigs[i]['id']),
                                );
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  Widget _scopeChip(String label, String scope) {
    final selected = _scope == scope;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label, style: TextStyle(color: selected ? Colors.white : Colors.grey[400], fontSize: 13)),
        selected: selected,
        selectedColor: const Color(0xFF6C5CE7),
        backgroundColor: const Color(0xFF1A1A2E),
        onSelected: (_) => _changeScope(scope),
        showCheckmark: false,
        padding: const EdgeInsets.symmetric(horizontal: 4),
      ),
    );
  }
}

class _GigCard extends StatelessWidget {
  final dynamic gig;
  final VoidCallback onLike;
  final VoidCallback onSave;

  const _GigCard({required this.gig, required this.onLike, required this.onSave});

  @override
  Widget build(BuildContext context) {
    final liked = gig['liked_by_me'] == true;
    final saved = gig['saved_by_me'] == true;
    final likes = gig['likes_count'] ?? 0;
    final comments = gig['comments_count'] ?? 0;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF12121A),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: avatar + name + trade
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: const Color(0xFF6C5CE7).withOpacity(0.3),
                  backgroundImage: gig['avatar_url'] != null ? NetworkImage(gig['avatar_url']) : null,
                  child: gig['avatar_url'] == null
                      ? Text(
                          (gig['user_name'] ?? 'M')[0].toUpperCase(),
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        )
                      : null,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            gig['user_name'] ?? 'Member',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15),
                          ),
                          if (gig['verified'] == true) ...[
                            const SizedBox(width: 4),
                            const Icon(Icons.verified, color: Color(0xFF6C5CE7), size: 16),
                          ],
                        ],
                      ),
                      Text(
                        gig['trade'] ?? '',
                        style: TextStyle(color: Colors.grey[500], fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Thumbnail or video placeholder
          if (gig['thumbnail_url'] != null || gig['video_url'] != null)
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Image.network(
                    gig['thumbnail_url'] ?? gig['video_url'] ?? '',
                    fit: BoxFit.cover,
                    width: double.infinity,
                    errorBuilder: (_, __, ___) => Container(
                      color: const Color(0xFF1A1A2E),
                      child: const Icon(Icons.play_circle_outline, color: Colors.grey, size: 48),
                    ),
                  ),
                  if (gig['video_url'] != null)
                    const Icon(Icons.play_circle_fill, color: Colors.white70, size: 48),
                ],
              ),
            ),

          // Title
          if (gig['title'] != null && (gig['title'] as String).isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Text(
                gig['title'],
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15),
              ),
            ),

          // Actions row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                GestureDetector(
                  onTap: onLike,
                  child: Row(
                    children: [
                      Icon(
                        liked ? Icons.favorite : Icons.favorite_border,
                        color: liked ? Colors.redAccent : Colors.grey[500],
                        size: 22,
                      ),
                      const SizedBox(width: 4),
                      Text('$likes', style: TextStyle(color: Colors.grey[500], fontSize: 13)),
                    ],
                  ),
                ),
                const SizedBox(width: 20),
                Row(
                  children: [
                    Icon(Icons.chat_bubble_outline, color: Colors.grey[500], size: 20),
                    const SizedBox(width: 4),
                    Text('$comments', style: TextStyle(color: Colors.grey[500], fontSize: 13)),
                  ],
                ),
                const Spacer(),
                GestureDetector(
                  onTap: onSave,
                  child: Icon(
                    saved ? Icons.bookmark : Icons.bookmark_border,
                    color: saved ? const Color(0xFF6C5CE7) : Colors.grey[500],
                    size: 22,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 4),
        ],
      ),
    );
  }
}
