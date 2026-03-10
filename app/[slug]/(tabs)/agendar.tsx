import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../../constants/theme';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { 
  format, 
  addDays, 
  startOfToday, 
  isSunday, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  isSameDay,
  isBefore,
  startOfDay
} from 'date-fns';
import { ptBR, es } from 'date-fns/locale';
import { 
  CheckCircle2, 
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  CreditCard,
  Wallet,
  Copy,
  Check,
  Smartphone
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../../stores/LanguageContext';
import { useBarbearia } from '../../../stores/BarbeariaContext';

const COMBO_IDS = ['1', '2', '3'];
const MORNING_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const AFTERNOON_TIMES = ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];

export default function AgendarScreen() {
  const { language, t, formatPrice } = useLanguage();
  const { barbearia, addAppointment } = useBarbearia();
  const colors = barbearia?.colors || COLORS;
  
  const services = barbearia?.services || [];
  const barbers = barbearia?.barbers || [];
  
  const [step, setStep] = useState(0); 
  const [clientName, setClientName] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [viewDate, setViewDate] = useState(startOfToday());
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(startOfToday(), isSunday(startOfToday()) ? 1 : 0));
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const dateLocale = language === 'pt' ? ptBR : es;

  const monthDays = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    return eachDayOfInterval({ start, end }).filter(date => !isSunday(date));
  }, [viewDate]);

  const { totalPt, totalEs, isCombo } = useMemo(() => {
    const selected = services.filter(s => selectedServices.includes(s.id));
    const hasAllCombo = COMBO_IDS.every(id => selectedServices.includes(id)) && COMBO_IDS.length > 0;
    
    let subtotalPt = 0;
    let subtotalEs = 0;

    selected.forEach(s => {
      subtotalPt += s.precoPt;
      subtotalEs += s.precoEs; 
    });

    if (hasAllCombo) {
      return { totalPt: subtotalPt * 0.9, totalEs: subtotalEs * 0.9, isCombo: true };
    }
    return { totalPt: subtotalPt, totalEs: subtotalEs, isCombo: false };
  }, [selectedServices, services]);

  const availablePaymentMethods = useMemo(() => {
    if (!barbearia) return [];
    
    // Filtra pelos métodos habilitados pelo admin
    let methods = barbearia.paymentMethods || ['money'];
    
    // Filtra por regra de negócio do idioma
    if (language === 'pt') {
      methods = methods.filter(m => m !== 'alias');
    } else {
      methods = methods.filter(m => m !== 'pix');
    }
    
    return methods;
  }, [barbearia, language]);

  const toggleService = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleNextStep = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep(prev => prev + 1);
  };

  const handleBackStep = () => setStep(prev => prev - 1);

  const handleFinish = async () => {
    if (!selectedBarber || !selectedTime || !paymentMethod) return;

    setIsLoading(true);
    try {
      await addAppointment({
        clientName: clientName || 'Cliente',
        serviceIds: selectedServices,
        barberId: selectedBarber,
        date: format(selectedDate, 'dd/MM/yyyy'),
        time: selectedTime,
        totalPt: totalPt,
        totalEs: totalEs,
      });
      setStep(3);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyPixLink = () => {
    setIsCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Step 0: Services & Barber
  if (step === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Animated.Text entering={FadeInUp} style={[styles.title, { color: colors.text }]}>{t('book.services')}</Animated.Text>
          <Animated.Text entering={FadeInUp.delay(100)} style={[styles.subtitle, { color: colors.textMuted }]}>{t('lang.subtitle')}</Animated.Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          
          <Animated.View entering={FadeInRight.delay(200)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Seu Nome</Text>
            <TextInput
              style={[styles.nameInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.divider }]}
              placeholder="Digite seu nome"
              placeholderTextColor={colors.textMuted}
              value={clientName}
              onChangeText={setClientName}
            />
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(300)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.services')}</Text>
            {services.map((service, idx) => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <Pressable 
                  key={service.id} 
                  onPress={() => toggleService(service.id)} 
                  style={[
                    styles.serviceItem, 
                    { backgroundColor: colors.surface, borderColor: colors.divider },
                    isSelected && { backgroundColor: colors.primary, borderColor: colors.primary, ...(SHADOWS.glow(colors.primary) as any) }
                  ]}
                >
                  <View style={styles.serviceInfo}>
                    <Text style={[styles.serviceName, { color: colors.text }, isSelected && { color: colors.background }]}>
                      {language === 'pt' ? service.nomePt : service.nomeEs}
                    </Text>
                    <Text style={[styles.serviceMeta, { color: colors.textMuted }, isSelected && { color: 'rgba(0,0,0,0.6)' }]}>{service.duracao} min</Text>
                  </View>
                  <Text style={[styles.servicePrice, { color: colors.primary }, isSelected && { color: colors.background }]}>
                    {formatPrice(service.precoPt, service.precoEs)}
                  </Text>
                </Pressable>
              );
            })}
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(400)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.barbers')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.md }}>
              {barbers.map((barber) => (
                <Pressable 
                  key={barber.id} 
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedBarber(barber.id); }} 
                  style={[
                    styles.barberItem, 
                    { backgroundColor: colors.surface, borderColor: colors.divider },
                    selectedBarber === barber.id && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                >
                  <Image source={{ uri: barber.foto }} style={styles.barberImg} />
                  <Text style={[styles.barberName, { color: colors.text }, selectedBarber === barber.id && { color: colors.background }]}>{barber.nome}</Text>
                  {selectedBarber === barber.id && <CheckCircle2 size={16} color={colors.background} style={styles.checkIcon} />}
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </ScrollView>
        
        <Animated.View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textMuted }]}>{t('book.total')}:</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>{formatPrice(totalPt, totalEs)}</Text>
          </View>
          <Button 
            title={t('book.next')} 
            onPress={handleNextStep} 
            disabled={selectedServices.length === 0 || !selectedBarber || !clientName}
          />
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Step 1: Date & Time
  if (step === 1) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('book.dateTime')}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t('lang.subtitle')}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          
          <Animated.View entering={FadeInRight} style={styles.calendarHeader}>
            <Pressable onPress={() => setViewDate(prev => addMonths(prev, -1))} style={styles.monthNav} disabled={isBefore(startOfMonth(viewDate), startOfMonth(startOfToday()))}>
              <ChevronLeft size={24} color={isBefore(startOfMonth(viewDate), startOfMonth(startOfToday())) ? colors.divider : colors.primary} />
            </Pressable>
            <Text style={[styles.monthTitle, { color: colors.primary }]}>{format(viewDate, 'MMMM yyyy', { locale: dateLocale }).toUpperCase()}</Text>
            <Pressable onPress={() => setViewDate(prev => addMonths(prev, 1))} style={styles.monthNav}>
              <ChevronRightIcon size={24} color={colors.primary} />
            </Pressable>
          </Animated.View>

          <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
            {monthDays.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              const isPast = isBefore(startOfDay(date), startOfDay(startOfToday()));
              return (
                <Pressable
                  key={date.toString()}
                  onPress={() => {
                    if (!isPast) {
                      setSelectedDate(date);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  disabled={isPast}
                  style={[
                    styles.dateItem,
                    { backgroundColor: colors.surface, borderColor: colors.divider },
                    isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
                    isPast && styles.dateItemDisabled
                  ]}
                >
                  <Text style={[styles.dateDay, { color: colors.textMuted }, isSelected && { color: colors.background }]}>
                    {format(date, 'EEE', { locale: dateLocale }).toUpperCase()}
                  </Text>
                  <Text style={[styles.dateNumber, { color: colors.text }, isSelected && { color: colors.background }]}>
                    {format(date, 'dd')}
                  </Text>
                </Pressable>
              );
            })}
          </Animated.ScrollView>

          <Animated.View entering={FadeInRight.delay(100)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('book.morning')}</Text>
            <View style={styles.timeGrid}>
              {MORNING_TIMES.map((time) => {
                const isBooked = barbearia?.appointments.some(a => a.date === format(selectedDate, 'dd/MM/yyyy') && a.time === time && a.barberId === selectedBarber && a.status !== 'rejected');
                const isBlocked = barbearia?.blockedSlots?.some(s => s.date === format(selectedDate, 'dd/MM/yyyy') && s.time === time && s.barberId === selectedBarber);
                const isUnavailable = isBooked || isBlocked;
                return (
                  <Pressable 
                    key={time} 
                    onPress={() => !isUnavailable && setSelectedTime(time)} 
                    style={[
                      styles.timeItem, 
                      { backgroundColor: colors.surface, borderColor: colors.divider },
                      selectedTime === time && { backgroundColor: colors.primary, borderColor: colors.primary },
                      isUnavailable && { opacity: 0.3 }
                    ]}
                  >
                    <Text style={[styles.timeText, { color: colors.text }, selectedTime === time && { color: colors.background }, isUnavailable && { textDecorationLine: 'line-through' }]}>
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: SPACING.lg, color: colors.text }]}>{t('book.afternoon')}</Text>
            <View style={styles.timeGrid}>
              {AFTERNOON_TIMES.map((time) => {
                const isBooked = barbearia?.appointments.some(a => a.date === format(selectedDate, 'dd/MM/yyyy') && a.time === time && a.barberId === selectedBarber && a.status !== 'rejected');
                const isBlocked = barbearia?.blockedSlots?.some(s => s.date === format(selectedDate, 'dd/MM/yyyy') && s.time === time && s.barberId === selectedBarber);
                const isUnavailable = isBooked || isBlocked;
                return (
                  <Pressable 
                    key={time} 
                    onPress={() => !isUnavailable && setSelectedTime(time)} 
                    style={[
                      styles.timeItem, 
                      { backgroundColor: colors.surface, borderColor: colors.divider },
                      selectedTime === time && { backgroundColor: colors.primary, borderColor: colors.primary },
                      isUnavailable && { opacity: 0.3 }
                    ]}
                  >
                    <Text style={[styles.timeText, { color: colors.text }, selectedTime === time && { color: colors.background }, isUnavailable && { textDecorationLine: 'line-through' }]}>
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
          <View style={styles.navButtons}>
            <Button title={t('book.back')} variant="ghost" onPress={handleBackStep} style={{ flex: 1 }} />
            <Button title={t('book.next')} onPress={handleNextStep} disabled={!selectedTime} style={{ flex: 2 }} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 2: Payment
  if (step === 2) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('book.payment')}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t('lang.subtitle')}</Text>
        </View>
        <Animated.View entering={FadeInRight} style={styles.content}>
          {availablePaymentMethods.map((method) => (
            <Pressable 
              key={method}
              style={[
                styles.paymentOption, 
                { backgroundColor: colors.surface, borderColor: colors.divider },
                paymentMethod === method && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]} 
              onPress={() => setPaymentMethod(method)}
            >
              {method === 'pix' ? <Smartphone size={28} color={paymentMethod === method ? colors.background : colors.primary} /> :
               method === 'card' ? <CreditCard size={28} color={paymentMethod === method ? colors.background : colors.primary} /> :
               method === 'money' ? <Wallet size={28} color={paymentMethod === method ? colors.background : colors.primary} /> :
               <Smartphone size={28} color={paymentMethod === method ? colors.background : colors.primary} />}
              <Text style={[styles.paymentText, { color: colors.text }, paymentMethod === method && { color: colors.background }]}>
                {t(`book.${method}`)}
              </Text>
            </Pressable>
          ))}

          {paymentMethod === 'pix' && (
            <Animated.View entering={FadeInUp}>
              <Card style={[styles.pixCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.pixLabel, { color: colors.textMuted }]}>{t('book.pixCopy')}:</Text>
                <View style={styles.pixCopyRow}>
                  <TextInput 
                    value="00020126580014br.gov.bcb.pix..." 
                    editable={false} 
                    style={[styles.pixInput, { backgroundColor: `${colors.background}80`, color: colors.text }]} 
                  />
                  <Pressable onPress={copyPixLink} style={[styles.copyBtn, { backgroundColor: `${colors.background}80` }]}>
                    {isCopied ? <Check size={20} color={COLORS.success} /> : <Copy size={20} color={colors.primary} />}
                  </Pressable>
                </View>
              </Card>
            </Animated.View>
          )}

          {paymentMethod === 'alias' && (
            <Animated.View entering={FadeInUp}>
              <Card style={[styles.pixCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.pixLabel, { color: colors.textMuted }]}>{t('book.alias')}:</Text>
                <View style={styles.pixCopyRow}>
                  <TextInput 
                    value="ALIAS-BARBER-GS-9283" 
                    editable={false} 
                    style={[styles.pixInput, { backgroundColor: `${colors.background}80`, color: colors.text }]} 
                  />
                  <Pressable onPress={copyPixLink} style={[styles.copyBtn, { backgroundColor: `${colors.background}80` }]}>
                    {isCopied ? <Check size={20} color={COLORS.success} /> : <Copy size={20} color={colors.primary} />}
                  </Pressable>
                </View>
              </Card>
            </Animated.View>
          )}
          
          {paymentMethod === 'card' && (
            <Animated.View entering={FadeInUp}>
              <Card style={[styles.pixCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.pixLabel, { color: colors.text }]}>{t('book.cardMsg') || 'O pagamento será realizado presencialmente na maquininha.'}</Text>
              </Card>
            </Animated.View>
          )}

          {paymentMethod === 'money' && (
            <Animated.View entering={FadeInUp}>
              <Card style={[styles.pixCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.pixLabel, { color: colors.text }]}>{t('book.moneyMsg')}</Text>
              </Card>
            </Animated.View>
          )}
        </Animated.View>
        
        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
          <View style={styles.navButtons}>
            <Button title={t('book.back')} variant="ghost" onPress={handleBackStep} style={{ flex: 1 }} />
            <Button title={t('book.finish')} onPress={handleFinish} isLoading={isLoading} disabled={!paymentMethod} style={{ flex: 2 }} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 3: Success
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInUp.springify()} style={styles.successContainer}>
        <CheckCircle2 size={100} color={colors.primary} />
        <Text style={[styles.successTitle, { color: colors.primary }]}>
          {paymentMethod === 'money' ? t('book.waiting') : t('book.success')}
        </Text>

        <Card style={[styles.receiptCard, { backgroundColor: colors.surface }]}>
          <View style={styles.receiptHeader}>
            <Text style={[styles.receiptBrand, { color: colors.primary }]}>{barbearia?.nome || "BarberFlow"}</Text>
            <Text style={[styles.receiptId, { color: colors.textMuted }]}>#BF-9482</Text>
          </View>
          <View style={[styles.receiptDivider, { backgroundColor: colors.divider }]}/>
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textMuted }]}>{t('home.barbers')}:</Text>
            <Text style={[styles.receiptValue, { color: colors.text }]}>{barbers.find(b => b.id === selectedBarber)?.nome}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textMuted }]}>{t('lang.title')}:</Text>
            <Text style={[styles.receiptValue, { color: colors.text }]}>{format(selectedDate, "dd 'de' MMMM", { locale: dateLocale })}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textMuted }]}>{t('book.time')}:</Text>
            <Text style={[styles.receiptValue, { color: colors.text }]}>{selectedTime}</Text>
          </View>
          <View style={[styles.receiptDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.text, fontWeight: '700' }]}>Total:</Text>
            <Text style={[styles.receiptTotal, { color: colors.primary }]}>{formatPrice(totalPt, totalEs)}</Text>
          </View>
        </Card>
        
        <Button title={t('book.back')} onPress={() => setStep(0)} style={{ width: '100%', marginTop: SPACING.xl }} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SPACING.xl },
  content: { padding: SPACING.xl, flex: 1 },
  title: { ...TYPOGRAPHY.h1, letterSpacing: -0.5 },
  subtitle: { ...TYPOGRAPHY.body, marginTop: 4 },
  section: { marginBottom: SPACING.xl, paddingHorizontal: SPACING.xl },
  sectionTitle: { ...TYPOGRAPHY.h3, marginBottom: SPACING.md },
  nameInput: { padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, borderWidth: 1, ...TYPOGRAPHY.body },
  
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.xl, marginBottom: SPACING.md },
  monthTitle: { ...TYPOGRAPHY.bodyLarge, fontWeight: '700', letterSpacing: 1 },
  monthNav: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: BORDER_RADIUS.md, backgroundColor: 'rgba(255,255,255,0.05)' },
  
  serviceItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm, borderWidth: 1 },
  serviceInfo: { flex: 1 },
  serviceName: { ...TYPOGRAPHY.bodyLarge, fontWeight: '600' },
  serviceMeta: { ...TYPOGRAPHY.caption, marginTop: 4 },
  servicePrice: { ...TYPOGRAPHY.h4 },
  
  barberItem: { width: 140, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', borderWidth: 1 },
  barberImg: { width: 70, height: 70, borderRadius: 35, marginBottom: SPACING.md },
  barberName: { ...TYPOGRAPHY.bodySmall, fontWeight: '700', textAlign: 'center' },
  checkIcon: { position: 'absolute', top: 12, right: 12 },
  
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.xl, borderTopWidth: 1, ...(SHADOWS.large as any) },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md, alignItems: 'center' },
  totalLabel: { ...TYPOGRAPHY.bodyLarge },
  totalValue: { ...TYPOGRAPHY.h1 },
  
  dateList: { gap: SPACING.sm, paddingHorizontal: SPACING.xl, marginBottom: SPACING.xxl },
  dateItem: { width: 72, height: 90, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  dateItemDisabled: { opacity: 0.3 },
  dateDay: { ...TYPOGRAPHY.caption, fontWeight: '700', marginBottom: 4 },
  dateNumber: { ...TYPOGRAPHY.h2 },
  
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  timeItem: { width: '31%', paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, alignItems: 'center', borderWidth: 1 },
  timeText: { ...TYPOGRAPHY.bodyLarge, fontWeight: '600' },
  
  navButtons: { flexDirection: 'row', gap: SPACING.md },
  
  paymentOption: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.xl, borderRadius: BORDER_RADIUS.xl, marginBottom: SPACING.md, borderWidth: 2 },
  paymentText: { ...TYPOGRAPHY.h4 },
  pixCard: { padding: SPACING.lg, marginTop: SPACING.md },
  pixLabel: { ...TYPOGRAPHY.caption, marginBottom: SPACING.xs },
  pixCopyRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  pixInput: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, ...TYPOGRAPHY.bodySmall },
  copyBtn: { width: 48, height: 48, minHeight: 48, justifyContent: 'center', alignItems: 'center', borderRadius: BORDER_RADIUS.sm },
  
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  successTitle: { ...TYPOGRAPHY.h1, marginTop: SPACING.xl, textAlign: 'center' },
  receiptCard: { width: '100%', padding: SPACING.xl, marginTop: SPACING.xxl },
  receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  receiptBrand: { ...TYPOGRAPHY.h3 },
  receiptId: { ...TYPOGRAPHY.caption },
  receiptDivider: { height: 1, marginVertical: SPACING.lg },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  receiptLabel: { ...TYPOGRAPHY.bodySmall },
  receiptValue: { ...TYPOGRAPHY.body, fontWeight: '600' },
  receiptTotal: { ...TYPOGRAPHY.h2 },
});
