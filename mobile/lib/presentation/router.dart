import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const _FoundationScreen(),
    ),
    GoRoute(
      path: '/medicines',
      builder: (context, state) => const _FoundationScreen(section: 'Medicines'),
    ),
    GoRoute(
      path: '/history',
      builder: (context, state) => const _FoundationScreen(section: 'History'),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const _FoundationScreen(section: 'Settings'),
    ),
    GoRoute(
      path: '/onboarding',
      builder: (context, state) => const _FoundationScreen(section: 'Welcome'),
    ),
  ],
);

class _FoundationScreen extends StatelessWidget {
  const _FoundationScreen({this.section = 'Today'});
  final String section;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SehatParivaar')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.health_and_safety_rounded, size: 76, color: Color(0xFF159A7A)),
                const SizedBox(height: 20),
                Text(section, style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                Text(
                  'Apno ki sehat, apno ka khayal.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Offline medicine reminders for your family. Setup is in progress; do not rely on this foundation screen for dose reminders yet.',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                FilledButton.icon(
                  onPressed: () => context.go('/medicines'),
                  icon: const Icon(Icons.medication_outlined),
                  label: const Text('Medicines'),
                ),
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  onPressed: () => context.go('/history'),
                  icon: const Icon(Icons.calendar_month_outlined),
                  label: const Text('History'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
