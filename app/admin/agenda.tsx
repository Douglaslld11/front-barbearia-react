import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import Animated, { FadeInUp, FadeInDown, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useBarbearia } from '../../stores/BarbeariaContext';
import { useLanguage } from '../../stores/LanguageContext';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { format, startOfToday, addDays } from 'date-fns';
import { ptBR, es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Lock, CheckCircle2, X } from 'lucide-react-native';

const ALL_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

interface SelectedSlot {
  barberId: string;
  time: string;
}

export default function AdminAgenda() {
  const { barbearia, updateBlockedSlots } = useBarbearia();
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);

  const appointments = barbearia?.appointments || [];
  const barbers = barbearia?.barbers || [];
  const blockedSlots = barbearia?.blockedSlots || [];
  const themeColors = barbearia?.colors || COLORS;
  const primaryColor = themeColors.primary;

  const dateFormatted = format(selectedDate, 'dd/MM/yyyy');
  const dateLocale = language === 'pt' ? ptBR : es;

  const changeDate = (amount: number) => {
    setSelectedDate(prev => addDays(prev, amount));
    setSelectedSlots([]); // Clear selection when changing days
  };

  const handleSlotPress = (barberId: string, time: string, hasAppointment: boolean) => {
    if (hasAppointment) {
      if (Platform.OS === 'web') window.alert('Horário ocupado por agendamento.');
      else Alert.alert('Aviso', 'Este horário já possui um agendamento.');
      return;
    }

    setSelectedSlots(prev => {
      const exists = prev.find(s => s.barberId === barberId && s.time === time);
      if (exists) {
        return prev.filter(s => !(s.barberId === barberId && s.time === time));
      } else {
        return [...prev, { barberId, time }];
      }
    });
  };

  const applyAction = async (action: 'block' | 'unblock') => {
    if (selectedSlots.length === 0) return;
    
    const slotsToUpdate = selectedSlots.map(s => ({
      barberId: s.barberId,
      time: s.time,
      date: dateFormatted
    }));

    await updateBlockedSlots(slotsToUpdate, action);
    setSelectedSlots([]); // Limpa a seleção após aplicar
  };

  const isSlotSelected = (barberId: string, time: string) => {
    return selectedSlots.some(s => s.barberId === barberId && s.time === time);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Animated.View entering={FadeInUp.duration(600)} style={[styles.header, { backgroundColor: themeColors.surface }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>{t('admin.agenda.title')}</Text>
        <View style={[styles.dateSelector, { backgroundColor: `${primaryColor}10` }]}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navBtn}>
            <ChevronLeft color={primaryColor} size={24} />
          </TouchableOpacity>
          <View style={styles.dateInfo}>
            <CalendarIcon size={18} color={primaryColor} />
            <Text style={[styles.dateText, { color: themeColors.text }]}>
              {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: dateLocale })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => changeDate(1)} style={styles.navBtn}>
            <ChevronRight color={primaryColor} size={24} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={[styles.cell, styles.timeColumn, { backgroundColor: themeColors.surfaceLight }]}>
              <Text style={[styles.headerText, { color: primaryColor }]}>{t('admin.agenda.time')}</Text>
            </View>
            {barbers.map(barber => (
              <View key={barber.id} style={[styles.cell, styles.barberColumn, { backgroundColor: themeColors.surface }]}>
                <Text style={[styles.headerText, { color: primaryColor }]} numberOfLines={1}>{barber.nome}</Text>
              </View>
            ))}
          </View>

          <ScrollView style={styles.tableBody} contentContainerStyle={{ paddingBottom: 280 }} showsVerticalScrollIndicator={false}>
            {ALL_TIMES.map(time => (
              <View key={time} style={styles.tableRow}>
                <View style={[styles.cell, styles.timeColumn, { backgroundColor: themeColors.surfaceLight }]}>
                  <Text style={[styles.timeText, { color: themeColors.text }]}>{time}</Text>
                </View>
                
                {barbers.map(barber => {
                  const appointment = appointments.find(a => 
                    a.date === dateFormatted && 
                    a.time === time && 
                    a.barberId === barber.id &&
                    a.status !== 'rejected'
                  );
                  
                  const isBlocked = blockedSlots.some(s => s.barberId === barber.id && s.date === dateFormatted && s.time === time);
                  const isSelected = isSlotSelected(barber.id, time);

                  return (
                    <TouchableOpacity 
                      key={`${barber.id}-${time}`} 
                      onPress={() => handleSlotPress(barber.id, time, !!appointment)}
                      activeOpacity={0.7}
                      style={[
                        styles.cell, 
                        styles.barberColumn,
                        { borderColor: themeColors.divider },
                        appointment 
                          ? (appointment.status === 'accepted' ? styles.busyCell : styles.pendingCell) 
                          : (isBlocked ? styles.blockedCell : styles.freeCell),
                        isSelected && { borderColor: primaryColor, borderWidth: 2, backgroundColor: `${primaryColor}20` }
                      ]}
                    >
                      {isSelected && !appointment && (
                        <View style={[styles.selectedOverlay, { backgroundColor: `${primaryColor}15` }]}>
                          <CheckCircle2 size={24} color={primaryColor} />
                        </View>
                      )}
                      
                      {appointment ? (
                        <Text style={[styles.appointmentText, { color: themeColors.text }]} numberOfLines={1}>
                          {appointment.clientName}
                        </Text>
                      ) : isBlocked ? (
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                           <Lock size={12} color={themeColors.textMuted} />
                           <Text style={[styles.freeText, { color: themeColors.textMuted }]}>Bloqueado</Text>
                        </View>
                      ) : (
                        <Text style={[styles.freeText, { color: themeColors.textMuted }]}>{t('admin.agenda.free')}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Action Bar (Multi-Select) */}
      {selectedSlots.length > 0 && (
        <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={[styles.actionBar, { backgroundColor: themeColors.surface, borderTopColor: primaryColor }]}>
          <View style={styles.actionBarInfo}>
            <Text style={[styles.actionBarText, { color: themeColors.text }]}>
              {`${selectedSlots.length} horário${selectedSlots.length > 1 ? 's' : ''} selecionado${selectedSlots.length > 1 ? 's' : ''}`}
            </Text>
            <TouchableOpacity onPress={() => setSelectedSlots([])} style={styles.clearBtn}>
              <X size={20} color={themeColors.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtons}>
            <Button 
              title="Liberar" 
              variant="outline" 
              onPress={() => applyAction('unblock')} 
              style={{ flex: 1, borderColor: primaryColor }} 
              textStyle={{ color: primaryColor }} 
            />
            <Button 
              title="Bloquear" 
              onPress={() => applyAction('block')} 
              style={{ flex: 1, backgroundColor: primaryColor }} 
              textStyle={{ color: themeColors.background }} 
            />
          </View>
        </Animated.View>
      )}

      {/* Legenda (Oculta se houver seleção para dar espaço à Action Bar) */}
      {selectedSlots.length === 0 && (
        <Animated.View entering={FadeInDown} style={[styles.legend, { backgroundColor: themeColors.surface }]}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
            <Text style={[styles.legendText, { color: themeColors.textMuted }]}>{t('admin.agenda.confirmed')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#EAB308' }]} />
            <Text style={[styles.legendText, { color: themeColors.textMuted }]}>{t('admin.dashboard.pending_badge') || 'Pendente'}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: COLORS.secondary }]} />
            <Text style={[styles.legendText, { color: themeColors.textMuted }]}>Bloqueado</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    padding: SPACING.xl, 
    paddingTop: 60, 
    backgroundColor: COLORS.surface, 
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    ...(SHADOWS.medium as any),
    zIndex: 10,
  },
  title: { ...TYPOGRAPHY.h2, color: COLORS.text, marginBottom: SPACING.lg },
  dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: `${COLORS.primary}10`, padding: SPACING.md, borderRadius: BORDER_RADIUS.md },
  dateInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateText: { color: COLORS.text, ...TYPOGRAPHY.bodySmall, fontWeight: '700', textTransform: 'capitalize' },
  navBtn: { padding: 5 },
  tableContainer: { padding: SPACING.lg },
  tableHeader: { flexDirection: 'row', marginBottom: SPACING.xs },
  tableRow: { flexDirection: 'row', marginBottom: SPACING.xs },
  cell: { padding: 12, justifyContent: 'center', alignItems: 'center', borderRadius: BORDER_RADIUS.sm, marginRight: SPACING.xs },
  timeColumn: { width: 70, backgroundColor: COLORS.surfaceLight },
  barberColumn: { width: 140, backgroundColor: COLORS.surface, position: 'relative', overflow: 'hidden' },
  headerText: { color: COLORS.primary, ...TYPOGRAPHY.caption, fontWeight: '800' },
  timeText: { color: COLORS.text, ...TYPOGRAPHY.bodySmall, fontWeight: '700' },
  freeCell: { backgroundColor: 'rgba(255,255,255,0.02)', borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.divider },
  blockedCell: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: COLORS.divider, borderStyle: 'dashed' },
  busyCell: { backgroundColor: `${COLORS.success}20`, borderWidth: 1, borderColor: `${COLORS.success}40` },
  pendingCell: { backgroundColor: 'rgba(234, 179, 8, 0.2)', borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.4)' },
  appointmentText: { color: COLORS.text, ...TYPOGRAPHY.caption, fontWeight: 'bold' },
  freeText: { color: COLORS.textMuted, fontSize: 10 },
  selectedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  tableBody: { height: 500 },
  actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.xl, paddingBottom: SPACING.xxl, borderTopWidth: 4, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, ...(SHADOWS.large as any) },
  actionBarInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  actionBarText: { ...TYPOGRAPHY.h4 },
  clearBtn: { padding: SPACING.sm, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: BORDER_RADIUS.full },
  actionButtons: { flexDirection: 'row', gap: SPACING.md },
  legend: { flexDirection: 'row', padding: SPACING.xl, gap: 20, justifyContent: 'center', backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { color: COLORS.textMuted, ...TYPOGRAPHY.caption, fontWeight: '600' }
});