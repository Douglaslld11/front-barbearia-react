import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useBarbearia } from '../../stores/BarbeariaContext';
import { useLanguage } from '../../stores/LanguageContext';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { format, startOfToday, addDays } from 'date-fns';
import { ptBR, es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';

const ALL_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

export default function AdminAgenda() {
  const { barbearia } = useBarbearia();
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  const appointments = barbearia?.appointments || [];
  const barbers = barbearia?.barbers || [];

  const dateFormatted = format(selectedDate, 'dd/MM/yyyy');
  const dateLocale = language === 'pt' ? ptBR : es;

  const changeDate = (amount: number) => {
    setSelectedDate(prev => addDays(prev, amount));
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <Text style={styles.title}>{t('admin.agenda.title')}</Text>
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navBtn}>
            <ChevronLeft color={COLORS.primary} size={24} />
          </TouchableOpacity>
          <View style={styles.dateInfo}>
            <CalendarIcon size={18} color={COLORS.primary} />
            <Text style={styles.dateText}>
              {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: dateLocale })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => changeDate(1)} style={styles.navBtn}>
            <ChevronRight color={COLORS.primary} size={24} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableContainer}>
          {/* Cabeçalho da Tabela (Barbeiros) */}
          <View style={styles.tableHeader}>
            <View style={[styles.cell, styles.timeColumn]}>
              <Text style={styles.headerText}>{t('admin.agenda.time')}</Text>
            </View>
            {barbers.map(barber => (
              <View key={barber.id} style={[styles.cell, styles.barberColumn]}>
                <Text style={styles.headerText} numberOfLines={1}>{barber.nome}</Text>
              </View>
            ))}
          </View>

          {/* Corpo da Tabela (Horários) */}
          <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
            {ALL_TIMES.map(time => (
              <View key={time} style={styles.tableRow}>
                <View style={[styles.cell, styles.timeColumn]}>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
                
                {barbers.map(barber => {
                  const appointment = appointments.find(a => 
                    a.date === dateFormatted && 
                    a.time === time && 
                    a.barberId === barber.id &&
                    a.status !== 'rejected'
                  );

                  return (
                    <View 
                      key={`${barber.id}-${time}`} 
                      style={[
                        styles.cell, 
                        styles.barberColumn,
                        appointment ? (appointment.status === 'accepted' ? styles.busyCell : styles.pendingCell) : styles.freeCell
                      ]}
                    >
                      {appointment ? (
                        <Text style={styles.appointmentText} numberOfLines={1}>
                          {appointment.clientName}
                        </Text>
                      ) : (
                        <Text style={styles.freeText}>{t('admin.agenda.free')}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Legenda */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
          <Text style={styles.legendText}>{t('admin.agenda.confirmed')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#EAB308' }]} />
          <Text style={styles.legendText}>{t('admin.dashboard.pending_badge') || 'Pendente'}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.surfaceLight }]} />
          <Text style={styles.legendText}>{t('admin.agenda.free')}</Text>
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
