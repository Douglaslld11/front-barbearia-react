import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Settings, CreditCard, Bell, LogOut, ChevronRight } from 'lucide-react-native';
import { useLanguage } from '../../stores/LanguageContext';

export default function ProfileScreen() {
  const { t } = useLanguage();

  const MENU_ITEMS = [
    { id: '1', title: t('profile.personal'), icon: <User size={20} color={COLORS.textMuted} /> },
    { id: '2', title: t('profile.payments'), icon: <CreditCard size={20} color={COLORS.textMuted} /> },
    { id: '3', title: t('profile.notifications'), icon: <Bell size={20} color={COLORS.textMuted} /> },
    { id: '4', title: t('profile.settings'), icon: <Settings size={20} color={COLORS.textMuted} /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Douglas Cavalcante</Text>
          <Text style={styles.userEmail}>douglas@example.com</Text>
          <Button title={t('profile.edit')} variant="outline" style={styles.editButton} onPress={() => {}} />
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard} variant="flat">
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>{t('profile.cuts')}</Text>
          </Card>
          <Card style={styles.statCard} variant="flat">
            <Text style={styles.statNumber}>450</Text>
            <Text style={styles.statLabel}>{t('profile.points')}</Text>
          </Card>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <Card key={item.id} style={styles.menuItem} variant="outline">
              <View style={styles.menuContent}>
                <View style={styles.menuIconContainer}>{item.icon}</View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <ChevronRight size={20} color={COLORS.textMuted} />
              </View>
            </Card>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <Button
            title={t('profile.logout')}
            variant="ghost"
            onPress={() => {}}
            style={styles.logoutButton}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: SPACING.md }}>
            <LogOut size={16} color={COLORS.error} />
            <Text style={{ ...TYPOGRAPHY.caption, color: COLORS.error }}>{t('profile.logoutConfirm')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  userEmail: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  editButton: {
    width: 140,
    minHeight: 40,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  menuSection: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  menuItem: {
    paddingVertical: SPACING.md,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuTitle: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
  },
});
