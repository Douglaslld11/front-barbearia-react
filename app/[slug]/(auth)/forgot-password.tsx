import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../../constants/theme';
import { Button } from '../../../components/ui/Button';
import { Mail, Scissors, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../../stores/LanguageContext';
import { useBarbearia } from '../../../stores/BarbeariaContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const { t } = useLanguage();
  const { barbearia } = useBarbearia();
  const colors = barbearia?.colors || COLORS;
  
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

    // Simulação de recuperação
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}
      >
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft color={colors.primary} size={24} />
          <Text style={[styles.backText, { color: colors.primary }]}>{t('book.back') || 'Voltar'}</Text>
        </Pressable>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              {barbearia?.logo ? (
                <Image source={{ uri: barbearia.logo }} style={{ width: 64, height: 64, borderRadius: 32 }} />
              ) : (
                <Scissors color={colors.primary} size={32} />
              )}
            </View>
            <Text style={[styles.brandName, { color: colors.primary }]}>
              Recuperar Senha
            </Text>
            <Text style={[styles.brandTagline, { color: colors.textMuted }]}>Enviaremos as instruções para seu e-mail.</Text>
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

            <Button 
              title="Enviar Instruções" 
              onPress={handleRecover} 
              isLoading={isLoading}
              style={[styles.loginButton, { backgroundColor: colors.primary, ...(SHADOWS.glow(colors.primary) as any) }]} 
              textStyle={{ color: colors.background }}
            />
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    ...TYPOGRAPHY.body,
    marginLeft: 4,
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    paddingTop: Platform.OS === 'web' ? 80 : 60,
    paddingBottom: 60,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  brandName: {
    ...TYPOGRAPHY.h1,
    letterSpacing: 1,
  },
  brandTagline: {
    ...TYPOGRAPHY.body,
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
  loginButton: {
    marginTop: SPACING.md,
  },
});
