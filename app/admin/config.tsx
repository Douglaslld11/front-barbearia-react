import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Linking,
  Platform,
  Image
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { useBarbearia } from '../../stores/BarbeariaContext';
import { useLanguage } from '../../stores/LanguageContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Globe,
  Scissors,
  Layout,
  MapPin,
  Users,
  Camera,
  CreditCard,
  Wallet,
  Smartphone,
  Check
} from 'lucide-react-native';

const DEFAULT_COLORS = {
  primary: '#EAB308',
  secondary: '#1A1A1A',
  accent: '#8B4513',
  background: '#0F0F0F',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textMuted: '#A0A0A0',
};

export default function ConfigPage() {
  const { barbearia, updateBarbearia, addService, removeService, addBarber, removeBarber, isLoading } = useBarbearia();
  const { t, language, formatPrice } = useLanguage();
  
  // Use colors do context ou theme default
  const themeColors = barbearia?.colors || COLORS;
  
  const [currentStep, setCurrentStep] = useState(1);

  // Form estados
  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero, setNumero] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['money', 'pix', 'card', 'alias']);
  const [primaryColor, setPrimaryColor] = useState(themeColors.primary);
  
  // Novo serviço estado
  const [newServiceNamePt, setNewServiceNamePt] = useState('');
  const [newServiceNameEs, setNewServiceNameEs] = useState('');
  const [newServicePricePt, setNewServicePricePt] = useState('');
  const [newServicePriceEs, setNewServicePriceEs] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');

  // Novo barbeiro estado
  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberPhoto, setNewBarberPhoto] = useState('');

  useEffect(() => {
    if (barbearia) {
      setNome(barbearia.nome || '');
      setSlug(barbearia.slug || '');
      setLogo(barbearia.logo || '');
      setEndereco(barbearia.endereco || '');
      setCidade(barbearia.cidade || '');
      setNumero(barbearia.numero || '');
      if (barbearia.paymentMethods && barbearia.paymentMethods.length > 0) {
        setPaymentMethods(barbearia.paymentMethods);
      }
      if (barbearia.colors && barbearia.colors.primary) {
        setPrimaryColor(barbearia.colors.primary);
      }
    }
  }, [barbearia]);

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method) 
        : [...prev, method]
    );
  };

  const pickImage = async (setter: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para escolher a foto.');
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
      setter(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    try {
      const colors = { ...DEFAULT_COLORS, primary: primaryColor };
      await updateBarbearia({ nome, slug, logo, endereco, cidade, numero, paymentMethods, colors });
    } catch (err) {
      console.error(err);
    }
  };

  const nextStep = async () => {
    await handleSave();
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleAddService = async () => {
    if (!newServiceNamePt || !newServiceNameEs || !newServicePricePt || !newServicePriceEs || !newServiceDuration) {
        if(Platform.OS === 'web') window.alert(t('admin.config.fill_all') || 'Preencha todos os campos');
        return;
    }
    try {
      await addService({
        nomePt: newServiceNamePt,
        nomeEs: newServiceNameEs,
        precoPt: Number(newServicePricePt),
        precoEs: Number(newServicePriceEs),
        duracao: Number(newServiceDuration),
      });
      setNewServiceNamePt('');
      setNewServiceNameEs('');
      setNewServicePricePt('');
      setNewServicePriceEs('');
      setNewServiceDuration('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBarber = async () => {
    if (!newBarberName) return;
    try {
      await addBarber({
        nome: newBarberName,
        foto: newBarberPhoto || 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=400',
      });
      setNewBarberName('');
      setNewBarberPhoto('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewApp = () => {
    const url = `${window.location.origin}/${slug}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  if (isLoading) return <View style={[styles.center, { backgroundColor: themeColors.background }]}><Text style={{color: themeColors.text}}>Carregando...</Text></View>;

  const renderStepIndicator = () => (
    <View style={styles.indicatorContainer}>
      {[1, 2, 3, 4, 5, 6, 7].map((step) => (
        <View 
          key={step} 
          style={[
            styles.indicator, 
            { backgroundColor: step <= currentStep ? primaryColor : themeColors.divider }
          ]} 
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Animated.View entering={FadeInUp} style={[styles.header, { backgroundColor: themeColors.surface }]}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>{t('profile.settings')}</Text>
        {renderStepIndicator()}
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.stepTitle, { color: primaryColor }]}>
          {currentStep === 1 ? t('admin.config.identity') :
           currentStep === 2 ? t('admin.config.location') :
           currentStep === 3 ? t('admin.config.services') :
           currentStep === 4 ? t('admin.config.barbers') :
           currentStep === 5 ? (t('admin.config.payments') || 'Formas de Recebimento') :
           currentStep === 6 ? (t('admin.config.colors') || 'Cores do App') :
           t('admin.config.ready')}
        </Text>

        {currentStep === 1 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card style={[styles.stepCard, { backgroundColor: themeColors.surface }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.textMuted }]}>Nome da Barbearia</Text>
                <TextInput style={[styles.input, { backgroundColor: themeColors.surfaceLight, color: themeColors.text, borderColor: themeColors.divider }]} value={nome} onChangeText={setNome} placeholder="Ex: Barber Shop VIP" placeholderTextColor={themeColors.textMuted} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.textMuted }]}>Slug da URL</Text>
                <TextInput style={[styles.input, { backgroundColor: themeColors.surfaceLight, color: themeColors.text, borderColor: themeColors.divider }]} value={slug} onChangeText={setSlug} placeholder="Ex: minha-barbearia" placeholderTextColor={themeColors.textMuted} />
              </View>
              
              <Text style={[styles.label, { color: themeColors.textMuted }]}>Logo da Barbearia</Text>
              <TouchableOpacity style={[styles.imagePicker, { backgroundColor: themeColors.surfaceLight, borderColor: themeColors.divider }]} onPress={() => pickImage(setLogo)}>
                {logo ? (
                  <Image source={{ uri: logo }} style={styles.pickedLogo} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Camera color={themeColors.textMuted} size={32} />
                    <Text style={[styles.imagePlaceholderText, { color: themeColors.textMuted }]}>Selecionar Logo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Card>
          </Animated.View>
        )}

        {currentStep === 2 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card style={[styles.stepCard, { backgroundColor: themeColors.surface }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.textMuted }]}>Cidade</Text>
                <TextInput style={[styles.input, { backgroundColor: themeColors.surfaceLight, color: themeColors.text, borderColor: themeColors.divider }]} value={cidade} onChangeText={setCidade} placeholder="Ex: São Paulo" placeholderTextColor={themeColors.textMuted} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.textMuted }]}>Endereço</Text>
                <TextInput style={[styles.input, { backgroundColor: themeColors.surfaceLight, color: themeColors.text, borderColor: themeColors.divider }]} value={endereco} onChangeText={setEndereco} placeholder="Rua..." placeholderTextColor={themeColors.textMuted} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.textMuted }]}>Número</Text>
                <TextInput style={[styles.input, { backgroundColor: themeColors.surfaceLight, color: themeColors.text, borderColor: themeColors.divider }]} value={numero} onChangeText={setNumero} placeholder="123" placeholderTextColor={themeColors.textMuted} />
              </View>
            </Card>
          </Animated.View>
        )}

        {currentStep === 3 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card style={[styles.stepCard, { backgroundColor: themeColors.surface }]}>
              {barbearia?.services.map((service) => (
                <View key={service.id} style={[styles.listItem, { borderBottomColor: themeColors.divider }]}>
                  <View style={{flex:1}}>
                    <Text style={[styles.itemName, { color: themeColors.text }]}>{language === 'pt' ? service.nomePt : service.nomeEs}</Text>
                    <Text style={[styles.itemMeta, { color: themeColors.textMuted }]}>
                      {`${formatPrice(service.precoPt, service.precoEs)} • ${service.duracao} min`}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeService(service.id)} style={styles.deleteBtn}>
                    <Trash2 color="#FF4444" size={20} />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={[styles.addBox, { backgroundColor: `${primaryColor}10`, borderColor: primaryColor }]}>
                <TextInput style={[styles.inputSmall, { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.divider }]} value={newServiceNamePt} onChangeText={setNewServiceNamePt} placeholder="Nome em Português" placeholderTextColor={themeColors.textMuted} />
                <TextInput style={[styles.inputSmall, { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.divider }]} value={newServiceNameEs} onChangeText={setNewServiceNameEs} placeholder="Nombre en Español" placeholderTextColor={themeColors.textMuted} />
                <View style={styles.row}>
                   <TextInput style={[styles.inputSmall, { flex: 1, marginRight: 8, backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.divider }]} value={newServicePricePt} onChangeText={setNewServicePricePt} placeholder="Preço (R$)" keyboardType="numeric" placeholderTextColor={themeColors.textMuted} />
                   <TextInput style={[styles.inputSmall, { flex: 1, backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.divider }]} value={newServicePriceEs} onChangeText={setNewServicePriceEs} placeholder="Preço (GS)" keyboardType="numeric" placeholderTextColor={themeColors.textMuted} />
                </View>
                <TextInput style={[styles.inputSmall, { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.divider }]} value={newServiceDuration} onChangeText={setNewServiceDuration} placeholder="Minutos de Duração" keyboardType="numeric" placeholderTextColor={themeColors.textMuted} />
                <Button title="Adicionar" onPress={handleAddService} variant="outline" style={{marginTop: 8, borderColor: primaryColor}} textStyle={{color: primaryColor}} />
              </View>
            </Card>
          </Animated.View>
        )}

        {currentStep === 4 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card style={[styles.stepCard, { backgroundColor: themeColors.surface }]}>
              <View style={styles.list}>
                {barbearia?.barbers?.map((barber) => (
                  <View key={barber.id} style={[styles.listItem, { borderBottomColor: themeColors.divider }]}>
                    <Image source={{ uri: barber.foto }} style={styles.avatar} />
                    <View style={{flex:1, marginLeft: 12}}>
                      <Text style={[styles.itemName, { color: themeColors.text }]}>{barber.nome}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeBarber(barber.id)} style={styles.deleteBtn}>
                      <Trash2 color="#FF4444" size={20} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={[styles.addBox, { backgroundColor: `${primaryColor}10`, borderColor: primaryColor }]}>
                <TextInput style={[styles.inputSmall, { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.divider }]} value={newBarberName} onChangeText={setNewBarberName} placeholder="Nome do Barbeiro" placeholderTextColor={themeColors.textMuted} />
                
                <Text style={[styles.label, {marginTop: 10, color: themeColors.textMuted}]}>Foto do Barbeiro</Text>
                <TouchableOpacity style={[styles.imagePickerSmall, { backgroundColor: themeColors.surface, borderColor: themeColors.divider }]} onPress={() => pickImage(setNewBarberPhoto)}>
                  {newBarberPhoto ? (
                    <Image source={{ uri: newBarberPhoto }} style={styles.pickedAvatar} />
                  ) : (
                    <View style={styles.imagePlaceholderSmall}>
                      <Users color={themeColors.textMuted} size={24} />
                      <Text style={[styles.imagePlaceholderTextSmall, { color: themeColors.textMuted }]}>Escolher Foto</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <Button title="Adicionar Barbeiro" onPress={handleAddBarber} variant="outline" style={{marginTop: 15, borderColor: primaryColor}} textStyle={{color: primaryColor}} />
              </View>
            </Card>
          </Animated.View>
        )}

        {currentStep === 5 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card style={[styles.stepCard, { backgroundColor: themeColors.surface }]}>
              <Text style={[styles.cardInfo, { color: themeColors.textMuted }]}>{t('admin.config.payments_desc') || 'Selecione quais formas de pagamento sua barbearia aceita.'}</Text>
              
              <View style={styles.paymentGrid}>
                {[
                  { id: 'pix', label: 'PIX (Brasil)', icon: <Smartphone size={24} color={primaryColor} /> },
                  { id: 'card', label: 'Cartão / Tarjeta', icon: <CreditCard size={24} color={primaryColor} /> },
                  { id: 'money', label: 'Dinheiro / Efectivo', icon: <Wallet size={24} color={primaryColor} /> },
                  { id: 'alias', label: 'Alias (Paraguay)', icon: <Smartphone size={24} color={primaryColor} /> },
                ].map((method) => {
                  const isSelected = paymentMethods.includes(method.id);
                  return (
                    <TouchableOpacity 
                      key={method.id} 
                      style={[
                        styles.paymentMethodCard, 
                        { backgroundColor: themeColors.surfaceLight, borderColor: themeColors.divider },
                        isSelected && { borderColor: primaryColor, backgroundColor: `${primaryColor}10` }
                      ]} 
                      onPress={() => togglePaymentMethod(method.id)}
                    >
                      <View style={styles.paymentMethodHeader}>
                        {method.icon}
                        {isSelected && <Check size={16} color={primaryColor} />}
                      </View>
                      <Text style={[styles.paymentMethodLabel, { color: themeColors.text }, isSelected && { color: primaryColor }]}>{method.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>
          </Animated.View>
        )}

        {currentStep === 6 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card style={[styles.stepCard, { backgroundColor: themeColors.surface }]}>
              <Text style={[styles.cardInfo, { color: themeColors.textMuted }]}>{t('admin.config.colors_desc') || 'Selecione a cor principal da sua barbearia para personalizar o aplicativo.'}</Text>
              
              <View style={styles.paymentGrid}>
                {[
                  { id: '#EAB308', label: 'Gold Premium' },
                  { id: '#3B82F6', label: 'Azul Moderno' },
                  { id: '#EF4444', label: 'Vermelho Forte' },
                  { id: '#22C55E', label: 'Verde Natural' },
                  { id: '#A855F7', label: 'Roxo Royal' },
                  { id: '#F97316', label: 'Laranja Vivo' },
                ].map((colorOpt) => {
                  const isSelected = primaryColor === colorOpt.id;
                  return (
                    <TouchableOpacity 
                      key={colorOpt.id} 
                      style={[
                        styles.paymentMethodCard, 
                        { backgroundColor: themeColors.surfaceLight, borderColor: themeColors.divider },
                        isSelected && { borderColor: colorOpt.id, backgroundColor: `${colorOpt.id}10` }
                      ]} 
                      onPress={() => setPrimaryColor(colorOpt.id)}
                    >
                      <View style={styles.paymentMethodHeader}>
                        <View style={[styles.colorPreview, { backgroundColor: colorOpt.id }]} />
                        {isSelected && <Check size={16} color={colorOpt.id} />}
                      </View>
                      <Text style={[styles.paymentMethodLabel, { color: themeColors.text }, isSelected && { color: colorOpt.id }]}>{colorOpt.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>
          </Animated.View>
        )}

        {currentStep === 7 && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.finishContainer}>
            <CheckCircle2 color={primaryColor} size={100} />
            <Text style={[styles.finishTitle, { color: themeColors.text }]}>{t('admin.config.ready')}</Text>
            
            <TouchableOpacity style={[styles.linkCard, { backgroundColor: themeColors.surface, borderColor: primaryColor }]} onPress={handleViewApp}>
               <Globe color={primaryColor} size={24} />
               <Text style={[styles.linkText, { color: primaryColor }]}>{`${window.location.origin}/${slug}`}</Text>
            </TouchableOpacity>

            <Button title="Dashboard" onPress={() => router.replace('/admin/dashboard')} style={{width: '100%', marginTop: 40, backgroundColor: primaryColor}} textStyle={{color: themeColors.background}} />
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.footerNav, { backgroundColor: themeColors.background, borderTopColor: themeColors.divider }]}>
        {currentStep > 1 && currentStep < 7 && (
          <Button title={t('admin.config.back')} variant="ghost" onPress={prevStep} style={{flex: 1}} textStyle={{color: themeColors.textMuted}} />
        )}
        {currentStep < 7 && (
          <Button title={t('admin.config.next')} onPress={nextStep} style={{flex: 2, backgroundColor: primaryColor}} textStyle={{color: themeColors.background}} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    padding: SPACING.xl, 
    paddingTop: 60, 
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    ...(SHADOWS.medium as any),
  },
  headerTitle: { ...TYPOGRAPHY.h3, marginBottom: SPACING.md },
  indicatorContainer: { flexDirection: 'row', gap: 6 },
  indicator: { flex: 1, height: 4, borderRadius: 2 },
  content: { padding: SPACING.xl, paddingBottom: 120 },
  stepTitle: { ...TYPOGRAPHY.h2, marginBottom: SPACING.xl },
  stepCard: { padding: SPACING.lg },
  cardInfo: { ...TYPOGRAPHY.bodySmall, marginBottom: SPACING.lg },
  inputGroup: { marginBottom: SPACING.lg },
  label: { ...TYPOGRAPHY.caption, marginBottom: 8 },
  input: { 
    borderRadius: BORDER_RADIUS.md, 
    padding: SPACING.md, 
    borderWidth: 1,
    ...TYPOGRAPHY.body
  },
  inputSmall: { 
    borderRadius: BORDER_RADIUS.sm, 
    padding: 12, 
    borderWidth: 1,
    marginBottom: 10,
    ...TYPOGRAPHY.bodySmall
  },
  row: { flexDirection: 'row' },
  imagePicker: { width: '100%', height: 150, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg, overflow: 'hidden' },
  pickedLogo: { width: '100%', height: '100%', resizeMode: 'contain' },
  imagePlaceholder: { alignItems: 'center', gap: 8 },
  imagePlaceholderText: { ...TYPOGRAPHY.caption },
  imagePickerSmall: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  pickedAvatar: { width: '100%', height: '100%' },
  imagePlaceholderSmall: { alignItems: 'center', gap: 4 },
  imagePlaceholderTextSmall: { fontSize: 10, textAlign: 'center' },
  addBox: { marginTop: 20, padding: 15, borderRadius: BORDER_RADIUS.lg, borderStyle: 'dashed', borderWidth: 1 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1 },
  itemName: { ...TYPOGRAPHY.body, fontWeight: '700' },
  itemMeta: { ...TYPOGRAPHY.caption, marginTop: 4 },
  deleteBtn: { padding: 8 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  list: { marginBottom: 10 },
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, justifyContent: 'space-between' },
  paymentMethodCard: { width: '47%', padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, borderWidth: 1 },
  paymentMethodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  paymentMethodLabel: { ...TYPOGRAPHY.bodySmall, fontWeight: '700', marginTop: SPACING.xs },
  colorPreview: { width: 24, height: 24, borderRadius: 12 },
  finishContainer: { alignItems: 'center', marginTop: 40 },
  finishTitle: { ...TYPOGRAPHY.h1, marginTop: 20 },
  linkCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, borderRadius: BORDER_RADIUS.xl, marginTop: 40, borderWidth: 1, ...(SHADOWS.medium as any) },
  linkText: { fontWeight: 'bold', ...TYPOGRAPHY.body },
  footerNav: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.xl, flexDirection: 'row', gap: SPACING.md, borderTopWidth: 1 }
});
