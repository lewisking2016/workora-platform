class AuthUser {
  AuthUser({required this.id, required this.username, required this.role});

  final String id;
  final String username;
  final String role;

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: (json['id'] ?? '').toString(),
      username: (json['username'] ?? '').toString(),
      role: (json['role'] ?? '').toString(),
    );
  }
}

class AuthResponse {
  AuthResponse({required this.token, required this.user});

  final String token;
  final AuthUser user;

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: (json['token'] ?? '').toString(),
      user: AuthUser.fromJson(
        (json['user'] ?? const {}).cast<String, dynamic>(),
      ),
    );
  }
}
