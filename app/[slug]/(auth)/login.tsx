import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../../constants/theme';
import { Button } from '../../../components/ui/Button';
import { Mail, Lock, Scissors } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../../stores/LanguageContext';
import { useBarbearia } from '../../../stores/BarbeariaContext';

export default function LoginScreen() {
  const { t } = useLanguage();
  const { barbearia } = useBarbearia();
  const colors = barbearia?.colors || COLORS;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      if (Platform.OS === 'web') {
        window.alert(t('login.email') + ' / ' + t('login.password'));
      } else {
        Alert.alert('Erro', t('login.email') + ' / ' + t('login.password'));
      }
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulação de autenticação
    setTimeout(() => {
      setIsLoading(false);
      // Navega para a tela de agendamento dentro do slug da barbearia atual
      router.replace(`/${barbearia?.slug}/(tabs)/agendar`);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            {barbearia?.logo ? (
              <Image source={{ uri: barbearia.logo }} style={{ width: 80, height: 80, borderRadius: 40 }} />
            ) : (
              <Scissors color={colors.primary} size={40} />
            )}
          </View>
          <Text style={[styles.brandName, { color: colors.primary }]}>
            {barbearia?.nome || t('login.title')}
          </Text>
          <Text style={[styles.brandTagline, { color: colors.textMuted }]}>{t('login.tagline')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.form}>
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
            <Mail size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              placeholder={t('login.email')}
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.text }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
            <Lock size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              placeholder={t('login.password')}
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.text }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Pressable 
            onPress={() => {
               router.push(`/${barbearia?.slug}/(auth)/forgot-password`);
            }}
            style={styles.forgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>{t('login.forgot')}</Text>
          </Pressable>

          <Button 
            title={t('login.submit')} 
            onPress={handleLogin} 
            isLoading={isLoading}
            style={[styles.loginButton, { backgroundColor: colors.primary, ...(SHADOWS.glow(colors.primary) as any) }]} 
            textStyle={{ color: colors.background }}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)} style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>{t('login.noAccount')} </Text>
          <Pressable onPress={() => router.push(`/${barbearia?.slug}/(auth)/register`)}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>{t('login.register')}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
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
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  brandName: {
    ...TYPOGRAPHY.h1,
    letterSpacing: 1,
  },
  brandTagline: {
    ...TYPOGRAPHY.bodyLarge,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    gap: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 60,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    height: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -SPACING.sm,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '700',
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xxxl,
  },
  footerText: {
    ...TYPOGRAPHY.body,
  },
  footerLink: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
  },
});
