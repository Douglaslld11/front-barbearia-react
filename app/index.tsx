import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useLanguage } from '../stores/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Languages, Scissors } from 'lucide-react-native';

export default function RootLanguageSelection() {
  const { setLanguage } = useLanguage();

  const handleSelect = (lang: 'pt' | 'es') => {
    setLanguage(lang);
    router.replace('/landing');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Scissors color={COLORS.primary} size={40} />
          </View>
          <Text style={styles.brandName}>BarberFlow</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
          <Text style={styles.title}>Selecione seu idioma</Text>
          <Text style={styles.subtitle}>Seleccione su idioma para continuar</Text>
        </Animated.View>

        <View style={styles.options}>
          <Animated.View entering={FadeInUp.delay(400)}>
            <TouchableOpacity 
              style={styles.langCard} 
              onPress={() => handleSelect('pt')}
            >
              <Text style={styles.flag}>🇧🇷</Text>
              <View style={styles.langInfo}>
                <Text style={styles.langName}>Português</Text>
                <Text style={styles.langDesc}>Bem-vindo ao sistema</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500)}>
            <TouchableOpacity 
              style={styles.langCard} 
              onPress={() => handleSelect('es')}
            >
              <Text style={styles.flag}>🇪🇸</Text>
              <View style={styles.langInfo}>
                <Text style={styles.langName}>Español</Text>
                <Text style={styles.langDesc}>Bienvenido al sistema</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.xl, justifyContent: 'center', maxWidth: 500, width: '100%', alignSelf: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: SPACING.xxxl },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: `${COLORS.primary}15`, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.primary },
  brandName: { ...TYPOGRAPHY.h1, color: COLORS.text, letterSpacing: 2 },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  title: { ...TYPOGRAPHY.h2, color: COLORS.text, marginBottom: 8 },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.textMuted },
  options: { gap: SPACING.md },
  langCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, borderColor: COLORS.divider, ...(SHADOWS.medium as any) },
  flag: { fontSize: 32, marginRight: SPACING.lg },
  langInfo: { flex: 1 },
  langName: { ...TYPOGRAPHY.h3, color: COLORS.text },
  langDesc: { ...TYPOGRAPHY.caption, color: COLORS.textMuted }
});
