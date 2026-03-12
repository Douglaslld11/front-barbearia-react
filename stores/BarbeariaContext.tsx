import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Service {
  id: string;
  nomePt: string;
  nomeEs: string;
  precoPt: number;
  precoEs: number;
  duracao: number; // em minutos
}

export interface Barber {
  id: string;
  nome: string;
  foto: string;
  commission: number;
  email?: string;
  password?: string;
  permissions?: {
    canViewFinance: boolean;
    canEditConfig: boolean;
    canEditAgenda: boolean;
  };
}

export interface Appointment {
  id: string;
  clientName: string;
  serviceIds: string[];
  barberId: string;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected';
  totalPt: number;
  totalEs: number;
}

export interface BlockedSlot {
  id: string;
  barberId: string;
  date: string;
  time: string; // Pode ser 'all-day' ou um horário específico ex: '09:00'
}

export interface BarbeariaData {
  id: string;
  nome: string;
  slug: string;
  logo: string;
  endereco: string;
  cidade: string;
  numero: string;
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
  paymentMethods: string[];
  blockedSlots: BlockedSlot[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    text: string;
    textMuted: string;
  };
}

interface BarbeariaContextType {
  barbearia: BarbeariaData | null;
  isLoading: boolean;
  error: string | null;
  activeBarberId: string | null;
  loginBarber: (id: string | null) => void;
  updateBarbearia: (data: Partial<BarbeariaData>) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  addBarber: (barber: Omit<Barber, 'id'>) => Promise<void>;
  removeBarber: (id: string) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: 'accepted' | 'rejected') => Promise<void>;
  updateBlockedSlots: (slots: {barberId: string, date: string, time: string}[], action: 'block' | 'unblock') => Promise<void>;
}

const BarbeariaContext = createContext<BarbeariaContextType | undefined>(undefined);

const STORAGE_KEY = '@barber_flow_barbearia_data';

const DEFAULT_COLORS = {
  primary: '#EAB308',
  secondary: '#1A1A1A',
  accent: '#8B4513',
  background: '#0F0F0F',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textMuted: '#A0A0A0',
};

