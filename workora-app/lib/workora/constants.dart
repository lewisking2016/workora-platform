class WorkoraConstants {
  // Set via --dart-define=API_BASE_URL=https://your-domain.com
  // Falls back to localhost for local development.
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3001',
  );

  static const Duration connectTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 20);
}
