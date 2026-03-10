import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useBarbearia, Appointment } from '../../stores/BarbeariaContext';
import { useLanguage } from '../../stores/LanguageContext';
import { Card } from '../../components/ui/Card';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Check, X, Calendar, Clock, User, Scissors, Settings } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminDashboard() {
  const { barbearia, updateAppointmentStatus } = useBarbearia();
  const { language, t, formatPrice } = useLanguage();
  const appointments = barbearia?.appointments || [];

  const pending = appointments.filter(a => a.status === 'pending');
  const accepted = appointments.filter(a => a.status === 'accepted');

  const getServiceName = (id: string) => {
    const s = barbearia?.services.find(service => service.id === id);
    if (!s) return 'Serviço';
    return language === 'pt' ? s.nomePt : s.nomeEs;
  };
  const getBarberName = (id: string) => barbearia?.barbers.find(b => b.id === id)?.nome || 'Barbeiro';

  const renderAppointment = (item: Appointment, index: number) => (
    <Card 
      key={item.id} 
      animated 
      delay={index * 100} 
      style={styles.appointmentCard}
    >
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
            <User color={COLORS.primary} size={20} />
          </View>
          <Text style={styles.clientName}>{item.clientName}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'accepted' ? styles.statusAccepted : styles.statusPending]}>
          <Text style={[styles.statusText, item.status === 'accepted' ? { color: '#22C55E' } : { color: '#EAB308' }]}>
            {item.status === 'pending' ? t('admin.dashboard.pending_badge') || 'Pendente' : t('admin.dashboard.confirmed_badge') || 'Confirmado'}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Calendar size={16} color={COLORS.textMuted} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color={COLORS.textMuted} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
      </View>

      <View style={styles.servicesList}>
        <Scissors size={16} color={COLORS.primary} />
        <Text style={styles.servicesText}>
          {item.serviceIds.map(getServiceName).join(', ')} • {getBarberName(item.barberId)}
        </Text>
      </View>

      <View style={styles.priceInfo}>
        <Text style={styles.priceText}>
          Total: {formatPrice(item.totalPt, item.totalEs)}
        </Text>
      </View>

      {item.status === 'pending' ? (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.rejectBtn]} 
            onPress={() => updateAppointmentStatus(item.id, 'rejected')}
          >
            <X color="#FF4444" size={20} />
            <Text style={{color: '#FF4444', fontWeight: 'bold'}}>{t('admin.dashboard.reject')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.acceptBtn]} 
            onPress={() => updateAppointmentStatus(item.id, 'accepted')}
          >
            <Check color="#22C55E" size={20} />
            <Text style={{color: '#22C55E', fontWeight: 'bold'}}>{t('admin.dashboard.accept')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.cancelBtn]} 
            onPress={() => {
              const confirmCancel = Platform.OS === 'web' 
                ? window.confirm(t('admin.dashboard.cancel_confirm') || 'Deseja realmente cancelar este agendamento?')
                : true; // No mobile usaríamos Alert.alert, mas para simplificar aqui vou disparar direto ou via prompt web
              
              if (confirmCancel) {
                updateAppointmentStatus(item.id, 'rejected');
              }
            }}
          >
            <X color={COLORS.textMuted} size={18} />
            <Text style={{color: COLORS.textMuted, fontWeight: '600'}}>{t('admin.dashboard.cancel') || 'Cancelar Horário'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <View>
          <Text style={styles.title}>{t('admin.dashboard.title', { name: barbearia?.nome || 'Barbeiro' })}</Text>
          <Text style={styles.subtitle}>{t('admin.dashboard.pending', { count: pending.length })}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/admin/agenda')}>
            <Calendar color={COLORS.primary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/admin/config')}>
            <Settings color={COLORS.primary} size={24} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {pending.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('admin.dashboard.waiting')}</Text>
            {pending.map((item, i) => renderAppointment(item, i))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('admin.dashboard.upcoming')}</Text>
          {accepted.length > 0 ? accepted.map((item, i) => renderAppointment(item, i + pending.length)) : (
            <Text style={styles.emptyText}>{t('admin.dashboard.empty')}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    padding: SPACING.xl, 
    paddingTop: 60, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    ...(SHADOWS.medium as any),
    zIndex: 10,
  },
  title: { ...TYPOGRAPHY.h2, color: COLORS.text, marginBottom: 4 },
  subtitle: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  headerActions: { flexDirection: 'row', gap: SPACING.sm },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: SPACING.xl, paddingBottom: 100 },
  section: { marginBottom: SPACING.xxl },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary, marginBottom: SPACING.lg },
  appointmentCard: { marginBottom: SPACING.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientName: { ...TYPOGRAPHY.h4, color: COLORS.text },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BORDER_RADIUS.full },
  statusText: { ...TYPOGRAPHY.caption, fontWeight: 'bold' },
  statusPending: { backgroundColor: 'rgba(234, 179, 8, 0.15)' },
  statusAccepted: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  details: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.sm, paddingHorizontal: 4 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  servicesList: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.lg, paddingHorizontal: 4 },
  servicesText: { ...TYPOGRAPHY.bodySmall, color: COLORS.primary, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.divider, paddingTop: SPACING.md },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: BORDER_RADIUS.md, borderWidth: 1 },
  rejectBtn: { borderColor: 'rgba(255, 68, 68, 0.3)', backgroundColor: 'rgba(255, 68, 68, 0.05)' },
  acceptBtn: { borderColor: 'rgba(34, 197, 94, 0.3)', backgroundColor: 'rgba(34, 197, 94, 0.05)' },
  cancelBtn: { borderColor: COLORS.divider, borderStyle: 'dashed' },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xl }
});
