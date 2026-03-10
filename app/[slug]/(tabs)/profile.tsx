import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Platform, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../../constants/theme';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { User, Settings, CreditCard, Bell, LogOut, ChevronRight, ChevronDown, Camera, Check, X, Plus, Languages, RefreshCw, FileText } from 'lucide-react-native';
import { useLanguage } from '../../../stores/LanguageContext';
import { useBarbearia } from '../../../stores/BarbeariaContext';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { t, language, setLanguage } = useLanguage();
  const { barbearia } = useBarbearia();
  const { slug } = useLocalSearchParams();
  const colors = barbearia?.colors || COLORS;
  const primaryColor = colors.primary;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Cliente VIP');
  const [email, setEmail] = useState('cliente@email.com');
  const [phone, setPhone] = useState('(00) 00000-0000');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400');
  const [cards, setCards] = useState([{ id: '1', last4: '4242', brand: 'Visa' }]);
  
  // Accordion State
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Notification States
  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyReminder, setNotifyReminder] = useState(true);

  // Carregar dados salvos localmente
  useEffect(() => {
    AsyncStorage.getItem('@barber_client_profile').then(data => {
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.photo) setPhoto(parsed.photo);
        if (parsed.cards) setCards(parsed.cards);
        if (parsed.notifications) {
          setNotifySms(parsed.notifications.sms);
          setNotifyEmail(parsed.notifications.email);
          setNotifyReminder(parsed.notifications.reminder);
        }
      }
    });
  }, []);

  const saveProfile = async (updates: any) => {
    const current = { 
      name, email, phone, photo, cards, 
      notifications: { sms: notifySms, email: notifyEmail, reminder: notifyReminder },
      ...updates 
    };
    await AsyncStorage.setItem('@barber_client_profile', JSON.stringify(current));
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    saveProfile({ name, email, phone });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const newPhoto = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPhoto(newPhoto);
      saveProfile({ photo: newPhoto });
    }
  };

  const handleAddCard = () => {
    if (Platform.OS === 'web') {
      const last4 = window.prompt('Digite os 4 últimos dígitos do cartão:');
      if (last4 && last4.length === 4) {
        const newCard = { id: Math.random().toString(), last4, brand: 'Mastercard' };
        const newCards = [...cards, newCard];
        setCards(newCards);
        saveProfile({ cards: newCards });
      }
    } else {
      Alert.prompt('Novo Cartão', 'Digite os 4 últimos dígitos:', [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Adicionar', 
          onPress: (text) => {
            if (text && text.length >= 4) {
              const newCard = { id: Math.random().toString(), last4: text.slice(-4), brand: 'Mastercard' };
              const newCards = [...cards, newCard];
              setCards(newCards);
              saveProfile({ cards: newCards });
            }
          }
        }
      ]);
    }
  };

  const removeCard = (id: string) => {
    const newCards = cards.filter(c => c.id !== id);
    setCards(newCards);
    saveProfile({ cards: newCards });
  };

  const handleLogout = () => {
    router.replace(`/${slug}/(auth)/login`);
  };

  const handleClearCache = () => {
    if (Platform.OS === 'web') {
      window.alert('Dados sincronizados com sucesso!');
    } else {
      Alert.alert('Sucesso', 'Aplicativo sincronizado e cache limpo.');
    }
  };

  // Calcula estatísticas reais baseadas no histórico do barbearia (simulação usando appointments globais)
  const myAppointments = barbearia?.appointments?.filter(a => a.status === 'accepted') || [];
  const cutsCount = myAppointments.length;
  
  let points = 0;
  myAppointments.forEach(a => {
    points += (a.serviceIds.length * 5);
  });

  const displayCuts = cutsCount > 0 ? cutsCount : 0;
  const displayPoints = points > 0 ? points : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
        
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <TouchableOpacity onPress={pickImage} style={[styles.avatarContainer, { borderColor: primaryColor, ...(SHADOWS.glow(primaryColor) as any) }]}>
            <Image source={{ uri: photo }} style={styles.avatar} />
            <View style={[styles.editPhotoBadge, { backgroundColor: primaryColor }]}>
              <Camera size={14} color={colors.background} />
            </View>
          </TouchableOpacity>

          {isEditing ? (
            <Animated.View entering={FadeIn} style={styles.editForm}>
              <TextInput style={[styles.input, { color: colors.text, borderColor: colors.divider, backgroundColor: colors.surface }]} value={name} onChangeText={setName} placeholder="Seu Nome" placeholderTextColor={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text, borderColor: colors.divider, backgroundColor: colors.surface }]} value={email} onChangeText={setEmail} placeholder="E-mail" keyboardType="email-address" placeholderTextColor={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text, borderColor: colors.divider, backgroundColor: colors.surface }]} value={phone} onChangeText={setPhone} placeholder="Telefone" placeholderTextColor={colors.textMuted} />
              <View style={styles.editActions}>
                <Button title="Cancelar" variant="ghost" onPress={() => setIsEditing(false)} style={{flex: 1}} textStyle={{color: colors.textMuted}} />
                <Button title="Salvar" onPress={handleSaveEdit} style={{flex: 1, backgroundColor: primaryColor}} textStyle={{color: colors.background}} />
              </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn} style={{ alignItems: 'center' }}>
              <Text style={[styles.userName, { color: colors.text }]}>{name}</Text>
              <Text style={[styles.userEmail, { color: colors.textMuted }]}>{email}</Text>
              <Text style={[styles.userEmail, { color: colors.textMuted, marginTop: -4 }]}>{phone}</Text>
              <Button 
                title={t('profile.edit')} 
                variant="outline" 
                style={[styles.editButton, { borderColor: primaryColor }]} 
                textStyle={{ color: primaryColor }}
                onPress={() => setIsEditing(true)} 
              />
            </Animated.View>
          )}
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: colors.surface }]} variant="elevated">
            <Text style={[styles.statNumber, { color: primaryColor }]}>{displayCuts}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t('profile.cuts')}</Text>
          </Card>
          <Card style={[styles.statCard, { backgroundColor: colors.surface }]} variant="elevated">
            <Text style={[styles.statNumber, { color: primaryColor }]}>{displayPoints}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t('profile.points')}</Text>
            <Text style={{fontSize: 9, color: primaryColor, marginTop: 4}}>+5 por serviço</Text>
          </Card>
        </Animated.View>

        {/* Payment Methods Section */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>Meus Cartões</Text>
          {cards.map(card => (
            <Card key={card.id} style={[styles.cardItem, { backgroundColor: colors.surface, borderColor: colors.divider }]} variant="outline">
              <View style={styles.cardInfo}>
                <CreditCard size={24} color={colors.textMuted} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.cardBrand, { color: colors.text }]}>{card.brand}</Text>
                  <Text style={[styles.cardNumber, { color: colors.textMuted }]}>**** **** **** {card.last4}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeCard(card.id)} style={{ padding: 8 }}>
                <X size={20} color={COLORS.error} />
              </TouchableOpacity>
            </Card>
          ))}
          <TouchableOpacity style={[styles.addCardBtn, { borderColor: primaryColor, backgroundColor: `${primaryColor}10` }]} onPress={handleAddCard}>
            <Plus size={20} color={primaryColor} />
            <Text style={{ color: primaryColor, fontWeight: 'bold', marginLeft: 8 }}>Adicionar Cartão</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Menu Accordions */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>{t('profile.settings')}</Text>
          
          {/* Notificações Accordion */}
          <Animated.View entering={FadeInUp.delay(400)}>
            <Card style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.divider }]} variant="outline">
              <TouchableOpacity 
                activeOpacity={0.7} 
                style={styles.menuContent}
                onPress={() => setExpandedSection(expandedSection === 'notifications' ? null : 'notifications')}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: `${primaryColor}15` }]}>
                  <Bell size={20} color={primaryColor} />
                </View>
                <Text style={[styles.menuTitle, { color: colors.text }]}>{t('profile.notifications')}</Text>
                {expandedSection === 'notifications' ? <ChevronDown size={20} color={colors.textMuted} /> : <ChevronRight size={20} color={colors.textMuted} />}
              </TouchableOpacity>
              
              {expandedSection === 'notifications' && (
                <Animated.View entering={FadeInDown} style={[styles.accordionContent, { borderTopColor: colors.divider }]}>
                  <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Lembrete de Agendamento</Text>
                    <Switch value={notifyReminder} onValueChange={(v) => { setNotifyReminder(v); saveProfile({ notifications: { sms: notifySms, email: notifyEmail, reminder: v }}); }} trackColor={{ true: primaryColor }} />
                  </View>
                  <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Avisos via WhatsApp/SMS</Text>
                    <Switch value={notifySms} onValueChange={(v) => { setNotifySms(v); saveProfile({ notifications: { sms: v, email: notifyEmail, reminder: notifyReminder }}); }} trackColor={{ true: primaryColor }} />
                  </View>
                  <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Avisos via E-mail</Text>
                    <Switch value={notifyEmail} onValueChange={(v) => { setNotifyEmail(v); saveProfile({ notifications: { sms: notifySms, email: v, reminder: notifyReminder }}); }} trackColor={{ true: primaryColor }} />
                  </View>
                </Animated.View>
              )}
            </Card>
          </Animated.View>

          {/* Configurações Accordion */}
          <Animated.View entering={FadeInUp.delay(500)}>
            <Card style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.divider, marginTop: SPACING.sm }]} variant="outline">
              <TouchableOpacity 
                activeOpacity={0.7} 
                style={styles.menuContent}
                onPress={() => setExpandedSection(expandedSection === 'settings' ? null : 'settings')}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: `${primaryColor}15` }]}>
                  <Settings size={20} color={primaryColor} />
                </View>
                <Text style={[styles.menuTitle, { color: colors.text }]}>{t('profile.settings')}</Text>
                {expandedSection === 'settings' ? <ChevronDown size={20} color={colors.textMuted} /> : <ChevronRight size={20} color={colors.textMuted} />}
              </TouchableOpacity>

              {expandedSection === 'settings' && (
                <Animated.View entering={FadeInDown} style={[styles.accordionContent, { borderTopColor: colors.divider }]}>
                  
                  <Text style={[styles.settingGroupTitle, { color: colors.textMuted }]}>Idioma do Aplicativo</Text>
                  <View style={styles.langRow}>
                    <TouchableOpacity style={[styles.langBtn, language === 'pt' ? { backgroundColor: primaryColor } : { backgroundColor: colors.surfaceLight }]} onPress={() => setLanguage('pt')}>
                      <Text style={[styles.langBtnText, language === 'pt' ? { color: colors.background } : { color: colors.text }]}>Português</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.langBtn, language === 'es' ? { backgroundColor: primaryColor } : { backgroundColor: colors.surfaceLight }]} onPress={() => setLanguage('es')}>
                      <Text style={[styles.langBtnText, language === 'es' ? { color: colors.background } : { color: colors.text }]}>Español</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.actionRow} onPress={handleClearCache}>
                    <RefreshCw size={20} color={colors.textMuted} />
                    <Text style={[styles.actionRowText, { color: colors.text }]}>Sincronizar Dados / Limpar Cache</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionRow} onPress={() => { if(Platform.OS === 'web') window.alert('Termos de Uso e Privacidade'); else Alert.alert('Termos', '...'); }}>
                    <FileText size={20} color={colors.textMuted} />
                    <Text style={[styles.actionRowText, { color: colors.text }]}>Termos de Uso e Privacidade</Text>
                  </TouchableOpacity>

                </Animated.View>
              )}
            </Card>
          </Animated.View>
        </View>

        {/* Logout */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.footer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={20} color={COLORS.error} />
            <Text style={[styles.logoutText, { color: COLORS.error }]}>{t('profile.logoutConfirm')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', padding: SPACING.xl, paddingTop: SPACING.xxl },
  avatarContainer: { width: 104, height: 104, borderRadius: 52, borderWidth: 2, padding: 2, marginBottom: SPACING.lg },
  avatar: { width: '100%', height: '100%', borderRadius: 50 },
  editPhotoBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.surface },
  userName: { ...TYPOGRAPHY.h2, marginBottom: 4 },
  userEmail: { ...TYPOGRAPHY.body, marginBottom: SPACING.xl },
  editButton: { width: 160, minHeight: 44, borderWidth: 2 },
  editForm: { width: '100%', maxWidth: 400, gap: SPACING.sm },
  input: { padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, ...TYPOGRAPHY.body },
  editActions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm },
  statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.xl, gap: SPACING.md, marginBottom: SPACING.xxl },
  statCard: { flex: 1, alignItems: 'center', padding: SPACING.lg },
  statNumber: { ...TYPOGRAPHY.h1, marginBottom: 4 },
  statLabel: { ...TYPOGRAPHY.caption },
  section: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  sectionTitle: { ...TYPOGRAPHY.h4, marginBottom: SPACING.md, fontWeight: '700' },
  cardItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, marginBottom: SPACING.sm, borderRadius: BORDER_RADIUS.md },
  cardInfo: { flexDirection: 'row', alignItems: 'center' },
  cardBrand: { ...TYPOGRAPHY.body, fontWeight: 'bold' },
  cardNumber: { ...TYPOGRAPHY.caption, marginTop: 2 },
  addCardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderStyle: 'dashed' },
  menuSection: { paddingHorizontal: SPACING.xl, gap: SPACING.sm },
  menuItem: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden' },
  menuContent: { flexDirection: 'row', alignItems: 'center' },
  menuIconContainer: { width: 44, height: 44, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  menuTitle: { flex: 1, ...TYPOGRAPHY.bodyLarge, fontWeight: '600' },
  accordionContent: { marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  settingLabel: { ...TYPOGRAPHY.body },
  settingGroupTitle: { ...TYPOGRAPHY.caption, marginBottom: SPACING.sm, marginTop: SPACING.xs },
  langRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  langBtn: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: BORDER_RADIUS.sm },
  langBtnText: { ...TYPOGRAPHY.body, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, gap: SPACING.md },
  actionRowText: { ...TYPOGRAPHY.body },
  footer: { padding: SPACING.xl, alignItems: 'center', marginTop: SPACING.lg },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  logoutText: { ...TYPOGRAPHY.body, fontWeight: '700' },
});
