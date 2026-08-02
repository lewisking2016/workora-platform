class WorkoraConstants {
  // CHANGE these for production.
  // Recommended: call backend directly from mobile (no Next proxy).
  static const String apiBaseUrl = 'http://4.221.170.153:3001';

  static const Duration connectTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 20);
}
