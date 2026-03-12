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
  useWindowDimensions
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../stores/LanguageContext';
import { useBarbearia } from '../../stores/BarbeariaContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Lock, User, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function BarberLogin() {
  const { t } = useLanguage();
  const { barbearia, loginBarber } = useBarbearia();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const themeColors = barbearia?.colors || COLORS;
  const primaryColor = themeColors.primary;

  const handleLogin = async () => {
    if (!email || !password) {
      if (Platform.OS === 'web') {
        window.alert('Preencha seu e-mail e senha');
      } else {
        Alert.alert('Erro', 'Preencha seu e-mail e senha');
      }
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      setIsLoading(false);
      // Busca o barbeiro na lista
      const foundBarber = barbearia?.barbers?.find(b => b.email === email && b.password === password);
      
      if (foundBarber) {
         loginBarber(foundBarber.id);
         router.replace('/admin/agenda'); // Leva direto pra agenda, pois ele é barbeiro
      } else {
         if (Platform.OS === 'web') {
           window.alert('Credenciais inválidas');
         } else {
           Alert.alert('Erro', 'Credenciais inválidas');
         }
      }
    }, 1200);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <ChevronLeft color={primaryColor} size={24} />
        <Text style={[styles.backText, { color: primaryColor }]}>{t('admin.config.back')}</Text>
      </TouchableOpacity>

      <View style={[styles.content, isMobile && { paddingHorizontal: 16 }]}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: `${primaryColor}15`, ...(SHADOWS.glow(primaryColor) as any) }]}>
            <User color={primaryColor} size={40} />
          </View>
          <Text style={[styles.brandName, { color: themeColors.text }]}>Área do Barbeiro</Text>
          <Text style={[styles.brandTagline, { color: themeColors.textMuted }]}>Gerencie sua agenda e horários</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)}>
          <Card style={[styles.loginCard, { backgroundColor: themeColors.surface }]}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.text }]}>{t('admin.email')}</Text>
                <View style={[styles.inputContainer, { backgroundColor: themeColors.surfaceLight, borderColor: themeColors.divider }]}>
                  <Mail size={20} color={themeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    placeholder="barbeiro@email.com"
                    placeholderTextColor={themeColors.textMuted}
                    style={[styles.input, { color: themeColors.text }]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.text }]}>{t('admin.password')}</Text>
                <View style={[styles.inputContainer, { backgroundColor: themeColors.surfaceLight, borderColor: themeColors.divider }]}>
                  <Lock size={20} color={themeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={themeColors.textMuted}
                    style={[styles.input, { color: themeColors.text }]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <Button 
                title={t('admin.login')} 
                onPress={handleLogin} 
                isLoading={isLoading}
                style={[styles.loginButton, { backgroundColor: primaryColor }]} 
                textStyle={{ color: themeColors.background }}
              />
            </View>
          </Card>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, position: 'absolute', top: Platform.OS === 'web' ? 20 : 40, zIndex: 10 },
  backText: { ...TYPOGRAPHY.body, marginLeft: 4 },
  content: { flex: 1, padding: SPACING.xl, justifyContent: 'center', maxWidth: 500, width: '100%', alignSelf: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: SPACING.xxl },
  logoCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  brandName: { ...TYPOGRAPHY.h2, letterSpacing: 1 },
  brandTagline: { ...TYPOGRAPHY.body, marginTop: 4 },
  loginCard: { padding: SPACING.xl },
  form: { gap: SPACING.lg },
  inputGroup: { gap: SPACING.sm },
  label: { ...TYPOGRAPHY.bodySmall, fontWeight: '600' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, height: 56, borderWidth: 1 },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, ...TYPOGRAPHY.body },
  loginButton: { marginTop: SPACING.md },
});
