import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currency: string;
  formatPrice: (ptPrice: number, esPrice: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const TRANSLATIONS = {
  pt: {
    'login.title': 'BarberFlow',
    'login.tagline': 'Sua melhor versão começa aqui',
    'login.email': 'E-mail',
    'login.password': 'Senha',
    'login.forgot': 'Esqueceu a senha?',
    'login.submit': 'Entrar',
    'login.noAccount': 'Não tem uma conta?',
    'login.register': 'Cadastre-se',
    'lang.title': 'Idioma',
    'lang.subtitle': 'Como você gostaria de ser atendido?',
    'lang.continue': 'Continuar',
    'home.greeting': 'Olá, Douglas!',
    'home.subtitle': 'Onde vamos cortar hoje?',
    'home.services': 'Nossos Serviços',
    'home.barbers': 'Barbeiros',
    'home.view': 'Ver',
    'home.location': 'Foz do Iguaçu, BR',
    'home.bannerTitle': '30% OFF',
    'home.bannerSubtitle': 'Na sua primeira visita com o barbeiro João!',
    'home.avail': 'Aproveitar',
    'book.new': 'Novo Agendamento',
    'book.choose': 'Escolha o melhor momento para você',
    'book.services': 'Serviços & Barbeiro',
    'book.dateTime': 'Data & Horário',
    'book.payment': 'Pagamento',
    'book.confirm': 'Confirmar Agendamento',
    'book.finish': 'Finalizar',
    'book.back': 'Voltar',
    'book.next': 'Continuar',
    'book.morning': 'Manhã',
    'book.afternoon': 'Tarde',
    'book.total': 'Total Estimado',
    'book.combo': 'Combo Master Ativado! (Cabelo + Barba + Sobrancelha) - 10% OFF',
    'book.pix': 'PIX (Confirmação Imediata)',
    'book.transfer': 'Transferência Bancária',
    'book.money': 'Dinheiro (Pagar no Local)',
    'book.pixCopy': 'Copia e Cola PIX',
    'book.transferCopy': 'Dados para Transferência',
    'book.moneyMsg': 'Seu horário ficará como "Aguardando aprovação" até que nossa equipe confirme manualmente.',
    'book.success': 'Horário Confirmado!',
    'book.waiting': 'Aguardando Aprovação',
    'book.receipt': 'Resumo da Reserva',
    'book.service': 'Serviço',
    'book.date': 'Data',
    'book.time': 'Horário',
    'book.notification': '* Enviaremos uma notificação 1h antes.',
    'profile.edit': 'Editar Perfil',
    'profile.cuts': 'Cortes',
    'profile.points': 'Pontos',
    'profile.personal': 'Dados Pessoais',
    'profile.payments': 'Pagamentos',
    'profile.notifications': 'Notificações',
    'profile.settings': 'Configurações',
    'profile.logout': 'Sair da Conta',
    'profile.logoutConfirm': 'Encerrar Sessão',
    'tab.home': 'Início',
    'tab.book': 'Agendar',
    'tab.profile': 'Perfil',
  },
  es: {
    'login.title': 'BarberFlow',
    'login.tagline': 'Tu mejor versión comienza aquí',
    'login.email': 'Correo electrónico',
    'login.password': 'Contraseña',
    'login.forgot': '¿Olvidaste tu contraseña?',
    'login.submit': 'Iniciar sesión',
    'login.noAccount': '¿No tienes una cuenta?',
    'login.register': 'Regístrate',
    'lang.title': 'Idioma',
    'lang.subtitle': '¿Cómo le gustaría ser atendido?',
    'lang.continue': 'Continuar',
    'home.greeting': '¡Hola, Douglas!',
    'home.subtitle': '¿Dónde vamos a cortar hoy?',
    'home.services': 'Nuestros Servicios',
    'home.barbers': 'Barberos',
    'home.view': 'Ver',
    'home.location': 'Ciudad del Este, PY',
    'home.bannerTitle': '30% DESC',
    'home.bannerSubtitle': '¡En tu primera visita con el barbero João!',
    'home.avail': 'Aprovechar',
    'book.new': 'Nueva Cita',
    'book.choose': 'Elige el mejor momento para ti',
    'book.services': 'Servicios y Barbero',
    'book.dateTime': 'Fecha y Horario',
    'book.payment': 'Pago',
    'book.confirm': 'Confirmar Cita',
    'book.finish': 'Finalizar',
    'book.back': 'Volver',
    'book.next': 'Continuar',
    'book.morning': 'Mañana',
    'book.afternoon': 'Tarde',
    'book.total': 'Total Estimado',
    'book.combo': '¡Combo Master Activado! (Cabelo + Barba + Cejas) - 10% DESC',
    'book.pix': 'Transferencia Inmediata',
    'book.transfer': 'Transferencia Bancaria',
    'book.money': 'Efectivo (Pagar en el Local)',
    'book.pixCopy': 'Enlace de Transferencia',
    'book.transferCopy': 'Datos de Transferencia',
    'book.moneyMsg': 'Su cita quedará como "Esperando aprobación" hasta que nuestro equipo la confirme manualmente.',
    'book.success': '¡Cita Confirmada!',
    'book.waiting': 'Esperando Aprobación',
    'book.receipt': 'Resumen de la Reserva',
    'book.service': 'Servicio',
    'book.date': 'Fecha',
    'book.time': 'Horario',
    'book.notification': '* Enviaremos una notificación 1h antes.',
    'profile.edit': 'Editar Perfil',
    'profile.cuts': 'Cortes',
    'profile.points': 'Puntos',
    'profile.personal': 'Datos Personales',
    'profile.payments': 'Pagos',
    'profile.notifications': 'Notificaciones',
    'profile.settings': 'Configuración',
    'profile.logout': 'Cerrar Sesión',
    'profile.logoutConfirm': 'Cerrar Sesión',
    'tab.home': 'Inicio',
    'tab.book': 'Agendar',
    'tab.profile': 'Perfil',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string) => {
    return TRANSLATIONS[language][key as keyof typeof TRANSLATIONS['pt']] || key;
  };

  const currency = language === 'pt' ? 'R$' : 'GS';

  const formatPrice = (ptPrice: number, esPrice: number) => {
    if (language === 'pt') {
      return `R$ ${ptPrice.toFixed(2).replace('.', ',')}`;
    } else {
      return `${esPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} GS`;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currency, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
