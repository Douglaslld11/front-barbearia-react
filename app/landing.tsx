import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useLanguage } from '../stores/LanguageContext';
import { Scissors, Calendar, Layout, Smartphone } from 'lucide-react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingPage() {
  const { t } = useLanguage();

  const handleViewDemo = () => {
    router.push('/vintage-barber');
  };

  const handleAdmin = () => {
    // A seleção de idioma já foi feita no index.tsx, então vamos direto para o login
    router.push('/admin/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.hero}>
          <View style={styles.heroLogo}>
            <Scissors color={COLORS.background} size={40} />
          </View>
          <Text style={styles.heroTitle}>BarberFlow <Text style={styles.highlight}>SaaS</Text></Text>
          <Text style={styles.heroSubtitle}>{t('landing.subtitle')}</Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              title={t('landing.demo')} 
              onPress={handleViewDemo} 
              style={styles.ctaButton}
              textStyle={{ color: COLORS.background }}
            />
            <Button 
              title={t('landing.admin')} 
              variant="outline" 
              onPress={handleAdmin} 
              style={styles.ctaButton}
            />
          </View>
        </Animated.View>

        {/* Features */}
        <View style={styles.section}>
          <Animated.Text entering={FadeInUp.delay(300).duration(600)} style={styles.sectionTitle}>
            {t('landing.why')}
          </Animated.Text>
          
          <View style={styles.grid}>
            <Card animated delay={400} style={styles.featureCard}>
              <View style={styles.iconBox}>
                <Layout color={COLORS.primary} size={28} />
              </View>
              <Text style={styles.featureTitle}>{t('landing.feature1.title')}</Text>
              <Text style={styles.featureDescription}>{t('landing.feature1.desc')}</Text>
            </Card>

            <Card animated delay={500} style={styles.featureCard}>
              <View style={styles.iconBox}>
                <Calendar color={COLORS.primary} size={28} />
              </View>
              <Text style={styles.featureTitle}>{t('landing.feature2.title')}</Text>
              <Text style={styles.featureDescription}>{t('landing.feature2.desc')}</Text>
            </Card>

            <Card animated delay={600} style={styles.featureCard}>
              <View style={styles.iconBox}>
                <Smartphone color={COLORS.primary} size={28} />
              </View>
              <Text style={styles.featureTitle}>{t('landing.feature3.title')}</Text>
              <Text style={styles.featureDescription}>{t('landing.feature3.desc')}</Text>
            </Card>
          </View>
        </View>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.footer}>
          <Text style={styles.footerText}>© 2026 BarberFlow. Criado com React Native.</Text>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingHorizontal: SPACING.xl,
    paddingTop: Platform.OS === 'web' ? 80 : 40,
    paddingBottom: SPACING.xxxl,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: BORDER_RADIUS.xl * 2,
    borderBottomRightRadius: BORDER_RADIUS.xl * 2,
    ...(SHADOWS.large as any),
  },
  heroLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...(SHADOWS.glow(COLORS.primary) as any),
  },
  heroTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  highlight: {
    color: COLORS.primary,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    maxWidth: 600,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: SPACING.md,
  },
  ctaButton: {
    width: '100%',
  },
  section: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxxl,
    alignItems: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.xxl,
    textAlign: 'center',
  },
  grid: {
    width: '100%',
    maxWidth: 1000,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  featureCard: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    minWidth: Platform.OS === 'web' ? 300 : '100%',
    padding: SPACING.xl,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  featureTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  featureDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  footer: {
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
});
