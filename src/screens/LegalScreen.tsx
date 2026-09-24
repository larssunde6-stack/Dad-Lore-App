import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SegmentedControl from '../components/SegmentedControl';
import { colors, fonts, radii, scrollPhysics, spacing } from '../theme/theme';
import { RootStackScreenProps } from '../navigation/types';

type Doc = 'Privacy' | 'Terms';

type Section = { heading: string; body: string };

// Condensed for on-screen reading. The full documents (PRIVACY.md /
// TERMS.md at the repo root) are the canonical source — keep these in
// sync if either changes.

const privacySections: Section[] = [
  {
    heading: 'Who we are',
    body: 'Dad Lore helps you find nearby activities worth turning into a story, and keep a private log of the ones you\'ve done.',
  },
  {
    heading: 'What we collect',
    body: 'An anonymous device identity by default (no email, password, or name required), your saved activities, your private completed-lore diary, and any reports you submit. If you choose to create an optional account, we also collect your email, a securely hashed password, and a username you pick (not required to be your real name). If you use the Map tab, your location is used on-device to sort nearby lore and is never sent to or stored on our servers.',
  },
  {
    heading: 'What we don\'t do',
    body: 'No ads. No analytics or tracking SDKs. We don\'t sell or share your data. We never ask for your name or contact information beyond the email you choose to give us if you create an account.',
  },
  {
    heading: 'What you publish is public',
    body: 'Everything above is private to your own identity. Create Your Own Activity is the one exception - if you publish an activity, its title, description, tags, and your username become visible to every user, unlike everything else listed here. Publishing requires a real account.',
  },
  {
    heading: 'Where data lives',
    body: 'Saved activities, diary entries, and reports are stored with Supabase, our backend provider, protected by database-level access rules scoped to your anonymous identity.',
  },
  {
    heading: 'Deletion',
    body: 'There isn\'t yet an in-app "delete my data" button - a known gap we intend to close. Until then, contact us to request deletion.',
  },
  {
    heading: 'Children\'s privacy',
    body: 'We don\'t knowingly collect personal information from anyone, including children under 13. The anonymous device identity is not personally identifying.',
  },
  {
    heading: 'Full policy',
    body: 'The complete Privacy Policy (PRIVACY.md) is in the project repository, including contact details and update history.',
  },
];

const termsSections: Section[] = [
  {
    heading: 'What Dad Lore is',
    body: 'A way to find activities worth turning into a story, and log the ones you\'ve actually done. Listings, including ones tagged "Certified Bad Ideas," are meant to be fun - not instructions we\'re telling you to follow.',
  },
  {
    heading: 'Use at your own risk',
    body: 'Some listed activities involve real physical risk. Dad Lore doesn\'t supervise, inspect, or guarantee the safety of any activity or location. Use good judgment, follow the law, respect private property, and participate at your own risk.',
  },
  {
    heading: 'Your content',
    body: 'Reports and any activity you publish via Create Your Own Activity must follow our community guidelines - no harassment, hate speech, sexual content, or genuinely dangerous or illegal activity presented as a serious suggestion. Published activities are public and attributed to your username.',
  },
  {
    heading: 'No warranty',
    body: 'The app is provided "as is," without warranties of any kind, to the extent allowed by law. An account is optional — without one, there\'s no guarantee your data survives a reinstall or new device.',
  },
  {
    heading: 'Liability',
    body: 'To the extent allowed by law, Dad Lore and its creators aren\'t liable for injury, loss, or damage from your use of the app or participation in any listed activity - "Certified Bad Ideas" included.',
  },
  {
    heading: 'Changes',
    body: 'We may update these terms and will update the effective date when we do. We may restrict access for anyone who violates these terms or the community guidelines.',
  },
  {
    heading: 'Full terms',
    body: 'The complete Terms of Service (TERMS.md) is in the project repository, including governing law and contact details.',
  },
];

export default function LegalScreen({ navigation }: RootStackScreenProps<'Legal'>) {
  const [doc, setDoc] = useState<Doc>('Privacy');
  const sections = doc === 'Privacy' ? privacySections : termsSections;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Privacy & Terms</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.segmentWrap}>
        <SegmentedControl
          options={['Privacy', 'Terms']}
          value={doc}
          onChange={(value) => setDoc(value as Doc)}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        decelerationRate={scrollPhysics.decelerationRate}
      >
        <View style={styles.draftNotice}>
          <MaterialCommunityIcons name="information-outline" size={14} color={colors.orangeBright} />
          <Text style={styles.draftNoticeText}>
            Draft, pending legal review before store submission.
          </Text>
        </View>

        {sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
  },
  segmentWrap: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  draftNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orangeMuted,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.orangeDeep,
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  draftNoticeText: {
    color: colors.orangeBright,
    fontSize: 11.5,
    marginLeft: spacing.xs,
    flexShrink: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    color: colors.textPrimary,
    fontSize: 14,
    ...fonts.heading,
    marginBottom: spacing.xs,
  },
  sectionBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});
