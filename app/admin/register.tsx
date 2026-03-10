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
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../stores/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Lock, Scissors, ChevronLeft, User, Phone, Store } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminRegister() {
  const { t } = useLanguage();
  const [shopName, setShopName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!shopName || !name || !email || !password) {
      if (Platform.OS === 'web') {
        window.alert(t('admin.config.fill_all') || 'Preencha todos os campos');
      } else {
        Alert.alert('Erro', t('admin.config.fill_all') || 'Preencha todos os campos');
      }
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Mock register
    setTimeout(() => {
      setIsLoading(false);
      if (Platform.OS === 'web') {
        window.alert('Cadastro realizado com sucesso! Faça login.');
      } else {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Faça login.');
      }
      router.replace('/admin/login');
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

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <View style={styles.logoCircle}>
              <Scissors color={COLORS.primary} size={32} />
            </View>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Junte-se ao BarberFlow Pro e digitalize sua barbearia.</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200)}>
            <Card style={styles.formCard}>
              <View style={styles.form}>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome da Barbearia</Text>
                  <View style={styles.inputContainer}>
                    <Store size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                    <TextInput
                      placeholder="Sua Barbearia"
                      placeholderTextColor={COLORS.textMuted}
                      style={styles.input}
                      value={shopName}
                      onChangeText={setShopName}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Seu Nome</Text>
                  <View style={styles.inputContainer}>
                    <User size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                    <TextInput
                      placeholder="João da Silva"
                      placeholderTextColor={COLORS.textMuted}
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>

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

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Telefone (WhatsApp)</Text>
                  <View style={styles.inputContainer}>
                    <Phone size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                    <TextInput
                      placeholder="(00) 00000-0000"
                      placeholderTextColor={COLORS.textMuted}
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t('admin.password') || 'Senha'}</Text>
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

                <Button 
                  title="Cadastrar e Continuar" 
                  onPress={handleRegister} 
                  isLoading={isLoading}
                  style={styles.submitButton} 
                />
              </View>
            </Card>
          </Animated.View>
        </ScrollView>
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
    padding: SPACING.xl,
    paddingTop: Platform.OS === 'web' ? 80 : 60,
    paddingBottom: 60,
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
