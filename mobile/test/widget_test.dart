import 'package:flutter_test/flutter_test.dart';
import 'package:sehat_parivaar/app.dart';

void main() {
  testWidgets('app shows SehatParivaar branding', (tester) async {
    await tester.pumpWidget(const SehatParivaarApp());
    expect(find.text('SehatParivaar'), findsOneWidget);
    expect(find.text('Apno ki sehat, apno ka khayal.'), findsOneWidget);
  });
}
