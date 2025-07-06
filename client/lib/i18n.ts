export type Language = "en" | "es" | "fr" | "ar" | "de" | "tr" | "pt";

export const languages: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  ar: "العربية",
  de: "Deutsch",
  tr: "Türkçe",
  pt: "Português",
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
    sound_effects: "Sound Effects",
    haptic_feedback: "Haptic Feedback",
    notifications: "Notifications",
    theme: "Theme",
    language: "Language",
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",
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
    sound_effects: "Efectos de Sonido",
    haptic_feedback: "Retroalimentación Háptica",
    notifications: "Notificaciones",
    theme: "Tema",
    language: "Idioma",
    dark_mode: "Modo Oscuro",
    light_mode: "Modo Claro",
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
    default:
      return `${currency} ${formatter.format(amount)}`;
  }
};
