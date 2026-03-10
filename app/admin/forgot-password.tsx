import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../stores/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Scissors, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRecover = async () => {
    if (!email) {
      if (Platform.OS === 'web') {
        window.alert(t('admin.config.fill_all') || 'Preencha o e-mail');
      } else {
        Alert.alert('Erro', t('admin.config.fill_all') || 'Preencha o e-mail');
      }
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Mock recover
    setTimeout(() => {
      setIsLoading(false);
      if (Platform.OS === 'web') {
        window.alert('Instruções enviadas para o seu e-mail.');
      } else {
        Alert.alert('Sucesso', 'Instruções enviadas para o seu e-mail.');
      }
      router.back();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft color={COLORS.primary} size={24} />
          <Text style={styles.backText}>{t('admin.config.back') || 'Voltar'}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <View style={styles.logoCircle}>
              <Scissors color={COLORS.primary} size={32} />
            </View>
            <Text style={styles.title}>Recuperar Senha</Text>
            <Text style={styles.subtitle}>Digite seu e-mail para receber as instruções de recuperação de senha.</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200)}>
            <Card style={styles.formCard}>
              <View style={styles.form}>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t('admin.email') || 'E-mail'}</Text>
                  <View style={styles.inputContainer}>
                    <Mail size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                    <TextInput
                      placeholder="seu@email.com"
                      placeholderTextColor={COLORS.textMuted}
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <Button 
                  title="Enviar Instruções" 
                  onPress={handleRecover} 
                  isLoading={isLoading}
                  style={styles.submitButton} 
                />
              </View>
            </Card>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 0,
    zIndex: 10,
  },
  backText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.body,
    marginLeft: 4,
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...(SHADOWS.glow(COLORS.primary) as any),
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: '80%',
  },
  formCard: {
    padding: SPACING.xl,
  },
  form: {
    gap: SPACING.lg,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.surfaceLight,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    ...TYPOGRAPHY.body,
    height: '100%',
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});
