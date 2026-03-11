# BarberFlow SaaS - Project Context

Este documento serve como a fonte da verdade para a arquitetura, estrutura e regras de negócio do BarberFlow, um sistema SaaS Multi-Tenant para barbearias construído com Expo (React Native).

## 🚀 Tech Stack Principal
- **Framework:** Expo / React Native (Foco em Web/Mobile First)
- **Roteamento:** Expo Router (File-based routing)
- **Animações & UI:** `react-native-reanimated` (UI/UX Pro Max)
- **Armazenamento:** `@react-native-async-storage/async-storage` (Persistência local temporária/mock)
- **Ícones:** `lucide-react-native`
- **Mídia:** `expo-image-picker` (Imagens convertidas em Base64 para armazenamento)

## 📁 Estrutura de Diretórios (`app/`)
O projeto utiliza um roteamento baseado no file-system do Expo Router, rigidamente dividido em duas áreas principais após a seleção global de idioma e fluxos de autenticação.

- `app/index.tsx`: **Raiz Absoluta**. A primeira tela do app. Redireciona para `/landing`.
- `app/landing.tsx`: Landing page comercial do SaaS. Contém botões para acessar a "Área Admin" ou "Ver Demonstração" (Área do Cliente).
- `app/admin/`: **Área Administrativa (O Painel do Barbeiro)**
  - `_layout.tsx`: Define o Stack protegido do Admin.
  - `login.tsx`: Tela de autenticação para donos/barbeiros.
  - `register.tsx`: Tela de criação de conta (BarberFlow Pro).
  - `forgot-password.tsx`: Tela de recuperação de senha.
  - `dashboard.tsx`: Visão geral de agendamentos pendentes e confirmados. Permite aceitar, recusar ou cancelar.
  - `agenda.tsx`: Tabela visual (Daily Schedule) mostrando os horários de todos os barbeiros e seus status (Livre, Pendente, Confirmado).
  - `config.tsx`: **Wizard de 6 Passos** para configurar a barbearia (Identidade, Localização, Serviços, Barbeiros, Formas de Pagamento, Link Final).
- `app/[slug]/`: **Área do Cliente (Multi-Tenant)**
  - `_layout.tsx`: Provedor de contexto específico do tenant (barbearia).
  - `index.tsx`: Tela inicial de redirecionamento do tenant para o fluxo de idioma/auth.
  - `(auth)/`: **Autenticação e Pré-requisitos do Cliente**
    - `language-selection.tsx`: O cliente escolhe o idioma (PT/ES) e a moeda (R$/GS) que prefere ser atendido.
    - `login.tsx`: Tela de login do cliente. Redireciona para o agendamento após sucesso.
    - `register.tsx`: Tela de cadastro do cliente.
    - `forgot-password.tsx`: Tela de recuperação de senha.
  - `(tabs)/`: **Área Interna do Cliente**
    - `_layout.tsx`: Tab bar com as opções principais.
    - `agendar.tsx`: O core do lado do cliente. Fluxo de 3 passos: Escolher Serviço/Barbeiro -> Escolher Data/Hora -> Pagamento & Confirmação.
    - `profile.tsx`: Perfil do cliente com histórico.

## 🧠 Gerenciamento de Estado (Contextos)

### 1. `BarbeariaContext.tsx`
O "banco de dados" do sistema. Gerencia os dados da barbearia atual (Tenant).
- **Resiliência do Slug:** Se o usuário acessa um `slug` e ele bate com o do AsyncStorage, os dados carregam. No admin, não há exigência de slug.
- **Estruturas Principais:**
  - `services`: Contém nomes e preços bilíngues (`nomePt`, `nomeEs`, `precoPt`, `precoEs`).
  - `barbers`: Lista de profissionais (`nome`, `foto` em base64).
  - `paymentMethods`: Array de strings (ex: `['pix', 'card', 'money', 'alias']`).
  - `appointments`: Lista de agendamentos com `status` (`pending`, `accepted`, `rejected`).

### 2. `LanguageContext.tsx`
Coração do sistema i18n e regras de moeda.
- **Tradução:** A função `t(key)` é robusta contra chaves não encontradas ou parâmetros `undefined`.
- **Preços (`formatPrice`):** Recebe dois valores e formata com base no idioma atual:
  - Se Português: Exibe `precoPt` formatado como Real (`R$ 50,00`).
  - Se Espanhol: Exibe `precoEs` formatado como Guarani, arredondado e com ponto separador de milhar (`70.000 GS`).

## ⚖️ Regras de Negócio Críticas

1. **Separação Admin vs Cliente:**
   - Admin acessa via `/admin/login`. Visualiza todas as configurações e aprova agendamentos.
   - Cliente acessa via `/[slug]` (onde `[slug]` é o nome da barbearia, ex: `vintage-barber`), passa pela seleção de idioma e fluxo de autenticação (login/registro) em `/[slug]/(auth)` e então acessa a área logada em `/[slug]/(tabs)`.

2. **Fluxo de Agendamento:**
   - **Prevenção de Conflitos:** Na tela `agendar.tsx`, horários que já existem no array `appointments` com status diferente de `rejected` para aquele barbeiro específico, são desabilitados (linha riscada e opacidade baixa) para evitar double-booking.
   - **Status:** Quando o cliente finaliza, o agendamento entra como `pending`. O barbeiro no `dashboard.tsx` deve clicar em "Aceitar" para mudar para `accepted`. Se aceito, o barbeiro ainda tem a opção de "Cancelar" em caso de imprevisto.

3. **Lógica de Formas de Pagamento Dinâmicas:**
   - O admin no passo 5 do `config.tsx` marca os métodos que aceita (`pix`, `card`, `money`, `alias`).
   - Quando o cliente chega na etapa de pagamento (`agendar.tsx`), a lista sofre um filtro duplo:
     - **Regra PT-BR:** Se o cliente escolheu Português, o método `alias` é removido (pois é exclusivo do PY).
     - **Regra ES-PY:** Se o cliente escolheu Espanhol, o método `pix` é removido (pois é exclusivo do BR).

4. **Tratamento de Imagens:**
   - O upload de logos e avatares (via `expo-image-picker`) converte o binário para `Base64` antes de injetar no estado. Isso permite que a imagem persista no `AsyncStorage` localmente sem depender de URLs externas que podem expirar ou falhar sem um backend real.

## 🎨 Padrão de UI/UX (Pro Max)
Todas as telas seguem o manual do `react-native-design`.
- **Animações:** Uso massivo de `FadeInUp`, `FadeInDown`, e `FadeInRight` (`react-native-reanimated`) para entrada de listas (staggered animations) e montagem de tela.
- **Botões:** O componente `<Button />` é um `Animated.Pressable` com feedback tátil (`expo-haptics`) e efeito "spring" elástico no press.
- **Sombras:** O arquivo `theme.ts` expõe `SHADOWS` calibradas para iOS, Android e Web. Cards principais usam `SHADOWS.medium`. Elementos de destaque da marca (como a logo) utilizam o método customizado `SHADOWS.glow(color)` para um efeito neon sutil.
