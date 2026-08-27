import 'package:flutter/material.dart';

import '../workora/api/api_client.dart';
import '../workora/state/app_state.dart';

class ProfileScreen extends StatefulWidget {
  final ApiClient api;
  final AppState appState;
  final VoidCallback onLogout;

  const ProfileScreen({
    super.key,
    required this.api,
    required this.appState,
    required this.onLogout,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? _profile;
  List<dynamic> _gigs = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final me = await widget.api.getJson<Map<String, dynamic>>('/auth/me');
      final userId = me['user']['id'] as String;

      // Load profile data
      final profileData = await widget.api.getJson<Map<String, dynamic>>('/profile/$userId');
      final gigsData = await widget.api.getJson<List<dynamic>>('/gigs/worker/$userId');

      setState(() {
        _profile = profileData;
        _gigs = gigsData;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
        actions: [
          IconButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  backgroundColor: const Color(0xFF1A1A2E),
                  title: const Text('Log out?', style: TextStyle(color: Colors.white)),
                  content: const Text('Are you sure you want to log out?', style: TextStyle(color: Colors.grey)),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                    TextButton(
                      onPressed: () {
                        Navigator.pop(ctx);
                        widget.onLogout();
                      },
                      child: const Text('Log out', style: TextStyle(color: Colors.redAccent)),
                    ),
                  ],
                ),
              );
            },
            icon: const Icon(Icons.settings_outlined),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF6C5CE7)))
          : RefreshIndicator(
              onRefresh: _loadProfile,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Avatar + name
                  Center(
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 48,
                          backgroundColor: const Color(0xFF6C5CE7).withOpacity(0.3),
                          backgroundImage: _profile?['avatar_url'] != null
                              ? NetworkImage(_profile!['avatar_url'])
                              : null,
                          child: _profile?['avatar_url'] == null
                              ? Text(
                                  (_profile?['full_name'] ?? 'U')[0].toUpperCase(),
                                  style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                                )
                              : null,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _profile?['full_name'] ?? widget.appState.user?.username ?? 'User',
                          style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _profile?['trade'] ?? '',
                          style: TextStyle(color: Colors.grey[400], fontSize: 15),
                        ),
                        if (_profile?['location'] != null) ...[
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.location_on_outlined, size: 14, color: Colors.grey[500]),
                              const SizedBox(width: 4),
                              Text(_profile!['location'], style: TextStyle(color: Colors.grey[500], fontSize: 13)),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Trust score card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF12121A),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _statItem('Trust Score', '${_profile?['trust_score'] ?? 0.0}'),
                        _statItem('Gigs', '${_profile?['total_gigs'] ?? _gigs.length}'),
                        _statItem('Verified', _profile?['is_verified'] == true ? 'Yes' : 'No'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Bio
                  if (_profile?['bio'] != null && (_profile!['bio'] as String).isNotEmpty) ...[
                    const Text('About', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 8),
                    Text(_profile!['bio'], style: TextStyle(color: Colors.grey[400], fontSize: 14)),
                    const SizedBox(height: 24),
                  ],

                  // Portfolio
                  const Text('Portfolio', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 12),
                  if (_gigs.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: const Color(0xFF12121A),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Center(
                        child: Text('No portfolio items yet.\nShare your first work!', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
                      ),
                    )
                  else
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        crossAxisSpacing: 4,
                        mainAxisSpacing: 4,
                      ),
                      itemCount: _gigs.length,
                      itemBuilder: (ctx, i) {
                        final gig = _gigs[i];
                        return ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            gig['thumbnail_url'] ?? gig['video_url'] ?? '',
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              color: const Color(0xFF1A1A2E),
                              child: const Icon(Icons.work_outline, color: Colors.grey),
                            ),
                          ),
                        );
                      },
                    ),
                ],
              ),
            ),
    );
  }

  Widget _statItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(color: Colors.grey[500], fontSize: 12)),
      ],
    );
  }
}
