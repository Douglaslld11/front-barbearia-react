import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useBarbearia } from '../../stores/BarbeariaContext';
import { useLanguage } from '../../stores/LanguageContext';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { format, startOfToday, addDays } from 'date-fns';
import { ptBR, es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Lock } from 'lucide-react-native';

const ALL_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

export default function AdminAgenda() {
  const { barbearia, toggleBlockedSlot } = useBarbearia();
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  const appointments = barbearia?.appointments || [];
  const barbers = barbearia?.barbers || [];
  const blockedSlots = barbearia?.blockedSlots || [];
  const themeColors = barbearia?.colors || COLORS;
  const primaryColor = themeColors.primary;

  const dateFormatted = format(selectedDate, 'dd/MM/yyyy');
  const dateLocale = language === 'pt' ? ptBR : es;

  const changeDate = (amount: number) => {
    setSelectedDate(prev => addDays(prev, amount));
  };

  const handleSlotPress = (barberId: string, time: string, isBlocked: boolean, hasAppointment: boolean) => {
    if (hasAppointment) {
      if (Platform.OS === 'web') window.alert('Horário ocupado por agendamento.');
      return;
    }
    
    if (Platform.OS === 'web') {
      const confirmAction = window.confirm(isBlocked ? 'Desbloquear este horário?' : 'Bloquear este horário?');
      if (confirmAction) toggleBlockedSlot(barberId, dateFormatted, time);
    } else {
      Alert.alert(
        isBlocked ? 'Desbloquear Horário' : 'Bloquear Horário',
        isBlocked ? 'Deseja abrir este horário para agendamentos?' : 'Deseja fechar este horário para agendamentos?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: () => toggleBlockedSlot(barberId, dateFormatted, time) }
        ]
      );
    }
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

          <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
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

                  return (
                    <TouchableOpacity 
                      key={`${barber.id}-${time}`} 
                      onPress={() => handleSlotPress(barber.id, time, isBlocked, !!appointment)}
                      activeOpacity={0.7}
                      style={[
                        styles.cell, 
                        styles.barberColumn,
                        { borderColor: themeColors.divider },
                        appointment ? (appointment.status === 'accepted' ? styles.busyCell : styles.pendingCell) : (isBlocked ? styles.blockedCell : styles.freeCell)
                      ]}
                    >
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

      <View style={[styles.legend, { backgroundColor: themeColors.surface }]}>
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
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: themeColors.surfaceLight }]} />
          <Text style={[styles.legendText, { color: themeColors.textMuted }]}>{t('admin.agenda.free')}</Text>
        </View>
      </View>
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
  barberColumn: { width: 140, backgroundColor: COLORS.surface },
  headerText: { color: COLORS.primary, ...TYPOGRAPHY.caption, fontWeight: '800' },
  timeText: { color: COLORS.text, ...TYPOGRAPHY.bodySmall, fontWeight: '700' },
  freeCell: { backgroundColor: 'rgba(255,255,255,0.02)', borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.divider },
  blockedCell: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: COLORS.divider, borderStyle: 'dashed' },
  busyCell: { backgroundColor: `${COLORS.success}20`, borderWidth: 1, borderColor: `${COLORS.success}40` },
  pendingCell: { backgroundColor: 'rgba(234, 179, 8, 0.2)', borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.4)' },
  appointmentText: { color: COLORS.text, ...TYPOGRAPHY.caption, fontWeight: 'bold' },
  freeText: { color: COLORS.textMuted, fontSize: 10 },
  tableBody: { height: 500 },
  legend: { flexDirection: 'row', padding: SPACING.xl, gap: 20, justifyContent: 'center', backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { color: COLORS.textMuted, ...TYPOGRAPHY.caption, fontWeight: '600' }
});