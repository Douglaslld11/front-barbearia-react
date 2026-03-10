import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../stores/LanguageContext';
import { useBarbearia } from '../../stores/BarbeariaContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Scissors, Languages } from 'lucide-react-native';

export default function TenantLanguageSelection() {
  const { setLanguage, t } = useLanguage();
  const { barbearia, isLoading } = useBarbearia();
  const { slug } = useLocalSearchParams();

  const handleSelect = (lang: 'pt' | 'es') => {
    setLanguage(lang);
    router.push(`/${slug}/(tabs)/agendar`);
  };

  if (isLoading) return null;

  const colors = barbearia?.colors || COLORS;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        
        {/* Logo da Barbearia */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            {barbearia?.logo ? (
              <Image source={{ uri: barbearia.logo }} style={styles.logoImage} />
            ) : (
              <Scissors color={colors.primary} size={40} />
            )}
          </View>
          <Text style={[styles.brandName, { color: colors.text }]}>
            {barbearia?.nome || "BarberFlow"}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Selecione seu idioma</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Como deseja continuar?</Text>
        </Animated.View>

        <View style={styles.options}>
          <Animated.View entering={FadeInUp.delay(400)}>
            <TouchableOpacity 
              style={[styles.langCard, { backgroundColor: colors.surface, borderColor: colors.divider }]} 
              onPress={() => handleSelect('pt')}
            >
              <Text style={styles.flag}>🇧🇷</Text>
              <View style={styles.langInfo}>
                <Text style={[styles.langName, { color: colors.text }]}>Português</Text>
                <Text style={[styles.langDesc, { color: colors.textMuted }]}>Preços em Real (R$)</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500)}>
            <TouchableOpacity 
              style={[styles.langCard, { backgroundColor: colors.surface, borderColor: colors.divider }]} 
              onPress={() => handleSelect('es')}
            >
              <Text style={styles.flag}>🇪🇸</Text>
              <View style={styles.langInfo}>
                <Text style={[styles.langName, { color: colors.text }]}>Español</Text>
                <Text style={[styles.langDesc, { color: colors.textMuted }]}>Precios en Guaraníes (GS)</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: SPACING.xl, justifyContent: 'center', maxWidth: 500, width: '100%', alignSelf: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: SPACING.xxxl },
  logoCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md, borderWidth: 2 },
  logoImage: { width: 100, height: 100, borderRadius: 50 },
  brandName: { ...TYPOGRAPHY.h2, letterSpacing: 1, fontWeight: '800' },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  title: { ...TYPOGRAPHY.h3, marginBottom: 8 },
  subtitle: { ...TYPOGRAPHY.bodySmall },
  options: { gap: SPACING.md },
  langCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.xl, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, ...(SHADOWS.medium as any) },
  flag: { fontSize: 32, marginRight: SPACING.lg },
  langInfo: { flex: 1 },
  langName: { ...TYPOGRAPHY.h4, fontWeight: '700' },
  langDesc: { ...TYPOGRAPHY.caption }
});
