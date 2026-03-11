import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useLanguage } from '../stores/LanguageContext';
import { Scissors, Calendar, Layout, Smartphone, MessageCircle, Palette, CreditCard, Lock } from 'lucide-react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function LandingPage() {
  const { t } = useLanguage();

  const handleViewDemo = () => {
    router.push('/vintage-barber');
  };

  const handleAdmin = () => {
    router.push('/admin/login');
  };

  const features = [
    {
      icon: <Layout color={COLORS.primary} size={28} />,
      title: t('landing.feature1.title'),
      desc: t('landing.feature1.desc')
    },
    {
      icon: <Palette color={COLORS.primary} size={28} />,
      title: t('landing.feature2.title'),
      desc: t('landing.feature2.desc')
    },
    {
      icon: <CreditCard color={COLORS.primary} size={28} />,
      title: t('landing.feature3.title'),
      desc: t('landing.feature3.desc')
    },
    {
      icon: <MessageCircle color={COLORS.primary} size={28} />,
      title: t('landing.feature4.title'),
      desc: t('landing.feature4.desc')
    },
    {
      icon: <Calendar color={COLORS.primary} size={28} />,
      title: t('landing.feature5.title'),
      desc: t('landing.feature5.desc')
    },
    {
      icon: <Smartphone color={COLORS.primary} size={28} />,
      title: t('landing.feature6.title'),
      desc: t('landing.feature6.desc')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.hero}>
          <View style={styles.heroLogo}>
            <Scissors color={COLORS.background} size={40} />
          </View>
          <Text style={styles.heroTitle}>BarberFlow <Text style={styles.highlight}>Pro</Text></Text>
          <Text style={styles.heroSubtitle}>
            {t('landing.subtitle')}
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              title={t('landing.demo') || "Ver Demonstração"} 
              onPress={handleViewDemo} 
              style={styles.ctaButton}
              textStyle={{ color: COLORS.background }}
            />
            <Button 
              title={t('landing.admin') || "Painel do Barbeiro"} 
              variant="outline" 
              onPress={handleAdmin} 
              style={styles.ctaButton}
            />
          </View>
        </Animated.View>

        {/* Features */}
        <View style={styles.section}>
          <Animated.Text entering={FadeInUp.delay(300).duration(600)} style={styles.sectionTitle}>
            {t('landing.why') || "Tudo que sua barbearia precisa"}
          </Animated.Text>
          
          <View style={styles.grid}>
            {features.map((item, index) => (
              <Card key={index} animated delay={400 + (index * 100)} style={styles.featureCard}>
                <View style={styles.iconBox}>
                  {item.icon}
                </View>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDescription}>{item.desc}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(1000)} style={styles.footer}>
          <Text style={styles.footerText}>{t('landing.footer')}</Text>
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
    paddingBottom: 100,
  },
  hero: {
    paddingHorizontal: SPACING.xl,
    paddingTop: isMobile ? SPACING.xxl : 80,
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
    fontSize: isMobile ? 32 : 48,
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
    paddingHorizontal: isMobile ? SPACING.sm : 0,
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
    padding: SPACING.lg,
    paddingTop: SPACING.xxxl,
    alignItems: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.xxl,
    textAlign: 'center',
    fontSize: isMobile ? 24 : 32,
  },
  grid: {
    width: '100%',
    maxWidth: 1000,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  featureCard: {
    width: isMobile ? '100%' : '30%',
    minWidth: isMobile ? 'auto' : 280,
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
    fontSize: isMobile ? 18 : 20,
  },
  featureDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    fontSize: isMobile ? 14 : 16,
  },
  footer: {
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
