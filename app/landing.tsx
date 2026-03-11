import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useLanguage } from '../stores/LanguageContext';
import { Scissors, Calendar, Layout, Smartphone, MessageCircle, Palette, CreditCard, Lock } from 'lucide-react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingPage() {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

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
        <Animated.View entering={FadeInDown.duration(800).springify()} style={[styles.hero, isMobile && styles.heroMobile]}>
          <View style={styles.heroLogo}>
            <Scissors color={COLORS.background} size={40} />
          </View>
          <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>BarberFlow <Text style={styles.highlight}>Pro</Text></Text>
          <Text style={[styles.heroSubtitle, isMobile && styles.heroSubtitleMobile]}>
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
          <Animated.Text entering={FadeInUp.delay(300).duration(600)} style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
            {t('landing.why') || "Tudo que sua barbearia precisa"}
          </Animated.Text>
          
          <View style={[styles.grid, isMobile && styles.gridMobile]}>
            {features.map((item, index) => (
              <Card key={index} animated delay={400 + (index * 100)} style={[styles.featureCard, isMobile && styles.featureCardMobile]}>
                <View style={styles.iconBox}>
                  {item.icon}
                </View>
                <Text style={[styles.featureTitle, isMobile && styles.textCenter]}>{item.title}</Text>
                <Text style={[styles.featureDescription, isMobile && styles.textCenter]}>{item.desc}</Text>
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
    paddingTop: 80,
    paddingBottom: SPACING.xxxl,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: BORDER_RADIUS.xl * 2,
    borderBottomRightRadius: BORDER_RADIUS.xl * 2,
    ...(SHADOWS.large as any),
  },
  heroMobile: {
    paddingTop: SPACING.xxl,
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
    fontSize: 48,
  },
  heroTitleMobile: {
    fontSize: 32,
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
  heroSubtitleMobile: {
    paddingHorizontal: SPACING.sm,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  ctaButton: {
    width: '100%',
  },
  section: {
    padding: SPACING.lg,
    paddingHorizontal: 16, // px-4
    paddingTop: SPACING.xxxl,
    alignItems: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.xxl,
    textAlign: 'center',
    fontSize: 32,
  },
  sectionTitleMobile: {
    fontSize: 24,
  },
  grid: {
    width: '100%',
    maxWidth: 1000,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  gridMobile: {
    flexDirection: 'column', // flex-col para mobile
    alignItems: 'center',
  },
  featureCard: {
    width: '30%',
    minWidth: 280,
    padding: SPACING.xl,
    alignItems: 'flex-start',
  },
  featureCardMobile: {
    width: '100%', // w-full
    minWidth: '100%', // overwrite minWidth on mobile
    alignItems: 'center', // centralizar os itens (ícone, título, etc) no mobile
  },
  textCenter: {
    textAlign: 'center',
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
    fontSize: 20,
  },
  featureDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    fontSize: 16,
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
