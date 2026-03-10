import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
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
  
  // Use theme colors
  const themeColors = barbearia?.colors || COLORS;
  const primaryColor = themeColors.primary;

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
      style={[styles.appointmentCard, { backgroundColor: themeColors.surface }]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: `${primaryColor}20` }]}>
            <User color={primaryColor} size={18} />
          </View>
          <Text style={[styles.clientName, { color: themeColors.text }]} numberOfLines={1}>{item.clientName}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'accepted' ? styles.statusAccepted : styles.statusPending]}>
          <Text style={[styles.statusText, item.status === 'accepted' ? { color: '#22C55E' } : { color: '#EAB308' }]}>
            {item.status === 'pending' ? t('admin.dashboard.pending_badge') || 'Pendente' : t('admin.dashboard.confirmed_badge') || 'Confirmado'}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Calendar size={14} color={themeColors.textMuted} />
          <Text style={[styles.detailText, { color: themeColors.textMuted }]}>{item.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={14} color={themeColors.textMuted} />
          <Text style={[styles.detailText, { color: themeColors.textMuted }]}>{item.time}</Text>
        </View>
      </View>

      <View style={styles.servicesList}>
        <Scissors size={14} color={primaryColor} />
        <Text style={[styles.servicesText, { color: primaryColor }]} numberOfLines={1}>
          {item.serviceIds.map(getServiceName).join(', ')} • {getBarberName(item.barberId)}
        </Text>
      </View>

      <View style={styles.priceInfo}>
        <Text style={[styles.priceText, { color: themeColors.text }]}>
          Total: {formatPrice(item.totalPt, item.totalEs)}
        </Text>
      </View>

      {item.status === 'pending' ? (
        <View style={[styles.actions, { borderTopColor: themeColors.divider }]}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.rejectBtn]} 
            onPress={() => updateAppointmentStatus(item.id, 'rejected')}
          >
            <X color="#FF4444" size={18} />
            <Text style={styles.actionTextReject}>{t('admin.dashboard.reject')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.acceptBtn]} 
            onPress={() => updateAppointmentStatus(item.id, 'accepted')}
          >
            <Check color="#22C55E" size={18} />
            <Text style={styles.actionTextAccept}>{t('admin.dashboard.accept')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.actions, { borderTopColor: themeColors.divider }]}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.cancelBtn, { borderColor: themeColors.divider }]} 
            onPress={() => {
              const confirmCancel = Platform.OS === 'web' 
                ? window.confirm(t('admin.dashboard.cancel_confirm') || 'Deseja realmente cancelar este agendamento?')
                : true;
              
              if (confirmCancel) {
                updateAppointmentStatus(item.id, 'rejected');
              }
            }}
          >
            <X color={themeColors.textMuted} size={16} />
            <Text style={[styles.actionTextCancel, { color: themeColors.textMuted }]}>{t('admin.dashboard.cancel') || 'Cancelar'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Animated.View entering={FadeInUp.duration(600)} style={[styles.header, { backgroundColor: themeColors.surface }]}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>{t('admin.dashboard.title', { name: barbearia?.nome || 'Barbeiro' })}</Text>
          <Text style={[styles.subtitle, { color: themeColors.textMuted }]} numberOfLines={1}>{t('admin.dashboard.pending', { count: pending.length })}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${primaryColor}15` }]} onPress={() => router.push('/admin/agenda')}>
            <Calendar color={primaryColor} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${primaryColor}15` }]} onPress={() => router.push('/admin/config')}>
            <Settings color={primaryColor} size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {pending.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: primaryColor }]}>{t('admin.dashboard.waiting')}</Text>
            {pending.map((item, i) => renderAppointment(item, i))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>{t('admin.dashboard.upcoming')}</Text>
          {accepted.length > 0 ? accepted.map((item, i) => renderAppointment(item, i + pending.length)) : (
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>{t('admin.dashboard.empty')}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    ...(SHADOWS.medium as any),
    zIndex: 10,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  title: { ...TYPOGRAPHY.h3, marginBottom: 2 },
  subtitle: { ...TYPOGRAPHY.bodySmall },
  headerActions: { flexDirection: 'row', gap: SPACING.xs },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: SPACING.md, paddingBottom: 100 },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { ...TYPOGRAPHY.h4, marginBottom: SPACING.md },
  appointmentCard: { marginBottom: SPACING.sm, padding: SPACING.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, flex: 1 },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientName: { ...TYPOGRAPHY.body, fontWeight: '700', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  statusPending: { backgroundColor: 'rgba(234, 179, 8, 0.15)' },
  statusAccepted: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  details: { flexDirection: 'row', gap: SPACING.md, marginBottom: 4 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { ...TYPOGRAPHY.caption, fontSize: 11 },
  servicesList: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.md },
  servicesText: { ...TYPOGRAPHY.caption, fontWeight: '600', flex: 1 },
  priceInfo: { marginBottom: SPACING.sm },
  priceText: { ...TYPOGRAPHY.bodySmall, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: SPACING.sm, borderTopWidth: 1, paddingTop: SPACING.sm },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: BORDER_RADIUS.md, borderWidth: 1 },
  actionTextReject: { color: '#FF4444', fontWeight: 'bold', fontSize: 12 },
  actionTextAccept: { color: '#22C55E', fontWeight: 'bold', fontSize: 12 },
  actionTextCancel: { fontWeight: '600', fontSize: 12 },
  rejectBtn: { borderColor: 'rgba(255, 68, 68, 0.3)', backgroundColor: 'rgba(255, 68, 68, 0.05)' },
  acceptBtn: { borderColor: 'rgba(34, 197, 94, 0.3)', backgroundColor: 'rgba(34, 197, 94, 0.05)' },
  cancelBtn: { borderStyle: 'dashed' },
  emptyText: { ...TYPOGRAPHY.bodySmall, textAlign: 'center', marginTop: SPACING.lg }
});
