import 'package:flutter/foundation.dart';

import '../models/auth_models.dart';

class AppState extends ChangeNotifier {
  AuthUser? _user;

  AuthUser? get user => _user;

  void setUser(AuthUser? user) {
    _user = user;
    notifyListeners();
  }
}
