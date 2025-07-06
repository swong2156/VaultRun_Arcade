export type Language = "en" | "es" | "fr" | "ar" | "de" | "tr" | "pt" | "zh";

export const languages: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  ar: "العربية",
  de: "Deutsch",
  tr: "Türkçe",
  pt: "Português",
  zh: "中文",
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    loading: "Loading...",
    connect_wallet: "Connect Wallet",
    disconnect_wallet: "Disconnect Wallet",
    balance: "Balance",
    play: "Play",
    win: "Win",
    loss: "Loss",
    stake: "Stake",

    // Navigation
    home: "Home",
    arcade: "Arcade",
    dashboard: "Dashboard",
    referrals: "Referrals",
    history: "History",
    settings: "Settings",
    faq: "FAQ",

    // Games
    flip_game: "Flip Game",
    crash_game: "Crash",
    dice_roll: "Dice Roll",
    prediction_market: "Prediction",

    // Messages
    you_won: "🎉 You won!",
    you_lost: "💔 You lost!",
    insufficient_balance: "💰 Insufficient balance!",
    transaction_pending: "🪙 Transaction pending...",
    transaction_confirmed: "💎 Transaction confirmed!",
    transaction_failed: "❌ Transaction failed",

    // Referrals
    invite_friends: "Invite Friends",
    referral_link: "Referral Link",
    referred_users: "Referred Users",
    commission_earned: "Commission Earned",
    share_link: "Share Link",

    // Settings
    settings: "Settings",
    manage_preferences: "Manage your account and preferences",
    account_information: "Account Information",
    game_preferences: "Game Preferences",
    display_interface: "Display & Interface",
    security_privacy: "Security & Privacy",
    sound_effects: "Sound Effects",
    haptic_feedback: "Haptic Feedback",
    notifications: "Notifications",
    theme: "Theme",
    language: "Language",
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",

    // Settings actions
    sound_enabled: "Sound enabled",
    sound_disabled: "Sound disabled",
    dark_mode_enabled: "Dark mode enabled",
    light_mode_enabled: "Light mode enabled",
    notifications_enabled: "Notifications enabled",
    notifications_disabled: "Notifications disabled",
    haptic_enabled: "Haptic feedback enabled",
    haptic_disabled: "Haptic feedback disabled",
    language_updated: "Language updated",
    wallet_disconnected: "Wallet disconnected",
    disconnect_failed: "Failed to disconnect wallet",

    // User interface
    play_sounds_during_games: "Play sounds during games",
    get_notified_about_games: "Get notified about wins and losses",
    vibrate_on_game_actions: "Vibrate on game actions",
    use_dark_theme_for_gaming: "Use dark theme for better gaming experience",
    choose_your_language: "Choose your preferred language",

    // Status terms
    platform: "Platform",
    username: "Username",
    user_id: "User ID",
    wallet_status: "Wallet Status",
    address: "Address",
    connected: "Connected",
    address_copied: "Address copied!",
    no_wallet_connected: "No wallet connected",

    // Stats
    total_games: "Total Games",
    wins: "Wins",
    win_rate: "Win Rate",
    total_staked: "Total Staked",

    // Security
    privacy_notice: "Privacy Notice",
    data_usage: "Data Usage",
    security_features: "Security Features",
    privacy_notice_text:
      "VaultRun connects securely using WalletConnect. We never request your private keys, seed phrase, or PIN. All wallet transactions are signed inside your connected wallet.",
    data_usage_text:
      "We store your game history and preferences with Supabase backend. Your personal data is encrypted and secure.",
    wallet_connect_security: "WalletConnect v2 secure protocol",
    no_private_key_storage: "No private keys stored locally",
    user_controlled_transactions: "User-controlled transaction signing",
    encrypted_data_storage: "Encrypted data storage and transmission",
  },

  es: {
    // Common
    loading: "Cargando...",
    connect_wallet: "Conectar Billetera",
    disconnect_wallet: "Desconectar Billetera",
    balance: "Saldo",
    play: "Jugar",
    win: "Ganar",
    loss: "Pérdida",
    stake: "Apostar",

    // Navigation
    home: "Inicio",
    arcade: "Arcade",
    dashboard: "Panel",
    referrals: "Referencias",
    history: "Historial",
    settings: "Configuración",
    faq: "Preguntas",

    // Games
    flip_game: "Juego de Moneda",
    crash_game: "Crash",
    dice_roll: "Dados",
    prediction_market: "Predicción",

    // Messages
    you_won: "🎉 ¡Ganaste!",
    you_lost: "💔 ¡Perdiste!",
    insufficient_balance: "💰 ¡Saldo insuficiente!",
    transaction_pending: "🪙 Transacción pendiente...",
    transaction_confirmed: "💎 ¡Transacción confirmada!",
    transaction_failed: "❌ Transacción fallida",

    // Referrals
    invite_friends: "Invitar Amigos",
    referral_link: "Enlace de Referencia",
    referred_users: "Usuarios Referidos",
    commission_earned: "Comisión Ganada",
    share_link: "Compartir Enlace",

    // Settings
    settings: "Configuración",
    manage_preferences: "Gestiona tu cuenta y preferencias",
    account_information: "Información de la Cuenta",
    game_preferences: "Preferencias del Juego",
    display_interface: "Pantalla e Interfaz",
    security_privacy: "Seguridad y Privacidad",
    sound_effects: "Efectos de Sonido",
    haptic_feedback: "Retroalimentación Háptica",
    notifications: "Notificaciones",
    theme: "Tema",
    language: "Idioma",
    dark_mode: "Modo Oscuro",
    light_mode: "Modo Claro",

    // Settings actions
    sound_enabled: "Sonido activado",
    sound_disabled: "Sonido desactivado",
    dark_mode_enabled: "Modo oscuro activado",
    light_mode_enabled: "Modo claro activado",
    notifications_enabled: "Notificaciones activadas",
    notifications_disabled: "Notificaciones desactivadas",
    haptic_enabled: "Retroalimentación háptica activada",
    haptic_disabled: "Retroalimentación háptica desactivada",
    language_updated: "Idioma actualizado",
    wallet_disconnected: "Billetera desconectada",
    disconnect_failed: "Error al desconectar billetera",

    // User interface
    play_sounds_during_games: "Reproducir sonidos durante los juegos",
    get_notified_about_games:
      "Recibir notificaciones sobre victorias y derrotas",
    vibrate_on_game_actions: "Vibrar en acciones del juego",
    use_dark_theme_for_gaming:
      "Usar tema oscuro para mejor experiencia de juego",
    choose_your_language: "Elige tu idioma preferido",

    // Status terms
    platform: "Plataforma",
    username: "Nombre de Usuario",
    user_id: "ID de Usuario",
    wallet_status: "Estado de Billetera",
    address: "Dirección",
    connected: "Conectado",
    address_copied: "¡Dirección copiada!",
    no_wallet_connected: "No hay billetera conectada",

    // Stats
    total_games: "Juegos Totales",
    wins: "Victorias",
    win_rate: "Tasa de Victoria",
    total_staked: "Total Apostado",

    // Security
    privacy_notice: "Aviso de Privacidad",
    data_usage: "Uso de Datos",
    security_features: "Características de Seguridad",
    privacy_notice_text:
      "VaultRun se conecta de forma segura usando WalletConnect. Nunca solicitamos tus claves privadas, frase semilla o PIN. Todas las transacciones se firman desde tu billetera conectada.",
    data_usage_text:
      "Almacenamos tu historial de juegos y preferencias con backend Supabase. Tus datos personales están encriptados y seguros.",
    wallet_connect_security: "Protocolo seguro WalletConnect v2",
    no_private_key_storage: "No se almacenan claves privadas localmente",
    user_controlled_transactions:
      "Firma de transacciones controlada por el usuario",
    encrypted_data_storage: "Almacenamiento y transmisión de datos encriptados",
  },

  fr: {
    // Common
    loading: "Chargement...",
    connect_wallet: "Connecter Portefeuille",
    disconnect_wallet: "Déconnecter Portefeuille",
    balance: "Solde",
    play: "Jouer",
    win: "Gagner",
    loss: "Perte",
    stake: "Mise",

    // Navigation
    home: "Accueil",
    arcade: "Arcade",
    dashboard: "Tableau de Bord",
    referrals: "Parrainages",
    history: "Historique",
    settings: "Paramètres",
    faq: "FAQ",

    // Games
    flip_game: "Jeu de Pile ou Face",
    crash_game: "Crash",
    dice_roll: "Dés",
    prediction_market: "Prédiction",

    // Messages
    you_won: "🎉 Vous avez gagné!",
    you_lost: "💔 Vous avez perdu!",
    insufficient_balance: "💰 Solde insuffisant!",
    transaction_pending: "🪙 Transaction en attente...",
    transaction_confirmed: "💎 Transaction confirmée!",
    transaction_failed: "❌ Transaction échouée",

    // Referrals
    invite_friends: "Inviter des Amis",
    referral_link: "Lien de Parrainage",
    referred_users: "Utilisateurs Parrainés",
    commission_earned: "Commission Gagnée",
    share_link: "Partager le Lien",

    // Settings
    sound_effects: "Effets Sonores",
    haptic_feedback: "Retour Haptique",
    notifications: "Notifications",
    theme: "Thème",
    language: "Langue",
    dark_mode: "Mode Sombre",
    light_mode: "Mode Clair",
  },

  ar: {
    // Common
    loading: "جاري التحميل...",
    connect_wallet: "ربط المحفظة",
    disconnect_wallet: "قطع اتصال المحفظة",
    balance: "الرصيد",
    play: "العب",
    win: "فوز",
    loss: "خسارة",
    stake: "رهان",

    // Navigation
    home: "الرئيسية",
    arcade: "الألعاب",
    dashboard: "لوحة التحكم",
    referrals: "الإحالات",
    history: "التاريخ",
    settings: "الإعدادات",
    faq: "الأسئلة الشائعة",

    // Games
    flip_game: "لعبة القلب",
    crash_game: "كراش",
    dice_roll: "النرد",
    prediction_market: "التنبؤ",

    // Messages
    you_won: "🎉 لقد فزت!",
    you_lost: "💔 لقد خسرت!",
    insufficient_balance: "💰 رصيد غير كافي!",
    transaction_pending: "🪙 المعاملة قيد الانتظار...",
    transaction_confirmed: "💎 تم تأكيد المعاملة!",
    transaction_failed: "❌ فشلت المعاملة",

    // Referrals
    invite_friends: "دعوة الأصدقاء",
    referral_link: "رابط الإحالة",
    referred_users: "المستخدمون المُحالون",
    commission_earned: "العمولة المكتسبة",
    share_link: "مشاركة الرابط",

    // Settings
    sound_effects: "المؤثرات الصوتية",
    haptic_feedback: "التفاعل اللمسي",
    notifications: "الإشعارات",
    theme: "السمة",
    language: "اللغة",
    dark_mode: "الوضع المظلم",
    light_mode: "الوضع المضيء",
  },

  de: {
    // Common
    loading: "Laden...",
    connect_wallet: "Wallet Verbinden",
    disconnect_wallet: "Wallet Trennen",
    balance: "Guthaben",
    play: "Spielen",
    win: "Gewinn",
    loss: "Verlust",
    stake: "Einsatz",

    // Navigation
    home: "Startseite",
    arcade: "Spielhalle",
    dashboard: "Dashboard",
    referrals: "Empfehlungen",
    history: "Verlauf",
    settings: "Einstellungen",
    faq: "FAQ",

    // Games
    flip_game: "Münzwurf",
    crash_game: "Crash",
    dice_roll: "Würfel",
    prediction_market: "Vorhersage",

    // Messages
    you_won: "🎉 Du hast gewonnen!",
    you_lost: "💔 Du hast verloren!",
    insufficient_balance: "💰 Unzureichendes Guthaben!",
    transaction_pending: "🪙 Transaktion ausstehend...",
    transaction_confirmed: "💎 Transaktion bestätigt!",
    transaction_failed: "❌ Transaktion fehlgeschlagen",

    // Referrals
    invite_friends: "Freunde Einladen",
    referral_link: "Empfehlungslink",
    referred_users: "Empfohlene Benutzer",
    commission_earned: "Verdiente Provision",
    share_link: "Link Teilen",

    // Settings
    sound_effects: "Soundeffekte",
    haptic_feedback: "Haptisches Feedback",
    notifications: "Benachrichtigungen",
    theme: "Design",
    language: "Sprache",
    dark_mode: "Dunkler Modus",
    light_mode: "Heller Modus",
  },

  tr: {
    // Common
    loading: "Yükleniyor...",
    connect_wallet: "Cüzdan Bağla",
    disconnect_wallet: "Cüzdan Bağlantısını Kes",
    balance: "Bakiye",
    play: "Oyna",
    win: "Kazanç",
    loss: "Kayıp",
    stake: "Bahis",

    // Navigation
    home: "Ana Sayfa",
    arcade: "Oyun Salonu",
    dashboard: "Kontrol Paneli",
    referrals: "Referanslar",
    history: "Geçmiş",
    settings: "Ayarlar",
    faq: "SSS",

    // Games
    flip_game: "Yazı Tura",
    crash_game: "Crash",
    dice_roll: "Zar",
    prediction_market: "Tahmin",

    // Messages
    you_won: "🎉 Kazandın!",
    you_lost: "💔 Kaybettin!",
    insufficient_balance: "💰 Yetersiz bakiye!",
    transaction_pending: "🪙 İşlem beklemede...",
    transaction_confirmed: "💎 İşlem onaylandı!",
    transaction_failed: "❌ İşlem başarısız",

    // Referrals
    invite_friends: "Arkadaş Davet Et",
    referral_link: "Referans Linki",
    referred_users: "Davet Edilen Kullanıcılar",
    commission_earned: "Kazanılan Komisyon",
    share_link: "Link Paylaş",

    // Settings
    sound_effects: "Ses Efektleri",
    haptic_feedback: "Dokunsal Geri Bildirim",
    notifications: "Bildirimler",
    theme: "Tema",
    language: "Dil",
    dark_mode: "Karanlık Mod",
    light_mode: "Aydınlık Mod",
  },

  pt: {
    // Common
    loading: "Carregando...",
    connect_wallet: "Conectar Carteira",
    disconnect_wallet: "Desconectar Carteira",
    balance: "Saldo",
    play: "Jogar",
    win: "Vitória",
    loss: "Perda",
    stake: "Aposta",

    // Navigation
    home: "Início",
    arcade: "Arcade",
    dashboard: "Painel",
    referrals: "Indicações",
    history: "Histórico",
    settings: "Configurações",
    faq: "FAQ",

    // Games
    flip_game: "Jogo da Moeda",
    crash_game: "Crash",
    dice_roll: "Dados",
    prediction_market: "Previsão",

    // Messages
    you_won: "🎉 Você ganhou!",
    you_lost: "💔 Você perdeu!",
    insufficient_balance: "💰 Saldo insuficiente!",
    transaction_pending: "🪙 Transação pendente...",
    transaction_confirmed: "💎 Transação confirmada!",
    transaction_failed: "❌ Transação falhou",

    // Referrals
    invite_friends: "Convidar Amigos",
    referral_link: "Link de Indicação",
    referred_users: "Usuários Indicados",
    commission_earned: "Comissão Ganha",
    share_link: "Compartilhar Link",

    // Settings
    sound_effects: "Efeitos Sonoros",
    haptic_feedback: "Feedback Tátil",
    notifications: "Notificações",
    theme: "Tema",
    language: "Idioma",
    dark_mode: "Modo Escuro",
    light_mode: "Modo Claro",
  },

  zh: {
    // Common
    loading: "加载中...",
    connect_wallet: "连接钱包",
    disconnect_wallet: "断开钱包",
    balance: "余额",
    play: "游戏",
    win: "赢",
    loss: "输",
    stake: "下注",

    // Navigation
    home: "首页",
    arcade: "游戏厅",
    dashboard: "仪表板",
    referrals: "推荐",
    history: "历史",
    settings: "设置",
    faq: "常见问题",

    // Games
    flip_game: "抛硬币",
    crash_game: "崩盘游戏",
    dice_roll: "掷骰子",
    prediction_market: "预测市场",

    // Messages
    you_won: "🎉 您赢了！",
    you_lost: "💔 您输了！",
    insufficient_balance: "💰 余额不足！",
    transaction_pending: "🪙 交易处理中...",
    transaction_confirmed: "💎 交易已确认！",
    transaction_failed: "❌ 交易失败",

    // Referrals
    invite_friends: "邀请朋友",
    referral_link: "推荐链接",
    referred_users: "推荐用户",
    commission_earned: "获得佣金",
    share_link: "分享链接",

    // Settings
    settings: "设置",
    manage_preferences: "管理您的账户和偏好",
    account_information: "账户信息",
    game_preferences: "游戏偏好",
    display_interface: "显示和界面",
    security_privacy: "安全和隐私",
    sound_effects: "音效",
    haptic_feedback: "触觉反馈",
    notifications: "通知",
    theme: "主题",
    language: "语言",
    dark_mode: "深色模式",
    light_mode: "浅色模式",
  },
};

