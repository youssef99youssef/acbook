import React from 'react';
import { Volume2, VolumeX, Sparkles, Flame, DollarSign, Trophy, AlertOctagon } from 'lucide-react';
import { soundboard } from '../utils/soundEffects';

interface SoundboardBarProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SoundboardBar: React.FC<SoundboardBarProps> = ({
  isMuted,
  onToggleMute
}) => {
  const triggerSound = (name: string) => {
    soundboard.play(name);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-purple-400" />
          مؤثرات الستريمر الصوتية (Soundboard):
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => triggerSound('airhorn')}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-bold text-amber-300 border border-zinc-700/80 transition-all flex items-center gap-1"
        >
          <span>📢</span> بوق الحماس (Airhorn)
        </button>

        <button
          onClick={() => triggerSound('donation')}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-bold text-emerald-300 border border-zinc-700/80 transition-all flex items-center gap-1"
        >
          <span>💰</span> رنة التبرع (Donation)
        </button>

        <button
          onClick={() => triggerSound('applause')}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-bold text-pink-300 border border-zinc-700/80 transition-all flex items-center gap-1"
        >
          <span>👏</span> تصفيق وهتاف الجمهور
        </button>

        <button
          onClick={() => triggerSound('level_up')}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-bold text-cyan-300 border border-zinc-700/80 transition-all flex items-center gap-1"
        >
          <span>⚡</span> ليفل أب (Level Up)
        </button>

        <button
          onClick={() => triggerSound('fail')}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-bold text-rose-300 border border-zinc-700/80 transition-all flex items-center gap-1"
        >
          <span>🎺</span> عزف الفشل (Sad Trombone)
        </button>

        <button
          onClick={() => triggerSound('shock')}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-bold text-purple-300 border border-zinc-700/80 transition-all flex items-center gap-1"
        >
          <span>💥</span> صدمة درامية (Bass Drop)
        </button>
      </div>
    </div>
  );
};