export function BarbeariaProvider({ children }: { children: ReactNode }) {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [barbearia, setBarbearia] = useState<BarbeariaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeBarberId, setActiveBarberId] = useState<string | null>(null);

  const loginBarber = (id: string | null) => {
    setActiveBarberId(id);
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        
        if (stored) {
          const parsed = JSON.parse(stored) as BarbeariaData;
          if (!slug || parsed.slug === slug) {
            setBarbearia(parsed);
          } else if (slug === 'vintage-barber') {
            setBarbearia(parsed);
          } else {
             // Se o slug for diferente, podemos recriar um mock com esse slug para fins de demonstração
             const newMock = { ...parsed, slug: slug };
             setBarbearia(newMock);
          }
        } else {
          // MOCK INICIAL (Primeira vez que o app abre em um dispositivo novo)
          // Isso garante que o link funcione em qualquer celular mesmo sem banco de dados real
          const mock: BarbeariaData = {
            id: '1',
            nome: slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Barbearia Modelo',
            slug: slug || 'vintage-barber',
            logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=200&h=200&auto=format&fit=crop',
            endereco: 'Rua das Flores, 123',
            cidade: 'São Paulo',
            numero: 'Sede',
            services: [
              { id: '1', nomePt: 'Corte de Cabelo', nomeEs: 'Corte de Cabello', precoPt: 50, precoEs: 70000, duracao: 30 },
              { id: '2', nomePt: 'Barba Completa', nomeEs: 'Barba Completa', precoPt: 35, precoEs: 50000, duracao: 20 },
              { id: '3', nomePt: 'Combo (Corte + Barba)', nomeEs: 'Combo (Corte + Barba)', precoPt: 75, precoEs: 100000, duracao: 50 },
            ],
            barbers: [
              { 
                id: '1', 
                nome: 'Marcus Silva', 
                foto: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=400', 
                commission: 50,
                email: 'marcus@barber.com',
                password: '123',
                permissions: { canViewFinance: false, canEditConfig: false, canEditAgenda: true }
              },
            ],
            appointments: [],
            paymentMethods: ['money', 'pix', 'card', 'alias'],
            blockedSlots: [],
            colors: DEFAULT_COLORS,
          };
          setBarbearia(mock);
          // Salva no novo dispositivo para que ele também tenha uma base de dados local
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const updateBarbearia = async (data: Partial<BarbeariaData>) => {
    const updated = barbearia 
      ? { ...barbearia, ...data } 
      : { 
          id: Math.random().toString(36).substr(2, 9),
          nome: '',
          slug: '',
          logo: '',
          endereco: '',
          cidade: '',
          numero: '',
          services: [],
          barbers: [],
          appointments: [],
          colors: DEFAULT_COLORS,
          ...data 
        } as BarbeariaData;
    
    setBarbearia(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Math.random().toString(36).substr(2, 9) };
    if (!barbearia) return;
    const updated = {
      ...barbearia,
      services: [...(barbearia.services || []), newService]
    } as BarbeariaData;
    setBarbearia(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeService = async (id: string) => {
    if (!barbearia) return;
    const updated = {
      ...barbearia,
      services: barbearia.services.filter(s => s.id !== id)
    };
    setBarbearia(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addBarber = async (barber: Omit<Barber, 'id'>) => {
    const newBarber = { ...barber, id: Math.random().toString(36).substr(2, 9) };
    if (!barbearia) return;
    const updated = {
      ...barbearia,
      barbers: [...(barbearia.barbers || []), newBarber]
    };
    setBarbearia(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeBarber = async (id: string) => {
    if (!barbearia) return;
    const updated = {
      ...barbearia,
      barbers: barbearia.barbers.filter(b => b.id !== id)
    };
    setBarbearia(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = { 
      ...appointment, 
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending'
    };
    if (!barbearia) return;
    const updated = {
      ...barbearia,
      appointments: [...(barbearia.appointments || []), newAppointment]
    };
    setBarbearia(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const updateAppointmentStatus = async (id: string, status: 'accepted' | 'rejected') => {
    if (!barbearia) return;
    const updated = {
      ...barbearia,
      appointments: barbearia.appointments.map(a => a.id === id ? { ...a, status } : a)
    };
    setBarbearia(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const updateBlockedSlots = async (slots: {barberId: string, date: string, time: string}[], action: 'block' | 'unblock') => {
    if (!barbearia) return;
    
    let newBlockedSlots = [...(barbearia.blockedSlots || [])];

    slots.forEach(slot => {
      const existingIndex = newBlockedSlots.findIndex(
        s => s.barberId === slot.barberId && s.date === slot.date && s.time === slot.time
      );

      if (action === 'block' && existingIndex === -1) {
        newBlockedSlots.push({
          id: Math.random().toString(36).substr(2, 9),
          ...slot
        });
      } else if (action === 'unblock' && existingIndex >= 0) {
        newBlockedSlots.splice(existingIndex, 1);
      }
    });

    const updated = {
      ...barbearia,
      blockedSlots: newBlockedSlots
    };
    setBarbearia(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <BarbeariaContext.Provider value={{ 
      barbearia, 
      isLoading, 
      error, 
      activeBarberId,
      loginBarber,
      updateBarbearia, 
      addService, 
      removeService, 
      addBarber, 
      removeBarber,
      addAppointment,
      updateAppointmentStatus,
      updateBlockedSlots
    }}>
      {children}
    </BarbeariaContext.Provider>
  );
}

export const useBarbearia = () => {
  const context = useContext(BarbeariaContext);
  if (context === undefined) {
    throw new Error('useBarbearia deve ser usado dentro de um BarbeariaProvider');
  }
  return context;
};
