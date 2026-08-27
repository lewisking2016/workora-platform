import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'workora/constants.dart';
import 'workora/api/api_client.dart';
import 'workora/storage/token_store.dart';
import 'workora/repositories/auth_repository.dart';
import 'workora/state/app_state.dart';
import 'workora/models/auth_models.dart';

import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/feed_screen.dart';
import 'screens/explore_screen.dart';
import 'screens/messages_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/create_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const WorkoraApp());
}

class WorkoraApp extends StatefulWidget {
  const WorkoraApp({super.key});

  @override
  State<WorkoraApp> createState() => _WorkoraAppState();
}

class _WorkoraAppState extends State<WorkoraApp> {
  final _tokenStore = TokenStore();
  final _appState = AppState();
  late final ApiClient _api;
  late final AuthRepository _authRepo;

  bool _isLoading = true;
  bool _isLoggedIn = false;

  @override
  void initState() {
    super.initState();
    _api = ApiClient(getToken: _tokenStore.readToken);
    _authRepo = AuthRepository(api: _api);
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final token = await _tokenStore.readToken();
    if (token != null && token.isNotEmpty) {
      try {
        final json = await _api.getJson<Map<String, dynamic>>('/auth/me');
        final userJson = json['user'] as Map<String, dynamic>?;
        if (userJson != null) {
          _appState.setUser(AuthUser.fromJson(userJson));
          setState(() {
            _isLoggedIn = true;
            _isLoading = false;
          });
          return;
        }
      } catch (_) {
        await _tokenStore.clear();
      }
    }
    setState(() {
      _isLoggedIn = false;
      _isLoading = false;
    });
  }

  void _onLoginSuccess(AuthResponse response) {
    _tokenStore.saveToken(response.token);
    _appState.setUser(response.user);
    setState(() => _isLoggedIn = true);
  }

  void _onLogout() {
    _tokenStore.clear();
    _appState.setUser(null);
    setState(() => _isLoggedIn = false);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Workora',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6C5CE7),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF0A0A0F),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0A0A0F),
          elevation: 0,
          centerTitle: false,
        ),
        useMaterial3: true,
      ),
      home: _isLoading
          ? const Scaffold(
              body: Center(
                child: CircularProgressIndicator(color: Color(0xFF6C5CE7)),
              ),
            )
          : _isLoggedIn
              ? MainShell(appState: _appState, onLogout: _onLogout, api: _api)
              : LoginScreen(
                  authRepo: _authRepo,
                  onLoginSuccess: _onLoginSuccess,
                  onGoToRegister: () {},
                ),
      routes: {
        '/login': (ctx) => LoginScreen(
              authRepo: _authRepo,
              onLoginSuccess: _onLoginSuccess,
              onGoToRegister: () {},
            ),
        '/register': (ctx) => RegisterScreen(
              authRepo: _authRepo,
              onRegisterSuccess: _onLoginSuccess,
            ),
      },
    );
  }
}

class MainShell extends StatefulWidget {
  final AppState appState;
  final VoidCallback onLogout;
  final ApiClient api;

  const MainShell({
    super.key,
    required this.appState,
    required this.onLogout,
    required this.api,
  });

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = [
      FeedScreen(api: widget.api),
      ExploreScreen(api: widget.api),
      CreateScreen(api: widget.api),
      MessagesScreen(api: widget.api),
      ProfileScreen(
        api: widget.api,
        appState: widget.appState,
        onLogout: widget.onLogout,
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        backgroundColor: const Color(0xFF12121A),
        indicatorColor: const Color(0xFF6C5CE7).withOpacity(0.3),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: Color(0xFF6C5CE7)),
            label: 'Feed',
          ),
          NavigationDestination(
            icon: Icon(Icons.explore_outlined),
            selectedIcon: Icon(Icons.explore, color: Color(0xFF6C5CE7)),
            label: 'Explore',
          ),
          NavigationDestination(
            icon: Icon(Icons.add_circle_outline, size: 32),
            selectedIcon: Icon(Icons.add_circle, color: Color(0xFF6C5CE7), size: 32),
            label: 'Create',
          ),
          NavigationDestination(
            icon: Icon(Icons.chat_bubble_outline),
            selectedIcon: Icon(Icons.chat_bubble, color: Color(0xFF6C5CE7)),
            label: 'Messages',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person, color: Color(0xFF6C5CE7)),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
