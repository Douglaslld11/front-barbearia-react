import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { Button } from '../../../components/ui/Button';
import { Languages } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../../stores/LanguageContext';
import { useBarbearia } from '../../../stores/BarbeariaContext';

export default function LanguageSelectionScreen() {
  const { language, setLanguage, t } = useLanguage();
  const { barbearia } = useBarbearia();
  const colors = barbearia?.colors || COLORS;
  
  const [selectedLanguage, setSelectedLanguage] = React.useState<'pt' | 'es' | null>(null);

  const handleSelect = (lang: 'pt' | 'es') => {
    setSelectedLanguage(lang);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(`/${barbearia?.slug}/login`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Languages size={48} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Idioma / Idioma</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Como você gostaria de ser atendido?</Text>
          <Text style={[styles.subtitleSpanish, { color: colors.textMuted }]}>¿Cómo le gostaria ser atendido?</Text>
        </View>

        <View style={styles.options}>
          <Pressable 
            style={[
              styles.option, 
              { backgroundColor: colors.card, borderColor: colors.divider },
              selectedLanguage === 'pt' && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => handleSelect('pt')}
          >
            <Text style={styles.flag}>🇧🇷</Text>
            <View>
              <Text style={[styles.optionTitle, { color: colors.text }, selectedLanguage === 'pt' && { color: colors.background }]}>Português</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textMuted }, selectedLanguage === 'pt' && { color: 'rgba(0,0,0,0.5)' }]}>Brasil</Text>
            </View>
          </Pressable>

          <Pressable 
            style={[
              styles.option, 
              { backgroundColor: colors.card, borderColor: colors.divider },
              selectedLanguage === 'es' && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => handleSelect('es')}
          >
            <Text style={styles.flag}>🇪🇸</Text>
            <View>
              <Text style={[styles.optionTitle, { color: colors.text }, selectedLanguage === 'es' && { color: colors.background }]}>Español</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textMuted }, selectedLanguage === 'es' && { color: 'rgba(0,0,0,0.5)' }]}>España / Latam</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continuar / Continuar" 
          onPress={handleContinue} 
          disabled={!selectedLanguage}
          style={selectedLanguage ? { backgroundColor: colors.primary } : {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginTop: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    marginTop: 8,
    textAlign: 'center',
  },
  subtitleSpanish: {
    ...TYPOGRAPHY.body,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  options: {
    gap: SPACING.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.md,
  },
  flag: {
    fontSize: 32,
  },
  optionTitle: {
    ...TYPOGRAPHY.h3,
  },
  optionSubtitle: {
    ...TYPOGRAPHY.caption,
  },
  footer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
});
