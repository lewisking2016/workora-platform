import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';

import '../workora/api/api_client.dart';

class MessagesScreen extends StatefulWidget {
  final ApiClient api;
  const MessagesScreen({super.key, required this.api});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  List<dynamic> _conversations = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadConversations();
  }

  Future<void> _loadConversations() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      // We need the current user ID — fetch from /auth/me
      final me = await widget.api.getJson<Map<String, dynamic>>('/auth/me');
      final userId = me['user']['id'] as String;
      final data = await widget.api.getJson<List<dynamic>>('/messages/conversations/$userId');
      setState(() {
        _conversations = data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to load conversations';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF6C5CE7)))
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_error!, style: const TextStyle(color: Colors.grey)),
                      const SizedBox(height: 12),
                      ElevatedButton(onPressed: _loadConversations, child: const Text('Retry')),
                    ],
                  ),
                )
              : _conversations.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.chat_bubble_outline, size: 64, color: Colors.grey),
                          SizedBox(height: 16),
                          Text('No conversations yet', style: TextStyle(color: Colors.grey, fontSize: 16)),
                          SizedBox(height: 8),
                          Text('Start a conversation from a profile', style: TextStyle(color: Colors.grey, fontSize: 13)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadConversations,
                      child: ListView.builder(
                        itemCount: _conversations.length,
                        itemBuilder: (ctx, i) {
                          final conv = _conversations[i];
                          final unread = conv['unread_count'] ?? 0;
                          final isPinned = conv['is_pinned'] == true;

                          return Container(
                            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                            decoration: BoxDecoration(
                              color: unread > 0 ? const Color(0xFF1A1A2E) : const Color(0xFF12121A),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: ListTile(
                              leading: CircleAvatar(
                                radius: 24,
                                backgroundColor: const Color(0xFF6C5CE7).withOpacity(0.3),
                                child: Text(
                                  (conv['other_username'] ?? 'U')[0].toUpperCase(),
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                ),
                              ),
                              title: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      conv['other_username'] ?? 'Unknown',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: unread > 0 ? FontWeight.bold : FontWeight.normal,
                                      ),
                                    ),
                                  ),
                                  if (isPinned) const Icon(Icons.push_pin, size: 14, color: Colors.grey),
                                ],
                              ),
                              subtitle: Text(
                                conv['last_message_text'] ?? 'Start a conversation',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: unread > 0 ? Colors.white70 : Colors.grey[500],
                                  fontWeight: unread > 0 ? FontWeight.w500 : FontWeight.normal,
                                ),
                              ),
                              trailing: unread > 0
                                  ? Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: const BoxDecoration(
                                        color: Color(0xFF6C5CE7),
                                        shape: BoxShape.circle,
                                      ),
                                      child: Text('$unread', style: const TextStyle(color: Colors.white, fontSize: 12)),
                                    )
                                  : null,
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
