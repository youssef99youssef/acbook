export type EmotionType = 'hype' | 'laugh' | 'shocked' | 'chill' | 'rage' | 'celebrate' | 'thinking';

export type SoundEffectType = 'cheer' | 'airhorn' | 'applause' | 'fail' | 'donation' | 'level_up' | 'none';

export interface ChatMessage {
  id: string;
  sender: string;
  avatarColor: string;
  badge?: 'mod' | 'sub' | 'vip' | 'founder' | 'donor';
  subMonths?: number;
  message: string;
  isSuperChat?: boolean;
  donationAmount?: number;
  timestamp: string;
}

export interface StreamerReaction {
  reply: string;
  emotion: EmotionType;
  soundEffect: SoundEffectType;
  actionBadge: string;
  bannerText?: string;
  audioUrl?: string | null;
}

export interface StreamEvent {
  id: string;
  title: string;
  description: string;
  category: 'gaming' | 'news' | 'hype' | 'funny' | 'tech';
  icon: string;
  intensity: 'medium' | 'high' | 'epic';
}

export interface VideoAnimationJob {
  status: 'idle' | 'generating' | 'success' | 'error';
  videoUrl?: string;
  aspectRatio: '16:9' | '9:16';
  prompt: string;
  error?: string;
}
