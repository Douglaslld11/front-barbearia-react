import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { 
  format, 
  addDays, 
  startOfToday, 
  isSunday, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths,
  isSameDay,
  isBefore,
  startOfDay
} from 'date-fns';
import { ptBR, es } from 'date-fns/locale';
import { 
  Scissors, 
  Clock, 
  CheckCircle2, 
  User, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CreditCard, 
  Wallet,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../stores/LanguageContext';

const COMBO_IDS = ['1', '2', '3']; // Cabelo, Barba, Sobrancelha

const SERVICES = [
  { id: '1', name: 'Cabelo', nameEs: 'Cabelo', pricePt: 35.00, priceEs: 40000, duration: '45 min' },
  { id: '2', name: 'Barba', nameEs: 'Barba', pricePt: 30.00, priceEs: 35000, duration: '30 min' },
  { id: '3', name: 'Sobrancelha', nameEs: 'Cejas', pricePt: 15.00, priceEs: 15000, duration: '15 min' },
  { id: '4', name: 'Pigmentação Cabelo', nameEs: 'Pigmentación Cabello', pricePt: 30.00, priceEs: 35000, duration: '30 min' },
  { id: '5', name: 'Relaxamento Capilar', nameEs: 'Relaxamiento Capilar', pricePt: 30.00, priceEs: 35000, duration: '45 min' },
  { id: '6', name: 'Pigmentação Barba', nameEs: 'Pigmentación Barba', pricePt: 30.00, priceEs: 35000, duration: '20 min' },
];

const BARBERS = [
  { id: '1', name: 'Marcus Silva', image: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=400' },
  { id: '2', name: 'João Santos', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400' },
  { id: '3', name: 'Felipe Melo', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
];

const MORNING_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const AFTERNOON_TIMES = ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];

export default function AgendarScreen() {
  const { language, t, formatPrice } = useLanguage();
  const [step, setStep] = useState(0); 
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  
  // New Calendar State
  const [viewDate, setViewDate] = useState(startOfToday());
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(startOfToday(), isSunday(startOfToday()) ? 1 : 0));
  
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'money' | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const dateLocale = language === 'pt' ? ptBR : es;

  // Generate days for the current view month
  const monthDays = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    return eachDayOfInterval({ start, end }).filter(date => !isSunday(date));
  }, [viewDate]);

  const { totalPt, totalEs, isCombo } = useMemo(() => {
    const selected = SERVICES.filter(s => selectedServices.includes(s.id));
    const hasAllCombo = COMBO_IDS.every(id => selectedServices.includes(id));
    
    let subtotalPt = 0;
    let subtotalEs = 0;

    selected.forEach(s => {
      subtotalPt += s.pricePt;
      subtotalEs += s.priceEs;
    });

    if (hasAllCombo) {
      return { 
        totalPt: subtotalPt * 0.9, 
        totalEs: subtotalEs * 0.9, 
        isCombo: true 
      };
    }
    return { 
      totalPt: subtotalPt, 
      totalEs: subtotalEs, 
      isCombo: false 
    };
  }, [selectedServices]);

  const toggleService = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const changeMonth = (offset: number) => {
    setViewDate(prev => addMonths(prev, offset));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleNextStep = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep(prev => prev + 1);
  };

  const handleBackStep = () => setStep(prev => prev - 1);

  const copyPixLink = () => {
    setIsCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Step 0: Services & Barber
  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('book.services')}</Text>
          <Text style={styles.subtitle}>{t('lang.subtitle')}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.services')}</Text>
            {SERVICES.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              const name = language === 'pt' ? service.name : service.nameEs;
              return (
                <Pressable key={service.id} onPress={() => toggleService(service.id)} style={[styles.serviceItem, isSelected && styles.serviceItemActive]}>
                  <View style={styles.serviceInfo}><Text style={[styles.serviceName, isSelected && styles.textActive]}>{name}</Text><Text style={[styles.serviceMeta, isSelected && styles.textActiveMuted]}>{service.duration}</Text></View>
                  <Text style={[styles.servicePrice, isSelected && styles.textActive]}>{formatPrice(service.pricePt, service.priceEs)}</Text>
                </Pressable>
              );
            })}
            {isCombo && <View style={styles.comboBadge}><Text style={styles.comboText}>{t('book.combo')}</Text></View>}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.barbers')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.md }}>
              {BARBERS.map((barber) => (
                <Pressable key={barber.id} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedBarber(barber.id); }} style={[styles.barberItem, selectedBarber === barber.id && styles.barberItemActive]}>
                  <Image source={{ uri: barber.image }} style={styles.barberImg} /><Text style={[styles.barberName, selectedBarber === barber.id && styles.textActive]}>{barber.name}</Text>
                  {selectedBarber === barber.id && <CheckCircle2 size={16} color={COLORS.background} style={styles.checkIcon} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.totalRow}><Text style={styles.totalLabel}>{t('book.total')}:</Text><Text style={styles.totalValue}>{formatPrice(totalPt, totalEs)}</Text></View>
          <Button title={t('book.next')} onPress={handleNextStep} disabled={selectedServices.length === 0 || !selectedBarber} />
        </View>
      </SafeAreaView>
    );
  }

  // Step 1: Date & Time
  if (step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('book.dateTime')}</Text>
          <Text style={styles.subtitle}>{t('lang.subtitle')}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          {/* Month Selector */}
          <View style={styles.calendarHeader}>
            <Pressable onPress={() => changeMonth(-1)} style={styles.monthNav} disabled={isBefore(startOfMonth(viewDate), startOfMonth(startOfToday()))}>
              <ChevronLeft size={24} color={isBefore(startOfMonth(viewDate), startOfMonth(startOfToday())) ? COLORS.divider : COLORS.primary} />
            </Pressable>
            <Text style={styles.monthTitle}>{format(viewDate, 'MMMM yyyy', { locale: dateLocale }).toUpperCase()}</Text>
            <Pressable onPress={() => changeMonth(1)} style={styles.monthNav}>
              <ChevronRightIcon size={24} color={COLORS.primary} />
            </Pressable>
          </View>

          {/* Days List */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
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
                    isSelected && styles.dateItemActive,
                    isPast && styles.dateItemDisabled
                  ]}
                >
                  <Text style={[styles.dateDay, isSelected && styles.textActive, isPast && styles.textDisabled]}>
                    {format(date, 'EEE', { locale: dateLocale }).toUpperCase()}
                  </Text>
                  <Text style={[styles.dateNumber, isSelected && styles.textActive, isPast && styles.textDisabled]}>
                    {format(date, 'dd')}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Times */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('book.morning')}</Text>
            <View style={styles.timeGrid}>
              {MORNING_TIMES.map((time) => (
                <Pressable key={time} onPress={() => setSelectedTime(time)} style={[styles.timeItem, selectedTime === time && styles.timeItemActive]}>
                  <Text style={[styles.timeText, selectedTime === time && styles.textActive]}>{time}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>{t('book.afternoon')}</Text>
            <View style={styles.timeGrid}>
              {AFTERNOON_TIMES.map((time) => (
                <Pressable key={time} onPress={() => setSelectedTime(time)} style={[styles.timeItem, selectedTime === time && styles.timeItemActive]}>
                  <Text style={[styles.timeText, selectedTime === time && styles.textActive]}>{time}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}><View style={styles.navButtons}><Button title={t('book.back')} variant="ghost" onPress={handleBackStep} style={{ flex: 1 }} /><Button title={t('book.next')} onPress={handleNextStep} disabled={!selectedTime} style={{ flex: 2 }} /></View></View>
      </SafeAreaView>
    );
  }

  // Step 2: Payment
  if (step === 2) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><Text style={styles.title}>{t('book.payment')}</Text><Text style={styles.subtitle}>{t('lang.subtitle')}</Text></View>
        <View style={styles.content}>
          <Pressable style={[styles.paymentOption, paymentMethod === 'pix' && styles.paymentOptionActive]} onPress={() => setPaymentMethod('pix')}><CreditCard size={24} color={paymentMethod === 'pix' ? COLORS.background : COLORS.primary} /><Text style={[styles.paymentText, paymentMethod === 'pix' && styles.textActive]}>{t('book.pix')}</Text></Pressable>
          <Pressable style={[styles.paymentOption, paymentMethod === 'money' && styles.paymentOptionActive]} onPress={() => setPaymentMethod('money')}><Wallet size={24} color={paymentMethod === 'money' ? COLORS.background : COLORS.primary} /><Text style={[styles.paymentText, paymentMethod === 'money' && styles.textActive]}>{t('book.money')}</Text></Pressable>
          {paymentMethod === 'pix' && (
            <Card style={styles.pixCard}><Text style={styles.pixLabel}>{t('book.pixCopy')}:</Text><View style={styles.pixCopyRow}><TextInput value={language === 'pt' ? "00020126580014br.gov.bcb.pix..." : "PY-TRANS-8294-BARBER"} editable={false} style={styles.pixInput} /><Pressable onPress={copyPixLink} style={styles.copyBtn}>{isCopied ? <Check size={20} color={COLORS.success} /> : <Copy size={20} color={COLORS.primary} />}</Pressable></View></Card>
          )}
          {paymentMethod === 'money' && <Card style={styles.moneyCard}><Text style={styles.moneyText}>{t('book.moneyMsg')}</Text></Card>}
        </View>
        <View style={styles.footer}><View style={styles.navButtons}><Button title={t('book.back')} variant="ghost" onPress={handleBackStep} style={{ flex: 1 }} /><Button title={t('book.finish')} onPress={handleNextStep} disabled={!paymentMethod} style={{ flex: 2 }} /></View></View>
      </SafeAreaView>
    );
  }

  // Step 3: Success
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.successContainer}>
        <CheckCircle2 size={80} color={COLORS.primary} />
        <Text style={styles.successTitle}>
          {paymentMethod === 'money' ? t('book.waiting') : t('book.success')}
        </Text>

        <Card style={styles.receiptCard}>
          <View style={styles.receiptHeader}><Text style={styles.receiptBrand}>BarberFlow</Text><Text style={styles.receiptId}>#BF-9482</Text></View>
          <View style={styles.receiptDivider} /><View style={styles.receiptRow}><Text style={styles.receiptLabel}>{t('home.barbers')}:</Text><Text style={styles.receiptValue}>{BARBERS.find(b => b.id === selectedBarber)?.name}</Text></View>
          <View style={styles.receiptRow}><Text style={styles.receiptLabel}>{t('lang.title')}:</Text><Text style={styles.receiptValue}>{format(selectedDate, "dd 'de' MMMM", { locale: dateLocale })}</Text></View>
          <View style={styles.receiptRow}><Text style={styles.receiptLabel}>{t('book.time')}:</Text><Text style={styles.receiptValue}>{selectedTime}</Text></View>
          <View style={styles.receiptDivider} /><View style={styles.receiptRow}><Text style={[styles.receiptLabel, { color: COLORS.text, fontWeight: '700' }]}>Total:</Text><Text style={styles.receiptTotal}>{formatPrice(totalPt, totalEs)}</Text></View>
        </Card>
        <Button title={t('book.back')} onPress={() => setStep(0)} style={{ width: '100%', marginTop: SPACING.xl }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg },
  content: { padding: SPACING.lg, flex: 1 },
  title: { ...TYPOGRAPHY.h2, color: COLORS.text },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.textMuted, marginTop: 4 },
  section: { marginBottom: SPACING.xl, paddingHorizontal: SPACING.lg },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },
  
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  monthTitle: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary, letterSpacing: 1 },
  monthNav: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  
  serviceItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.divider },
  serviceItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  serviceInfo: { flex: 1 },
  serviceName: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.text },
  serviceMeta: { ...TYPOGRAPHY.caption, color: COLORS.textMuted },
  servicePrice: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary },
  comboBadge: { backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, marginTop: SPACING.xs, borderWidth: 1, borderColor: COLORS.primary },
  comboText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '700', textAlign: 'center' },
  barberItem: { width: 120, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.divider },
  barberItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  barberImg: { width: 60, height: 60, borderRadius: 30, marginBottom: SPACING.sm },
  barberName: { ...TYPOGRAPHY.caption, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  checkIcon: { position: 'absolute', top: 8, right: 8 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.divider },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  totalLabel: { ...TYPOGRAPHY.body, color: COLORS.textMuted },
  totalValue: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  dateList: { gap: SPACING.sm, paddingHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  dateItem: { width: 64, height: 80, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.divider },
  dateItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dateItemDisabled: { opacity: 0.3, backgroundColor: 'transparent' },
  dateDay: { ...TYPOGRAPHY.caption, fontWeight: '700', color: COLORS.textMuted },
  dateNumber: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: 4 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  timeItem: { width: '31%', paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.divider },
  timeItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.text },
  textActive: { color: COLORS.background },
  textActiveMuted: { color: 'rgba(0,0,0,0.5)' },
  textDisabled: { color: COLORS.divider },
  navButtons: { flexDirection: 'row', gap: SPACING.md },
  paymentOption: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.divider },
  paymentOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  paymentText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.text },
  pixCard: { padding: SPACING.lg, marginTop: SPACING.md },
  pixLabel: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginBottom: SPACING.xs },
  pixCopyRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  pixInput: { flex: 1, backgroundColor: COLORS.surfaceLight, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, color: COLORS.text, fontSize: 12 },
  copyBtn: { width: 44, height: 44, backgroundColor: COLORS.surfaceLight, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  moneyCard: { padding: SPACING.lg, backgroundColor: 'rgba(212, 175, 55, 0.05)', borderWidth: 1, borderColor: COLORS.divider },
  moneyText: { ...TYPOGRAPHY.body, color: COLORS.text, lineHeight: 24 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  successTitle: { ...TYPOGRAPHY.h1, color: COLORS.primary, marginTop: SPACING.lg },
  successSubtitle: { ...TYPOGRAPHY.body, color: COLORS.textMuted, marginBottom: SPACING.xl },
  receiptCard: { width: '100%', padding: SPACING.lg, marginTop: SPACING.md },
  receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  receiptBrand: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  receiptId: { ...TYPOGRAPHY.caption, color: COLORS.textMuted },
  receiptDivider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.md },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  receiptLabel: { ...TYPOGRAPHY.caption, color: COLORS.textMuted },
  receiptValue: { ...TYPOGRAPHY.body, color: COLORS.text, fontWeight: '700' },
  receiptService: { ...TYPOGRAPHY.body, color: COLORS.textMuted },
  receiptTotal: { ...TYPOGRAPHY.h2, color: COLORS.primary },
});
