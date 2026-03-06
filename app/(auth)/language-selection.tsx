import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Languages } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../stores/LanguageContext';

export default function LanguageSelectionScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = React.useState<'pt' | 'es' | null>(null);

  const handleSelect = (lang: 'pt' | 'es') => {
    setSelectedLanguage(lang);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/agendar');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Languages size={48} color={COLORS.primary} />
          <Text style={styles.title}>Idioma / Idioma</Text>
          <Text style={styles.subtitle}>Como você gostaria de ser atendido?</Text>
          <Text style={styles.subtitleSpanish}>¿Cómo le gustaría ser atendido?</Text>
        </View>

        <View style={styles.options}>
          <Pressable 
            style={[styles.option, selectedLanguage === 'pt' && styles.optionActive]}
            onPress={() => handleSelect('pt')}
          >
            <Text style={styles.flag}>🇧🇷</Text>
            <View>
              <Text style={[styles.optionTitle, selectedLanguage === 'pt' && styles.textActive]}>Português</Text>
              <Text style={[styles.optionSubtitle, selectedLanguage === 'pt' && styles.textActiveMuted]}>Brasil</Text>
            </View>
          </Pressable>

          <Pressable 
            style={[styles.option, selectedLanguage === 'es' && styles.optionActive]}
            onPress={() => handleSelect('es')}
          >
            <Text style={styles.flag}>🇪🇸</Text>
            <View>
              <Text style={[styles.optionTitle, selectedLanguage === 'es' && styles.textActive]}>Español</Text>
              <Text style={[styles.optionSubtitle, selectedLanguage === 'es' && styles.textActiveMuted]}>España / Latam</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continuar / Continuar" 
          onPress={handleContinue} 
          disabled={!selectedLanguage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  subtitleSpanish: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
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
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    gap: SPACING.md,
  },
  optionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  flag: {
    fontSize: 32,
  },
  optionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  optionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  textActive: {
    color: COLORS.background,
  },
  textActiveMuted: {
    color: 'rgba(0,0,0,0.5)',
  },
  footer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
});
