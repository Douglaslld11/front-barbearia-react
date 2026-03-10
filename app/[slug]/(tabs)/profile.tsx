import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../../constants/theme';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { User, Settings, CreditCard, Bell, LogOut, ChevronRight } from 'lucide-react-native';
import { useLanguage } from '../../../stores/LanguageContext';
import { useBarbearia } from '../../../stores/BarbeariaContext';

export default function ProfileScreen() {
  const { t } = useLanguage();
  const { barbearia } = useBarbearia();
  const colors = barbearia?.colors || COLORS;

  const MENU_ITEMS = [
    { id: '1', title: t('profile.personal'), icon: <User size={20} color={colors.primary} /> },
    { id: '2', title: t('profile.payments'), icon: <CreditCard size={20} color={colors.primary} /> },
    { id: '3', title: t('profile.notifications'), icon: <Bell size={20} color={colors.primary} /> },
    { id: '4', title: t('profile.settings'), icon: <Settings size={20} color={colors.primary} /> },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <View style={[styles.avatarContainer, { borderColor: colors.primary, ...(SHADOWS.glow(colors.primary) as any) }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
              style={styles.avatar}
            />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>Douglas Cavalcante</Text>
          <Text style={[styles.userEmail, { color: colors.textMuted }]}>douglas@example.com</Text>
          <Button 
            title={t('profile.edit')} 
            variant="outline" 
            style={[styles.editButton, { borderColor: colors.primary }]} 
            onPress={() => {}} 
          />
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: colors.surface }]} variant="elevated">
            <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t('profile.cuts')}</Text>
          </Card>
          <Card style={[styles.statCard, { backgroundColor: colors.surface }]} variant="elevated">
            <Text style={[styles.statNumber, { color: colors.primary }]}>450</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t('profile.points')}</Text>
          </Card>
        </Animated.View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInUp.delay(300 + index * 100)}>
              <TouchableOpacity activeOpacity={0.7}>
                <Card style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.divider }]} variant="outline">
                  <View style={styles.menuContent}>
                    <View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                      {item.icon}
                    </View>
                    <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                    <ChevronRight size={20} color={colors.textMuted} />
                  </View>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Logout */}
        <Animated.View entering={FadeInUp.delay(700)} style={styles.footer}>
          <TouchableOpacity style={styles.logoutBtn}>
            <LogOut size={20} color={COLORS.error} />
            <Text style={[styles.logoutText, { color: COLORS.error }]}>{t('profile.logoutConfirm')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  avatarContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    padding: 2,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    marginBottom: 4,
  },
  userEmail: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.xl,
  },
  editButton: {
    width: 160,
    minHeight: 44,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
  },
  statNumber: {
    ...TYPOGRAPHY.h1,
    marginBottom: 4,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
  },
  menuSection: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  menuItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuTitle: {
    flex: 1,
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
  },
});
