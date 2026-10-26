import { ChatMessage, StreamEvent } from '../types/streamer';

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'Sultan_Gamer',
    avatarColor: '#3b82f6',
    badge: 'vip',
    subMonths: 14,
    message: 'مساء الخير يا كابتن ريان! جاهز لبث اليوم 🔥🔥🔥',
    timestamp: '16:40'
  },
  {
    id: 'msg-2',
    sender: 'فهد_العتيبي',
    avatarColor: '#10b981',
    badge: 'sub',
    subMonths: 6,
    message: 'والله اللقطة اللي سويتها في البث الماضي كانت تاريخية 😂👏',
    timestamp: '16:41'
  },
  {
    id: 'msg-3',
    sender: 'Legend_Noor',
    avatarColor: '#ec4899',
    badge: 'mod',
    subMonths: 24,
    message: 'يا شباب لا تنسون اللايك والشير وخلونا نوصل 20 ألف لايك اليوم! 🚀',
    timestamp: '16:41'
  },
  {
    id: 'msg-4',
    sender: 'Omar_KSA',
    avatarColor: '#f59e0b',
    badge: 'donor',
    subMonths: 3,
    isSuperChat: true,
    donationAmount: 25,
    message: 'أحلى تحية للكابتن ريان ملك الستريمرز! استمر يا بطل ❤️',
    timestamp: '16:42'
  },
  {
    id: 'msg-5',
    sender: 'GamingGhost',
    avatarColor: '#8b5cf6',
    badge: 'sub',
    subMonths: 9,
    message: 'ايش رأيك في الأخبار الجديدة اللي نزلت اليوم عن ألعاب 2026؟',
    timestamp: '16:42'
  },
  {
    id: 'msg-6',
    sender: 'ريم_الغامدي',
    avatarColor: '#06b6d4',
    badge: 'sub',
    subMonths: 4,
    message: 'كابتن ريان لا تنسى تسوي ردة فعل على الكليب اللي انتشر بالتيك توك! 🤣',
    timestamp: '16:43'
  }
];

export const PRESET_EVENTS: StreamEvent[] = [
  {
    id: 'event-gta',
    title: 'عرض الإعلان الرسمي لـ GTA VI مع ميزات جديدة كلياً',
    description: 'تسريب وعرض رسمي مبهر للعبة GTA VI يظهر خريطة غير مسبوقة ونظام فيزيائي خارق!',
    category: 'gaming',
    icon: 'Gamepad2',
    intensity: 'epic'
  },
  {
    id: 'event-clutch',
    title: 'كلتش مستحيل 1 ضد 5 في نهائي بطولة الرياض للإيسبورتس',
    description: 'لاعب عربي يحقق معجزة ويفوز بالجولة الأخيرة برصاصة واحدة في آخر ثانية!',
    category: 'hype',
    icon: 'Trophy',
    intensity: 'high'
  },
  {
    id: 'event-huge-donation',
    title: 'سوبر شات أسطوري بقيمة $500 من مجهول مع رسالة تحدي',
    description: 'متبرع مجهول يتحدى الستريمر بإنهاء أصعب مرحلة بدون أن يموت شخصيته!',
    category: 'hype',
    icon: 'DollarSign',
    intensity: 'epic'
  },
  {
    id: 'event-cat-mic',
    title: 'موقف طريف: قطة الستريمر تهاجم المايك وتسقط الكاميرا',
    description: 'القطة تقفز فجأة على ذراع المايكروفون المعلق وتلعب بالأسلاك على البث المباشر!',
    category: 'funny',
    icon: 'Sparkles',
    intensity: 'medium'
  },
  {
    id: 'event-raid-10k',
    title: 'رايد ضخم من أسطورة البث مع 12,000 مشاهد جديد!',
    description: 'جيش المتابعين يقتحم الشات بوابل من القلوب والسبام HYYYPE!',
    category: 'hype',
    icon: 'Users',
    intensity: 'epic'
  },
  {
    id: 'event-net-lag',
    title: 'انقطاع مفاجئ بالنت والبنغ يرتفع إلى 999ms والشات يصيح لاق!',
    description: 'الشاشة تتجمد والشخصية تركض في الجدار في منتصف المعركة الحاسمة!',
    category: 'tech',
    icon: 'WifiOff',
    intensity: 'high'
  }
];

export const SIMULATED_CHATTERS = [
  { name: 'Hamad_Pro', badge: 'sub', color: '#10b981' },
  { name: 'Sara_Stream', badge: 'vip', color: '#ec4899' },
  { name: 'Zaid_Apex', badge: 'mod', color: '#3b82f6' },
  { name: 'Al_Amir', badge: 'donor', color: '#f59e0b' },
  { name: 'GamerGirl99', badge: 'sub', color: '#8b5cf6' },
  { name: 'Tareq_Sniper', badge: 'sub', color: '#ef4444' },
  { name: 'KSA_Legend', badge: 'founder', color: '#14b8a6' },
  { name: 'Majed_VR', badge: 'sub', color: '#06b6d4' }
];

export const RANDOM_CHAT_LINES = [
  'هههههههههه مش معقول والله! 😂🔥',
  'كابتن ريان اسطورة البث بلا منازع 👑',
  'GG WP يا وحوش!',
  'شفتوا الحركة اللي سواها؟! يا ساتر 😱',
  'اكتبوا 1111 في الشات يا شباب!',
  'ولكم بكل الأساطير الجدد اللي دخلوا البث!',
  'وش هاللعب الخرافي يا ريان! 😍',
  'الصوت والصورة 100% فل HD ✨',
  'نو وايييي مستحيل تصير صدق! 🤯',
  'أطلق ستريم في المجرة 🌌🚀'
];