export const getTranslation = (
  key: string,
  language: Language = "en",
): string => {
  return translations[language]?.[key] || translations.en[key] || key;
};

export const formatCurrency = (
  amount: number,
  currency: string,
  language: Language = "en",
): string => {
  const formatters: Record<Language, Intl.NumberFormat> = {
    en: new Intl.NumberFormat("en-US"),
    es: new Intl.NumberFormat("es-ES"),
    fr: new Intl.NumberFormat("fr-FR"),
    ar: new Intl.NumberFormat("ar-SA"),
    de: new Intl.NumberFormat("de-DE"),
    tr: new Intl.NumberFormat("tr-TR"),
    pt: new Intl.NumberFormat("pt-BR"),
    zh: new Intl.NumberFormat("zh-CN"),
  };

  const formatter = formatters[language] || formatters.en;

  switch (currency) {
    case "BTC":
      return `₿ ${formatter.format(amount)}`;
    case "ETH":
      return `Ξ ${formatter.format(amount)}`;
    case "USDT":
      return `₮ ${formatter.format(amount)}`;
    case "MATIC":
      return `⟡ ${formatter.format(amount)}`;
    case "BNB":
      return `⬨ ${formatter.format(amount)}`;
    case "DOGE":
      return `Ð ${formatter.format(amount)}`;
    case "ADA":
      return `₳ ${formatter.format(amount)}`;
    case "SOL":
      return `◎ ${formatter.format(amount)}`;
    default:
      return `${currency} ${formatter.format(amount)}`;
  }
};
