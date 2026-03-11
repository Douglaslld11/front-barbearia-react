import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  currency: string;
  formatPrice: (ptPrice?: number, esPrice?: number) => string;
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
    'book.card': 'Cartão de Débito/Crédito',
    'book.alias': 'Alias (Transferência)',
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
    'landing.title': 'BarberFlow SaaS',
    'landing.subtitle': 'Transforme sua barbearia com o sistema de agendamento mais completo e personalizado.',
    'landing.demo': 'Ver Demonstração',
    'landing.admin': 'Painel do Barbeiro',
    'landing.why': 'Por que escolher o BarberFlow?',
    'landing.feature1.title': 'Sistema Multi-Tenant',
    'landing.feature1.desc': 'Link exclusivo para sua barbearia (ex: app.com/sua-marca) sem concorrência.',
    'landing.feature2.title': 'Personalização de Cores',
    'landing.feature2.desc': 'Deixe o aplicativo do cliente com as cores e a logomarca exatas da sua empresa.',
    'landing.feature3.title': 'Moeda Dupla e Pagamentos',
    'landing.feature3.desc': 'Suporte automático para Real (R$) e Guarani (GS), além de PIX, Cartão e Alias.',
    'landing.feature4.title': 'Avisos Automáticos',
    'landing.feature4.desc': 'Notificações e lembretes para os clientes via WhatsApp, SMS e E-mail.',
    'landing.feature5.title': 'Agenda Inteligente',
    'landing.feature5.desc': 'Gestão completa com a possibilidade de bloquear e liberar horários em massa.',
    'landing.feature6.title': 'Experiência App Nativo',
    'landing.feature6.desc': 'Rápido, fluido e sem necessidade de baixar nada na loja de aplicativos.',
    'landing.footer': '© 2026 BarberFlow Pro. Sistema SaaS Multi-Tenant.',
    'admin.welcome': 'Bem-vindo ao Painel',
    'admin.login': 'Entrar no Painel',
    'admin.email': 'E-mail',
    'admin.password': 'Senha',
    'admin.noAccount': 'Ainda não tem conta?',
    'admin.register': 'Cadastre sua barbearia',
    'admin.dashboard.title': 'Olá, {name}',
    'admin.dashboard.pending': 'Você tem {count} agendamentos pendentes',
    'admin.dashboard.waiting': 'Aguardando Confirmação',
    'admin.dashboard.upcoming': 'Próximos Agendamentos',
    'admin.dashboard.empty': 'Nenhum agendamento confirmado ainda.',
    'admin.dashboard.accept': 'Aceitar',
    'admin.dashboard.reject': 'Recusar',
    'admin.dashboard.cancel': 'Cancelar Horário',
    'admin.dashboard.cancel_confirm': 'Deseja realmente cancelar este agendamento?',
    'admin.dashboard.pending_badge': 'Pendente',
    'admin.dashboard.confirmed_badge': 'Confirmado',
    'admin.agenda.title': 'Agenda do Dia',
    'admin.agenda.time': 'Hora',
    'admin.agenda.free': 'Livre',
    'admin.agenda.confirmed': 'Confirmado',
    'admin.config.identity': 'Identidade da sua Marca',
    'admin.config.location': 'Localização da Barbearia',
    'admin.config.services': 'Seus Serviços',
    'admin.config.barbers': 'Seus Barbeiros',
    'admin.config.payments': 'Formas de Recebimento',
    'admin.config.payments_desc': 'Selecione quais formas de pagamento sua barbearia aceita.',
    'admin.config.colors': 'Cores do App',
    'admin.config.colors_desc': 'Selecione a cor principal da sua barbearia para personalizar o aplicativo.',
    'admin.config.ready': 'Tudo Pronto!',
    'admin.config.save': 'Salvar Alterações',
    'admin.config.next': 'Próximo',
    'admin.config.back': 'Voltar',
    'admin.config.viewApp': 'Ver meu App',
    'admin.config.fill_all': 'Preencha todos os campos',
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
    'book.combo': '¡Combo Master Activado! (Cabello + Barba + Cejas) - 10% DESC',
    'book.pix': 'Transferencia Inmediata',
    'book.card': 'Tarjeta de Débito/Crédito',
    'book.alias': 'Alias (Transferencia)',
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
    'landing.title': 'BarberFlow SaaS',
    'landing.subtitle': 'Transforma tu barbería con el sistema de citas más completo y personalizado.',
    'landing.demo': 'Ver Demostración',
    'landing.admin': 'Panel del Barbero',
    'landing.why': '¿Por qué elegir BarberFlow?',
    'landing.feature1.title': 'Sistema Multi-Tenant',
    'landing.feature1.desc': 'Enlace exclusivo para tu barbería (ej: app.com/tu-marca) sin competencia.',
    'landing.feature2.title': 'Personalización de Colores',
    'landing.feature2.desc': 'Deja la aplicación del cliente con los colores y el logotipo exactos de tu empresa.',
    'landing.feature3.title': 'Doble Moneda y Pagos',
    'landing.feature3.desc': 'Soporte automático para Real (R$) y Guaraní (GS), además de transferencias y tarjeta.',
    'landing.feature4.title': 'Avisos Automáticos',
    'landing.feature4.desc': 'Notificaciones y recordatorios para los clientes vía WhatsApp, SMS y Email.',
    'landing.feature5.title': 'Agenda Inteligente',
    'landing.feature5.desc': 'Gestión completa con la posibilidad de bloquear y liberar horarios de forma masiva.',
    'landing.feature6.title': 'Experiencia App Nativa',
    'landing.feature6.desc': 'Rápida, fluida y sin necesidad de descargar nada en la tienda de aplicaciones.',
    'landing.footer': '© 2026 BarberFlow Pro. Sistema SaaS Multi-Tenant.',
    'admin.welcome': 'Bienvenido al Panel',
    'admin.login': 'Entrar al Panel',
    'admin.email': 'Correo electrónico',
    'admin.password': 'Contraseña',
    'admin.noAccount': '¿Aún no tienes cuenta?',
    'admin.register': 'Registra tu barbería',
    'admin.dashboard.title': 'Hola, {name}',
    'admin.dashboard.pending': 'Tienes {count} citas pendientes',
    'admin.dashboard.waiting': 'Esperando Confirmación',
    'admin.dashboard.upcoming': 'Próximas Citas',
    'admin.dashboard.empty': 'Ninguna cita confirmada aún.',
    'admin.dashboard.accept': 'Aceptar',
    'admin.dashboard.reject': 'Rechazar',
    'admin.dashboard.cancel': 'Cancelar Cita',
    'admin.dashboard.cancel_confirm': '¿Realmente desea cancelar esta cita?',
    'admin.dashboard.pending_badge': 'Pendiente',
    'admin.dashboard.confirmed_badge': 'Confirmado',
    'admin.agenda.title': 'Agenda del Día',
    'admin.agenda.time': 'Hora',
    'admin.agenda.free': 'Libre',
    'admin.agenda.confirmed': 'Confirmado',
    'admin.config.identity': 'Identidad de tu Marca',
    'admin.config.location': 'Ubicación de la Barbería',
    'admin.config.services': 'Tus Servicios',
    'admin.config.barbers': 'Tus Barberos',
    'admin.config.payments': 'Métodos de Pago',
    'admin.config.payments_desc': 'Selecciona qué formas de pago acepta tu barbería.',
    'admin.config.colors': 'Colores de la App',
    'admin.config.colors_desc': 'Selecciona el color principal de tu barbería para personalizar la aplicación.',
    'admin.config.ready': '¡Todo Listo!',
    'admin.config.save': 'Guardar Cambios',
    'admin.config.next': 'Siguiente',
    'admin.config.back': 'Volver',
    'admin.config.viewApp': 'Ver mi App',
    'admin.config.fill_all': 'Llena todos los campos',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string, params?: Record<string, string | number>) => {
    let translation = TRANSLATIONS[language][key as keyof typeof TRANSLATIONS['pt']] || key;
    
    if (params && typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        const value = params[param] !== undefined ? String(params[param]) : '';
        translation = translation.replace(`{${param}}`, value);
      });
    }
    
    return translation;
  };

  const currency = language === 'pt' ? 'R$' : 'GS';

  const formatPrice = (ptPrice: number = 0, esPrice: number = 0) => {
    const pt = ptPrice || 0;
    const es = esPrice || 0;
    
    if (language === 'pt') {
      return `R$ ${pt.toFixed(2).replace('.', ',')}`;
    } else {
      // Formata guaraníes com separador de milhar (ponto)
      return `${Math.floor(es).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} GS`;
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
