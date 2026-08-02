import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../constants.dart';

class ApiClient {
  ApiClient({required this.getToken});

  final Future<String?> Function() getToken;

  Uri _url(String path) {
    final base = WorkoraConstants.apiBaseUrl;
    return Uri.parse('$base$path');
  }

  Future<Map<String, String>> _authHeaders() async {
    final token = await getToken();
    if (token == null || token.isEmpty) {
      return {'Content-Type': 'application/json', 'Accept': 'application/json'};
    }

    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };
  }

  Future<http.Response> _send(
    String method,
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final uri = _url(path);
    final headers = await _authHeaders();

    final client = http.Client();
    try {
      final timeout = method == 'GET'
          ? WorkoraConstants.receiveTimeout
          : WorkoraConstants.connectTimeout;

      switch (method) {
        case 'GET':
          return await client
              .get(uri, headers: headers)
              .timeout(WorkoraConstants.receiveTimeout);
        case 'POST':
          return await client
              .post(uri, headers: headers, body: jsonEncode(body ?? {}))
              .timeout(timeout);
        case 'PATCH':
          return await client
              .patch(uri, headers: headers, body: jsonEncode(body ?? {}))
              .timeout(timeout);
        case 'DELETE':
          return await client.delete(uri, headers: headers).timeout(timeout);
        default:
          throw UnsupportedError('Unsupported method: $method');
      }
    } finally {
      client.close();
    }
  }

  Future<T> getJson<T>(String path, {T Function(dynamic json)? parse}) async {
    final res = await _send('GET', path);
    final body = res.body;
    final json = body.isNotEmpty ? jsonDecode(body) : null;

    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw HttpException('GET $path failed: ${res.statusCode} $body');
    }

    if (parse != null) return parse(json);
    return json as T;
  }

  Future<T> postJson<T>(
    String path,
    Map<String, dynamic> body, {
    T Function(dynamic json)? parse,
  }) async {
    final res = await _send('POST', path, body: body);
    final bodyStr = res.body;
    final json = bodyStr.isNotEmpty ? jsonDecode(bodyStr) : null;

    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw HttpException('POST $path failed: ${res.statusCode} $bodyStr');
    }

    if (parse != null) return parse(json);
    return json as T;
  }
}
