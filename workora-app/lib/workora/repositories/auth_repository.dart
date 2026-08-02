import '../api/api_client.dart';

import '../models/auth_models.dart';

class AuthRepository {
  AuthRepository({required this.api});

  final ApiClient api;

  Future<AuthResponse> login({
    required String phoneNumber,
    required String password,
  }) async {
    final json = await api.postJson<Map<String, dynamic>>('/auth/login', {
      'phone_number': phoneNumber,
      'password': password,
    });

    return AuthResponse.fromJson(json);
  }

  Future<AuthResponse> register({
    required String phoneNumber,
    required String password,
    required String fullName,
    required String trade,
    String? email,
    String? username,
    String? birthday,
    String role = 'worker',
  }) async {
    final json = await api.postJson<Map<String, dynamic>>('/auth/register', {
      'phone_number': phoneNumber,
      'email': email,
      'username': username,
      'password': password,
      'full_name': fullName,
      'trade': trade,
      'birthday': birthday,
      'role': role,
    });

    return AuthResponse.fromJson(json);
  }
}
