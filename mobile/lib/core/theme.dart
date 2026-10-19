import 'package:flutter/material.dart';

abstract final class AppTheme {
  static const navy = Color(0xFF0B4778);
  static const teal = Color(0xFF159A7A);
  static const canvas = Color(0xFFF3F8F7);

  static ThemeData get light => _build(Brightness.light);
  static ThemeData get dark => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    final scheme = ColorScheme.fromSeed(
      seedColor: teal,
      brightness: brightness,
      primary: navy,
      secondary: teal,
      surface: brightness == Brightness.light ? Colors.white : const Color(0xFF17252B),
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: brightness == Brightness.light ? canvas : const Color(0xFF10191D),
      visualDensity: VisualDensity.standard,
      textTheme: ThemeData(brightness: brightness).textTheme.apply(
        fontSizeFactor: 1.12,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: false,
        toolbarHeight: 72,
        titleTextStyle: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: navy),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size(64, 64),
          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(56, 56),
          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      ),
    );
  }
}
