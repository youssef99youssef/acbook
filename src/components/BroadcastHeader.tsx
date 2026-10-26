import React, { useState, useEffect } from 'react';
import { Radio, Users, Volume2, VolumeX, Sparkles, Video, Eye, ShieldCheck, Flame } from 'lucide-react';

interface BroadcastHeaderProps {
  viewerCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenVideoAnimator: () => void;
  activeVideoUrl?: string | null;
}

export const BroadcastHeader: React.FC<BroadcastHeaderProps> = ({
  viewerCount,
  isMuted,
  onToggleMute,
  onOpenVideoAnimator,
  activeVideoUrl
}) => {
  const [streamSeconds, setStreamSeconds] = useState(9920); // starts at ~2h 45m

  useEffect(() => {
    const timer = setInterval(() => {
      setStreamSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <header className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-40 px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Streamer Info & Live Badge */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400">
              <img
                src="/assets/aistudio/Gemini_Generated_Image_qmzo6yqmzo6yqmzo_44cc4a19.jpg"
                alt="الكابتن ريان"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-zinc-900 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-base sm:text-lg flex items-center gap-1.5">
                الكابتن ريان <span className="text-purple-400 text-xs font-mono">@Rayan_Live</span>
              </h1>
              <ShieldCheck className="w-4 h-4 text-blue-400 fill-blue-400/20" />
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-red-600 text-white animate-stream-pulse">
                <Radio className="w-3 h-3 animate-spin" />
                مباشر
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
              <span className="text-zinc-300 font-medium hidden sm:inline">ألعاب وردود أفعال وسوالف 🔥</span>
              <span className="font-mono text-zinc-400 flex items-center gap-1">
                ⏱️ {formatTime(streamSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Live Metrics & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Viewers count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-red-400" />
            <span className="font-mono text-white text-sm">{viewerCount.toLocaleString('ar-EG')}</span>
            <span className="text-zinc-400 text-[11px] hidden xs:inline">مشاهد</span>
          </div>

          {/* Active video indicator if user generated video */}
          {activeVideoUrl && (
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              <span>فيديو AI نشط</span>
            </div>
          )}

          {/* Animate to Video Button (Feature CTA) */}
          <button
            onClick={onOpenVideoAnimator}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95"
            title="تحريك صورة الستريمر إلى فيديو بالذكاء الاصطناعي بواسطة gemini-omni-1.1-flash"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">تحريك صورة الستريمر لفيديو</span>
            <span className="sm:hidden">تحريك لفيديو</span>
            <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-white/20 rounded">Omni Flash</span>
          </button>

          {/* Mute / Unmute FX */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg border text-sm transition-colors ${
              isMuted
                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700'
            }`}
            title={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
