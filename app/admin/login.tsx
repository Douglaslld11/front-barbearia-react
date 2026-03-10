import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  TouchableOpacity,
  Pressable
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../stores/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Lock, Scissors, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function AdminLogin() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      if (Platform.OS === 'web') {
        window.alert(t('admin.login.error') || 'Preencha seu e-mail e senha');
      } else {
        Alert.alert('Erro', t('admin.login.error') || 'Preencha seu e-mail e senha');
      }
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      setIsLoading(false);
      router.replace('/admin/dashboard');
    }, 1200);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <ChevronLeft color={COLORS.primary} size={24} />
        <Text style={styles.backText}>{t('admin.config.back')}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Scissors color={COLORS.primary} size={40} />
          </View>
          <Text style={styles.brandName}>BarberFlow</Text>
          <Text style={styles.brandTagline}>{t('admin.welcome')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)}>
          <Card style={styles.loginCard}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('admin.email')}</Text>
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('admin.password')}</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <Pressable 
                onPress={() => {
                   router.push('/admin/forgot-password');
                }}
                style={styles.forgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </Pressable>

              <Button 
                title={t('admin.login')} 
                onPress={handleLogin} 
                isLoading={isLoading}
                style={styles.loginButton} 
              />
              </View>
              </Card>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(400)} style={styles.footer}>
              <Text style={styles.footerText}>{t('admin.noAccount')} </Text>
              <TouchableOpacity onPress={() => router.push('/admin/register')}>
              <Text style={styles.footerLink}>{t('admin.register')}</Text>
              </TouchableOpacity>
              </Animated.View>      </View>
    </KeyboardAvoidingView>
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
    top: Platform.OS === 'web' ? 20 : 40,
    zIndex: 10,
  },
  backText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.body,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...(SHADOWS.glow(COLORS.primary) as any),
  },
  brandName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    letterSpacing: 2,
  },
  brandTagline: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  loginCard: {
    padding: SPACING.xl,
  },
  form: {
    gap: SPACING.lg,
  },
  inputGroup: {
    gap: SPACING.sm,
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
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xxl,
  },
  footerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
  },
  footerLink: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
