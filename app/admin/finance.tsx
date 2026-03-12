import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useBarbearia } from '../../stores/BarbeariaContext';
import { useLanguage } from '../../stores/LanguageContext';
import { Card } from '../../components/ui/Card';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { ChevronLeft, DollarSign, Calendar, TrendingUp, Scissors } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminFinance() {
  const { barbearia, activeBarberId } = useBarbearia();
  const { language, formatPrice, t } = useLanguage();
  
  const themeColors = barbearia?.colors || COLORS;
  const primaryColor = themeColors.primary;

  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today');

  const appointments = barbearia?.appointments || [];
  const acceptedAppointments = appointments.filter(a => a.status === 'accepted');

  const isOwner = !activeBarberId;

  // Simplificação para o escopo atual: consideramos todos os finalizados. 
  // Numa implementação com banco de dados real, aqui faríamos um filtro pelas datas (hoje, semana, mês).
  // Se for dono, vê tudo. Se for barbeiro, vê apenas os dele.
  const filteredAppointments = isOwner 
    ? acceptedAppointments 
    : acceptedAppointments.filter(a => a.barberId === activeBarberId);

  const totalRevenuePt = filteredAppointments.reduce((acc, curr) => acc + curr.totalPt, 0);
  const totalRevenueEs = filteredAppointments.reduce((acc, curr) => acc + curr.totalEs, 0);
  const totalCortes = filteredAppointments.length;

  const barbersToRender = isOwner 
    ? barbearia?.barbers || [] 
    : barbearia?.barbers.filter(b => b.id === activeBarberId) || [];

  const barbersStats = barbersToRender.map(barber => {
    const barberAppointments = filteredAppointments.filter(a => a.barberId === barber.id);
    const revenuePt = barberAppointments.reduce((acc, curr) => acc + curr.totalPt, 0);
    const revenueEs = barberAppointments.reduce((acc, curr) => acc + curr.totalEs, 0);
    
    // Calcula a comissão
    const commissionRate = barber.commission ? (barber.commission / 100) : 0.5; // fallback para 50%
    const commissionPt = revenuePt * commissionRate;
    const commissionEs = revenueEs * commissionRate;

    return {
      ...barber,
      totalCortes: barberAppointments.length,
      revenuePt,
      revenueEs,
      commissionPt,
      commissionEs,
      commissionRate: barber.commission || 50
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Animated.View entering={FadeInUp.duration(600)} style={[styles.header, { backgroundColor: themeColors.surface }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft color={primaryColor} size={28} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: themeColors.text }]}>Financeiro & Comissões</Text>
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Filtros de Tempo (Visual/Mock) */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.filterContainer}>
           <TouchableOpacity 
             style={[styles.filterBtn, filter === 'today' && { backgroundColor: primaryColor }]} 
             onPress={() => setFilter('today')}
           >
             <Text style={[styles.filterText, filter === 'today' && { color: themeColors.background }]}>Hoje</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.filterBtn, filter === 'week' && { backgroundColor: primaryColor }]} 
             onPress={() => setFilter('week')}
           >
             <Text style={[styles.filterText, filter === 'week' && { color: themeColors.background }]}>Semana</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.filterBtn, filter === 'month' && { backgroundColor: primaryColor }]} 
             onPress={() => setFilter('month')}
           >
             <Text style={[styles.filterText, filter === 'month' && { color: themeColors.background }]}>Mês</Text>
           </TouchableOpacity>
        </Animated.View>

        {/* Resumo da Barbearia */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Resumo da Barbearia</Text>
          <View style={styles.statsGrid}>
            <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
              <View style={[styles.iconBox, { backgroundColor: `${primaryColor}20` }]}>
                <DollarSign size={24} color={primaryColor} />
              </View>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>Faturamento Bruto</Text>
              <Text style={[styles.statValue, { color: themeColors.text }]} numberOfLines={1}>
                {formatPrice(totalRevenuePt, totalRevenueEs)}
              </Text>
            </Card>
            
            <Card style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
              <View style={[styles.iconBox, { backgroundColor: `${primaryColor}20` }]}>
                <Scissors size={24} color={primaryColor} />
              </View>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>Cortes Realizados</Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>{totalCortes}</Text>
            </Card>
          </View>
        </Animated.View>

        {/* Relatório por Barbeiro */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginTop: SPACING.xl }]}>Comissões dos Barbeiros</Text>
          
          {barbersStats.map((stat, index) => (
            <Card key={stat.id} style={[styles.barberCard, { backgroundColor: themeColors.surface, borderColor: themeColors.divider }]} animated delay={400 + (index * 100)}>
               <View style={styles.barberHeader}>
                 <Text style={[styles.barberName, { color: primaryColor }]}>{stat.nome}</Text>
                 <View style={[styles.commissionBadge, { backgroundColor: `${primaryColor}15` }]}>
                    <Text style={[styles.commissionText, { color: primaryColor }]}>{stat.commissionRate}%</Text>
                 </View>
               </View>

               <View style={styles.barberDataRow}>
                 <View>
                   <Text style={[styles.dataLabel, { color: themeColors.textMuted }]}>Cortes</Text>
                   <Text style={[styles.dataValue, { color: themeColors.text }]}>{stat.totalCortes}</Text>
                 </View>
                 <View>
                   <Text style={[styles.dataLabel, { color: themeColors.textMuted }]}>Bruto Gerado</Text>
                   <Text style={[styles.dataValue, { color: themeColors.text }]}>{formatPrice(stat.revenuePt, stat.revenueEs)}</Text>
                 </View>
                 <View style={styles.highlightData}>
                   <Text style={[styles.dataLabel, { color: themeColors.textMuted }]}>Receber (Comissão)</Text>
                   <Text style={[styles.dataValueHighlight, { color: '#22C55E' }]}>{formatPrice(stat.commissionPt, stat.commissionEs)}</Text>
                 </View>
               </View>
            </Card>
          ))}
        </Animated.View>

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
    alignItems: 'center', 
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    ...(SHADOWS.medium as any),
    zIndex: 10,
  },
  backButton: { marginRight: SPACING.md },
  headerTextContainer: { flex: 1 },
  title: { ...TYPOGRAPHY.h2 },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  filterContainer: { flexDirection: 'row', gap: 10, marginBottom: SPACING.xl, backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: BORDER_RADIUS.full },
  filterBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: BORDER_RADIUS.full },
  filterText: { color: COLORS.textMuted, fontWeight: 'bold' },
  sectionTitle: { ...TYPOGRAPHY.h4, marginBottom: SPACING.md },
  statsGrid: { flexDirection: 'row', gap: SPACING.md },
  statCard: { flex: 1, padding: SPACING.lg, alignItems: 'center', justifyContent: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  statLabel: { ...TYPOGRAPHY.caption, marginBottom: 4 },
  statValue: { ...TYPOGRAPHY.h3 },
  barberCard: { padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1 },
  barberHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  barberName: { ...TYPOGRAPHY.h4 },
  commissionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },
  commissionText: { fontWeight: 'bold', fontSize: 12 },
  barberDataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  dataLabel: { ...TYPOGRAPHY.caption, marginBottom: 4 },
  dataValue: { ...TYPOGRAPHY.body, fontWeight: '700' },
  highlightData: { alignItems: 'flex-end' },
  dataValueHighlight: { ...TYPOGRAPHY.h4, fontWeight: '800' }
});