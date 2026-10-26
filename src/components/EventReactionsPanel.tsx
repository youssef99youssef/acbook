import React, { useState } from 'react';
import {
  Flame,
  Radio,
  Gamepad2,
  Trophy,
  DollarSign,
  Sparkles,
  Users,
  WifiOff,
  Send,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { PRESET_EVENTS } from '../data/mockStreamData';
import { StreamEvent } from '../types/streamer';

interface EventReactionsPanelProps {
  onTriggerEventReaction: (eventTitle: string, eventDesc: string, category: string, intensity: string) => void;
  isProcessing: boolean;
}

export const EventReactionsPanel: React.FC<EventReactionsPanelProps> = ({
  onTriggerEventReaction,
  isProcessing
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customIntensity, setCustomIntensity] = useState<'high' | 'epic' | 'funny'>('high');
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-4 h-4 text-purple-400" />;
      case 'Trophy':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'DollarSign':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-pink-400" />;
      case 'Users':
        return <Users className="w-4 h-4 text-cyan-400" />;
      case 'WifiOff':
      default:
        return <WifiOff className="w-4 h-4 text-rose-400" />;
    }
  };

  const handleTriggerCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onTriggerEventReaction(
      customTitle.trim(),
      customDesc.trim() || customTitle.trim(),
      'custom',
      customIntensity
    );
    setCustomTitle('');
    setCustomDesc('');
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5">
              غرفة التحكم بردود الأفعال على الأحداث الجارية
            </h2>
            <p className="text-zinc-400 text-xs">
              اختر حدثاً جارياً أو اطرح حدثاً جديداً ليقدم الستريمر ردة فعل حية وصوتية أمام المتابعين!
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'presets'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            الأحداث الجاهزة ⚡
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            حدث مخصص أو خبر عاجل ✍️
          </button>
        </div>
      </div>

      {/* Presets Grid */}
      {activeTab === 'presets' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_EVENTS.map(event => (
            <button
              key={event.id}
              onClick={() => onTriggerEventReaction(event.title, event.description, event.category, event.intensity)}
              disabled={isProcessing}
              className="text-right p-3.5 rounded-xl bg-zinc-950/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-purple-500/50 transition-all duration-200 group flex flex-col justify-between disabled:opacity-50 text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {getEventIcon(event.icon)}
                    <span className="font-bold text-zinc-300 group-hover:text-purple-300 transition-colors">
                      {event.category === 'gaming' ? 'ألعاب' : event.category === 'hype' ? 'حماسي' : event.category === 'funny' ? 'موقف مضحك' : 'تقني'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    event.intensity === 'epic'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {event.intensity === 'epic' ? 'حدث ملحمي 🔥' : 'حدث قوي ⚡'}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs sm:text-sm mb-1 leading-snug">
                  {event.title}
                </h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2">
                  {event.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-purple-400 group-hover:text-purple-300 font-semibold text-[11px]">
                <span>فجّر ردة الفعل 💥</span>
                <span className="text-xs group-hover:translate-x-1 transition-transform">←</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Custom Event Creator */
        <form onSubmit={handleTriggerCustom} className="space-y-4 max-w-2xl bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
          <div>
            <label className="block text-xs font-bold text-zinc-200 mb-1">
              عنوان الحدث الجاري أو الخبر العاجل:
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder="مثال: تسريب موعد إطلاق لعبة جديدة، فوز فريقك المفضل في الدقيقة الأخيرة، ترند غريب..."
              required
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-200 mb-1">
              تفاصيل الحدث وسياقه (اختياري):
            </label>
            <textarea
              value={customDesc}
              onChange={e => setCustomDesc(e.target.value)}
              placeholder="اكتب ماذا حدث بالضبط ليتفاعل الستريمر معه بالتفصيل..."
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400 font-medium">نوع الانفعال:</span>
              <button
                type="button"
                onClick={() => setCustomIntensity('epic')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  customIntensity === 'epic'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                🔥 صدمة وحماس ملحمي
              </button>
              <button
                type="button"
                onClick={() => setCustomIntensity('funny')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  customIntensity === 'funny'
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                😂 ضحك ومزاح
              </button>
            </div>

            <button
              type="submit"
              disabled={!customTitle.trim() || isProcessing}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>إطلاق ردة الفعل المباشرة</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
