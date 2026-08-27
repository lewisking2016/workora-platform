import 'package:flutter/material.dart';

import '../workora/api/api_client.dart';

class ExploreScreen extends StatefulWidget {
  final ApiClient api;
  const ExploreScreen({super.key, required this.api});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final _searchController = TextEditingController();
  List<dynamic> _exploreGigs = [];
  List<dynamic> _searchResults = [];
  bool _isLoading = true;
  bool _isSearching = false;
  String? _error;

  static const _categories = [
    ('Plumber', Icons.plumbing),
    ('Electrician', Icons.electrical_services),
    ('Carpenter', Icons.carpenter),
    ('Painter', Icons.format_paint),
    ('Cleaner', Icons.cleaning_services),
    ('Mechanic', Icons.car_repair),
    ('Tutor', Icons.school),
    ('Photographer', Icons.camera_alt),
    ('Hairdresser', Icons.content_cut),
    ('Driver', Icons.directions_car),
  ];

  @override
  void initState() {
    super.initState();
    _loadExplore();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadExplore() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final data = await widget.api.getJson<List<dynamic>>('/gigs/explore?limit=30');
      setState(() {
        _exploreGigs = data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to load';
        _isLoading = false;
      });
    }
  }

  Future<void> _search(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _searchResults = [];
        _isSearching = false;
      });
      return;
    }
    setState(() => _isSearching = true);
    try {
      final data = await widget.api.getJson<List<dynamic>>('/profile/search?q=${Uri.encodeComponent(query)}&limit=20');
      setState(() {
        _searchResults = data;
        _isSearching = false;
      });
    } catch (_) {
      setState(() => _isSearching = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Explore', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24))),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              controller: _searchController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search trades, people, skills...',
                hintStyle: TextStyle(color: Colors.grey[600]),
                prefixIcon: const Icon(Icons.search, color: Colors.grey),
                filled: true,
                fillColor: const Color(0xFF1A1A2E),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
              onSubmitted: _search,
              onChanged: (v) {
                if (v.length >= 3) _search(v);
                if (v.isEmpty) setState(() { _searchResults = []; _isSearching = false; });
              },
            ),
          ),

          // Content
          Expanded(
            child: _isSearching
                ? const Center(child: CircularProgressIndicator(color: Color(0xFF6C5CE7)))
                : _searchResults.isNotEmpty
                    ? _buildSearchResults()
                    : _isLoading
                        ? const Center(child: CircularProgressIndicator(color: Color(0xFF6C5CE7)))
                        : _error != null
                            ? Center(child: Text(_error!, style: const TextStyle(color: Colors.grey)))
                            : _buildExploreContent(),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      itemCount: _searchResults.length,
      itemBuilder: (ctx, i) {
        final p = _searchResults[i];
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFF12121A),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: const Color(0xFF6C5CE7).withOpacity(0.3),
                backgroundImage: p['avatar_url'] != null ? NetworkImage(p['avatar_url']) : null,
                child: p['avatar_url'] == null
                    ? Text((p['full_name'] ?? 'M')[0].toUpperCase(), style: const TextStyle(color: Colors.white))
                    : null,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p['full_name'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                    Text(p['trade'] ?? '', style: TextStyle(color: Colors.grey[500], fontSize: 13)),
                  ],
                ),
              ),
              if (p['trust_score'] != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF6C5CE7).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text('${p['trust_score']}', style: const TextStyle(color: Color(0xFF6C5CE7), fontSize: 12)),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildExploreContent() {
    return RefreshIndicator(
      onRefresh: _loadExplore,
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        children: [
          // Categories
          const Text('Categories', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 12),
          SizedBox(
            height: 100,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _categories.length,
              itemBuilder: (ctx, i) {
                final (name, icon) = _categories[i];
                return Container(
                  width: 80,
                  margin: const EdgeInsets.only(right: 10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A1A2E),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(icon, color: const Color(0xFF6C5CE7), size: 28),
                      const SizedBox(height: 6),
                      Text(name, style: TextStyle(color: Colors.grey[400], fontSize: 11), textAlign: TextAlign.center),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 24),

          // Trending gigs
          const Text('Trending', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 12),
          ..._exploreGigs.take(10).map((gig) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF12121A),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    gig['thumbnail_url'] ?? '',
                    width: 60,
                    height: 60,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      width: 60,
                      height: 60,
                      color: const Color(0xFF1A1A2E),
                      child: const Icon(Icons.work_outline, color: Colors.grey),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(gig['user_name'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                      Text(gig['trade'] ?? '', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                    ],
                  ),
                ),
                Row(
                  children: [
                    const Icon(Icons.visibility, color: Colors.grey, size: 14),
                    const SizedBox(width: 4),
                    Text('${gig['view_count'] ?? 0}', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                  ],
                ),
              ],
            ),
          )),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
