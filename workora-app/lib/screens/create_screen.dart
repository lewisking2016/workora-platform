import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../workora/api/api_client.dart';

class CreateScreen extends StatefulWidget {
  final ApiClient api;
  const CreateScreen({super.key, required this.api});

  @override
  State<CreateScreen> createState() => _CreateScreenState();
}

class _CreateScreenState extends State<CreateScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  File? _selectedMedia;
  String _mediaType = 'image'; // image or video
  String? _selectedTrade;
  bool _isUploading = false;
  String? _error;

  static const _trades = [
    'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mason',
    'Cleaner', 'Mechanic', 'Welder', 'Tiler', 'Roofer',
    'AC Technician', 'Photographer', 'Other',
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  Future<void> _pickMedia(ImageSource source, {bool isVideo = false}) async {
    final picker = ImagePicker();
    final picked = isVideo
        ? await picker.pickVideo(source: source, maxDuration: const Duration(seconds: 60))
        : await picker.pickImage(source: source, maxWidth: 1920, imageQuality: 85);

    if (picked != null) {
      setState(() {
        _selectedMedia = File(picked.path);
        _mediaType = isVideo ? 'video' : 'image';
      });
    }
  }

  Future<void> _publish() async {
    if (_selectedMedia == null) {
      setState(() => _error = 'Select a photo or video');
      return;
    }
    if (_titleController.text.trim().isEmpty) {
      setState(() => _error = 'Add a title');
      return;
    }

    setState(() {
      _isUploading = true;
      _error = null;
    });

    try {
      // TODO: Implement actual file upload via multipart to /upload/gig
      // For now, show success message
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Published! Your work is now visible.'),
            backgroundColor: Color(0xFF6C5CE7),
          ),
        );
        setState(() {
          _selectedMedia = null;
          _titleController.clear();
          _descController.clear();
          _isUploading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Upload failed. Please try again.';
        _isUploading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Share Work', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
        actions: [
          TextButton(
            onPressed: _isUploading ? null : _publish,
            child: _isUploading
                ? const SizedBox(
                    width: 18, height: 18,
                    child: CircularProgressIndicator(color: Color(0xFF6C5CE7), strokeWidth: 2),
                  )
                : const Text('Publish', style: TextStyle(color: Color(0xFF6C5CE7), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Media picker
          if (_selectedMedia == null)
            GestureDetector(
              onTap: () => _showMediaPicker(),
              child: Container(
                height: 240,
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A2E),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF6C5CE7).withOpacity(0.3), width: 2),
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.add_photo_alternate_outlined, size: 48, color: Color(0xFF6C5CE7)),
                    SizedBox(height: 12),
                    Text('Tap to add photo or video', style: TextStyle(color: Colors.grey)),
                  ],
                ),
              ),
            )
          else ...[
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Stack(
                children: [
                  Image.file(_selectedMedia!, height: 240, width: double.infinity, fit: BoxFit.cover),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedMedia = null),
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(color: Colors.black54, shape: BoxShape.circle),
                        child: const Icon(Icons.close, color: Colors.white, size: 18),
                      ),
                    ),
                  ),
                  if (_mediaType == 'video')
                    const Positioned(
                      bottom: 8,
                      left: 8,
                      child: Icon(Icons.videocam, color: Colors.white, size: 20),
                    ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 16),

          // Title
          TextField(
            controller: _titleController,
            style: const TextStyle(color: Colors.white),
            maxLength: 100,
            decoration: InputDecoration(
              hintText: 'Title (e.g. Kitchen plumbing repair)',
              hintStyle: TextStyle(color: Colors.grey[600]),
              filled: true,
              fillColor: const Color(0xFF1A1A2E),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              counterStyle: TextStyle(color: Colors.grey[600], fontSize: 12),
            ),
          ),
          const SizedBox(height: 12),

          // Description
          TextField(
            controller: _descController,
            style: const TextStyle(color: Colors.white),
            maxLines: 3,
            decoration: InputDecoration(
              hintText: 'Describe the work...',
              hintStyle: TextStyle(color: Colors.grey[600]),
              filled: true,
              fillColor: const Color(0xFF1A1A2E),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            ),
          ),
          const SizedBox(height: 12),

          // Trade selector
          DropdownButtonFormField<String>(
            value: _selectedTrade,
            dropdownColor: const Color(0xFF1A1A2E),
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Trade / Category',
              hintStyle: TextStyle(color: Colors.grey[600]),
              filled: true,
              fillColor: const Color(0xFF1A1A2E),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            ),
            items: _trades.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
            onChanged: (v) => setState(() => _selectedTrade = v),
          ),

          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(_error!, style: const TextStyle(color: Colors.redAccent, fontSize: 14)),
          ],
        ],
      ),
    );
  }

  void _showMediaPicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1A1A2E),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt, color: Color(0xFF6C5CE7)),
              title: const Text('Take Photo', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(ctx);
                _pickMedia(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library, color: Color(0xFF6C5CE7)),
              title: const Text('Choose Photo', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(ctx);
                _pickMedia(ImageSource.gallery);
              },
            ),
            ListTile(
              leading: const Icon(Icons.videocam, color: Color(0xFF6C5CE7)),
              title: const Text('Record Video', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(ctx);
                _pickMedia(ImageSource.camera, isVideo: true);
              },
            ),
            ListTile(
              leading: const Icon(Icons.video_library, color: Color(0xFF6C5CE7)),
              title: const Text('Choose Video', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(ctx);
                _pickMedia(ImageSource.gallery, isVideo: true);
              },
            ),
          ],
        ),
      ),
    );
  }
}
