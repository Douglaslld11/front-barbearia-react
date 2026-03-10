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
  Image as ImageIcon
} from 'lucide-react-native';

export default function ConfigPage() {
  const { barbearia, updateBarbearia, addService, removeService, addBarber, removeBarber, isLoading } = useBarbearia();
  const { t, language, formatPrice } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState(1);

  // Form estados
  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero, setNumero] = useState('');
  
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
    }
  }, [barbearia]);

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
      base64: true, // Usamos base64 para persistência simples no AsyncStorage
    });

    if (!result.canceled && result.assets[0].base64) {
      setter(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    try {
      await updateBarbearia({ nome, slug, logo, endereco, cidade, numero });
    } catch (err) {
      console.error(err);
    }
  };

  const nextStep = async () => {
    await handleSave();
    setCurrentStep(prev => Math.min(prev + 1, 5));
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

  if (isLoading) return <View style={styles.center}><Text style={{color: 'white'}}>Carregando...</Text></View>;

  const renderStepIndicator = () => (
    <View style={styles.indicatorContainer}>
      {[1, 2, 3, 4, 5].map((step) => (
        <View 
          key={step} 
          style={[
            styles.indicator, 
            step <= currentStep ? styles.indicatorActive : styles.indicatorInactive
          ]} 
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp} style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.settings')}</Text>
        {renderStepIndicator()}
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>
          {currentStep === 1 && t('admin.config.identity')}
          {currentStep === 2 && t('admin.config.location')}
          {currentStep === 3 && t('admin.config.services')}
          {currentStep === 4 && t('admin.config.barbers')}
          {currentStep === 5 && t('admin.config.ready')}
        </Text>

        {currentStep === 1 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card style={styles.stepCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome da Barbearia</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Barber Shop VIP" placeholderTextColor={COLORS.textMuted} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Slug da URL</Text>
                <TextInput style={styles.input} value={slug} onChangeText={setSlug} placeholder="Ex: minha-barbearia" placeholderTextColor={COLORS.textMuted} />
              </View>
              
              <Text style={styles.label}>Logo da Barbearia</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setLogo)}>
                {logo ? (
                  <Image source={{ uri: logo }} style={styles.pickedLogo} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Camera color={COLORS.textMuted} size={32} />
                    <Text style={styles.imagePlaceholderText}>Selecionar Logo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Card>
          </Animated.View>
        )}

        {currentStep === 2 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card style={styles.stepCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput style={styles.input} value={cidade} onChangeText={setCidade} placeholder="Ex: São Paulo" placeholderTextColor={COLORS.textMuted} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Endereço</Text>
                <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua..." placeholderTextColor={COLORS.textMuted} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Número</Text>
                <TextInput style={styles.input} value={numero} onChangeText={setNumero} placeholder="123" placeholderTextColor={COLORS.textMuted} />
              </View>
            </Card>
          </Animated.View>
        )}

        {currentStep === 3 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card style={styles.stepCard}>
              {barbearia?.services.map((service) => (
                <View key={service.id} style={styles.listItem}>
                  <View style={{flex:1}}>
                    <Text style={styles.itemName}>{language === 'pt' ? service.nomePt : service.nomeEs}</Text>
                    <Text style={styles.itemMeta}>
                      {formatPrice(service.precoPt, service.precoEs)} • {service.duracao} min
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeService(service.id)} style={styles.deleteBtn}>
                    <Trash2 color="#FF4444" size={20} />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.addBox}>
                <TextInput style={styles.inputSmall} value={newServiceNamePt} onChangeText={setNewServiceNamePt} placeholder="Nome em Português" placeholderTextColor={COLORS.textMuted} />
                <TextInput style={styles.inputSmall} value={newServiceNameEs} onChangeText={setNewServiceNameEs} placeholder="Nombre en Español" placeholderTextColor={COLORS.textMuted} />
                <View style={styles.row}>
                   <TextInput style={[styles.inputSmall, {flex: 1, marginRight: 8}]} value={newServicePricePt} onChangeText={setNewServicePricePt} placeholder="Preço (R$)" keyboardType="numeric" placeholderTextColor={COLORS.textMuted} />
                   <TextInput style={[styles.inputSmall, {flex: 1}]} value={newServicePriceEs} onChangeText={setNewServicePriceEs} placeholder="Preço (GS)" keyboardType="numeric" placeholderTextColor={COLORS.textMuted} />
                </View>
                <TextInput style={styles.inputSmall} value={newServiceDuration} onChangeText={setNewServiceDuration} placeholder="Minutos de Duração" keyboardType="numeric" placeholderTextColor={COLORS.textMuted} />
                <Button title="Adicionar" onPress={handleAddService} variant="outline" style={{marginTop: 8}} />
              </View>
            </Card>
          </Animated.View>
        )}

        {currentStep === 4 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Card style={styles.stepCard}>
              <View style={styles.list}>
                {barbearia?.barbers?.map((barber) => (
                  <View key={barber.id} style={styles.listItem}>
                    <Image source={{ uri: barber.foto }} style={styles.avatar} />
                    <View style={{flex:1, marginLeft: 12}}>
                      <Text style={styles.itemName}>{barber.nome}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeBarber(barber.id)} style={styles.deleteBtn}>
                      <Trash2 color="#FF4444" size={20} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.addBox}>
                <TextInput style={styles.inputSmall} value={newBarberName} onChangeText={setNewBarberName} placeholder="Nome do Barbeiro" placeholderTextColor={COLORS.textMuted} />
                
                <Text style={[styles.label, {marginTop: 10}]}>Foto do Barbeiro</Text>
                <TouchableOpacity style={styles.imagePickerSmall} onPress={() => pickImage(setNewBarberPhoto)}>
                  {newBarberPhoto ? (
                    <Image source={{ uri: newBarberPhoto }} style={styles.pickedAvatar} />
                  ) : (
                    <View style={styles.imagePlaceholderSmall}>
                      <Users color={COLORS.textMuted} size={24} />
                      <Text style={styles.imagePlaceholderTextSmall}>Escolher Foto</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <Button title="Adicionar Barbeiro" onPress={handleAddBarber} variant="outline" style={{marginTop: 15}} />
              </View>
            </Card>
          </Animated.View>
        )}

        {currentStep === 5 && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.finishContainer}>
            <CheckCircle2 color={COLORS.success} size={100} />
            <Text style={styles.finishTitle}>{t('admin.config.ready')}</Text>
            
            <TouchableOpacity style={styles.linkCard} onPress={handleViewApp}>
               <Globe color={COLORS.primary} size={24} />
               <Text style={styles.linkText}>{window.location.origin}/{slug}</Text>
            </TouchableOpacity>

            <Button title="Dashboard" onPress={() => router.replace('/admin/dashboard')} style={{width: '100%', marginTop: 40}} />
          </Animated.View>
        )}
      </ScrollView>

      <View style={styles.footerNav}>
        {currentStep > 1 && currentStep < 5 && (
          <Button title={t('admin.config.back')} variant="ghost" onPress={prevStep} style={{flex: 1}} />
        )}
        {currentStep < 5 && (
          <Button title={t('admin.config.next')} onPress={nextStep} style={{flex: 2}} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    padding: SPACING.xl, 
    paddingTop: 60, 
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    ...(SHADOWS.medium as any),
  },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },
  indicatorContainer: { flexDirection: 'row', gap: 6 },
  indicator: { flex: 1, height: 4, borderRadius: 2 },
  indicatorActive: { backgroundColor: COLORS.primary },
  indicatorInactive: { backgroundColor: COLORS.divider },
  content: { padding: SPACING.xl, paddingBottom: 120 },
  stepTitle: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginBottom: SPACING.xl },
  stepCard: { padding: SPACING.lg },
  inputGroup: { marginBottom: SPACING.lg },
  label: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginBottom: 8 },
  input: { 
    backgroundColor: COLORS.surfaceLight, 
    borderRadius: BORDER_RADIUS.md, 
    padding: SPACING.md, 
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.divider,
    ...TYPOGRAPHY.body
  },
  inputSmall: { 
    backgroundColor: COLORS.surface, 
    borderRadius: BORDER_RADIUS.sm, 
    padding: 12, 
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: 10,
    ...TYPOGRAPHY.bodySmall
  },
  row: { flexDirection: 'row' },
  imagePicker: {
    width: '100%',
    height: 150,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  pickedLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  imagePickerSmall: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pickedAvatar: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholderSmall: {
    alignItems: 'center',
    gap: 4,
  },
  imagePlaceholderTextSmall: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  addBox: { marginTop: 20, padding: 15, backgroundColor: `${COLORS.primary}05`, borderRadius: BORDER_RADIUS.lg, borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.primary },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  itemName: { ...TYPOGRAPHY.body, color: COLORS.text, fontWeight: '700' },
  itemMeta: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginTop: 4 },
  deleteBtn: { padding: 8 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  list: { marginBottom: 10 },
  finishContainer: { alignItems: 'center', marginTop: 40 },
  finishTitle: { ...TYPOGRAPHY.h1, color: COLORS.text, marginTop: 20 },
  linkCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface, padding: 20, borderRadius: BORDER_RADIUS.xl, marginTop: 40, borderWidth: 1, borderColor: COLORS.primary, ...(SHADOWS.medium as any) },
  linkText: { color: COLORS.primary, fontWeight: 'bold', ...TYPOGRAPHY.body },
  footerNav: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.xl, backgroundColor: COLORS.background, flexDirection: 'row', gap: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.divider }
});
