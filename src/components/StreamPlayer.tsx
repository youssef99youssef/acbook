import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Volume2,
  Tv,
  Gamepad2,
  Flame,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { EmotionType, StreamerReaction } from '../types/streamer';

interface StreamPlayerProps {
  isSpeaking: boolean;
  currentReaction: StreamerReaction | null;
  activeVideoUrl: string | null;
  onClearVideo: () => void;
  onOpenVideoAnimator: () => void;
  isProcessing: boolean;
}

export const StreamPlayer: React.FC<StreamPlayerProps> = ({
  isSpeaking,
  currentReaction,
  activeVideoUrl,
  onClearVideo,
  onOpenVideoAnimator,
  isProcessing
}) => {
  const [streamBg, setStreamBg] = useState<'cyber' | 'studio' | 'breaking'>('cyber');
  const [layoutMode, setLayoutMode] = useState<'standard' | 'pip' | 'cinema'>('standard');
  const [videoAspect, setVideoAspect] = useState<'16:9' | 'cover'>('cover');

  const emotion = currentReaction?.emotion || 'chill';

  // Emotion glow colors
  const getEmotionAura = (em: EmotionType) => {
    switch (em) {
      case 'hype':
        return 'border-cyan-500 shadow-[0_0_35px_rgba(6,182,212,0.6)] ring-cyan-400/50';
      case 'laugh':
        return 'border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.6)] ring-amber-400/50';
      case 'shocked':
        return 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.7)] ring-purple-400/50';
      case 'rage':
        return 'border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.7)] ring-rose-500/50';
      case 'celebrate':
        return 'border-yellow-400 shadow-[0_0_45px_rgba(250,204,21,0.8)] ring-yellow-300/50';
      default:
        return 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-indigo-500/30';
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl flex flex-col">
      {/* Stream Display Canvas Area */}
      <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden flex items-center justify-center select-none">
        
        {/* Background Layer (Gameplay simulation / Studio / News) */}
        <div className="absolute inset-0 z-0">
          {streamBg === 'cyber' && (
            <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/40 to-zinc-950">
              {/* Dynamic grid backdrop */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />
              {/* Simulated in-game UI overlay */}
              <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-purple-500/30 flex items-center gap-2 text-xs">
                <Gamepad2 className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="font-mono text-zinc-300">CYBER WARFARE 2026 // LIVE MATCH</span>
                <span className="px-1.5 py-0.5 rounded bg-red-600/80 text-[10px] font-bold text-white">SCORE: 24 - 18</span>
              </div>
              <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-zinc-700 font-mono text-[11px] text-zinc-400">
                PING: <span className="text-emerald-400 font-semibold">18ms</span>
              </div>
              {/* Animated cyber particles / ambient glow */}
              <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-20 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            </div>
          )}

          {streamBg === 'studio' && (
            <div className="w-full h-full bg-gradient-to-tr from-zinc-950 via-zinc-900 to-indigo-950 relative">
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
              <div className="absolute bottom-6 left-6 text-zinc-600 text-xs font-mono uppercase tracking-widest">
                RAYAN BROADCAST SYSTEM // 4K 60FPS
              </div>
            </div>
          )}

          {streamBg === 'breaking' && (
            <div className="w-full h-full bg-gradient-to-b from-red-950/40 via-zinc-950 to-zinc-950 relative flex items-center justify-center">
              <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded animate-pulse">
                🔴 تغطية عاجلة ومباشرة
              </div>
              <div className="text-center px-4 max-w-xl">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2 animate-bounce" />
                <h3 className="text-white text-lg sm:text-xl font-black mb-1">
                  ردة فعل حية ومباشرة على الأحداث الساخنة
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm">
                  الستريمر يتفاعل لحظياً مع أي حدث تطرحه أو رسالة في الشات!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Streamer Webcam Frame (The Focal Point) */}
        <div
          className={`relative z-10 transition-all duration-300 ${
            layoutMode === 'pip'
              ? 'absolute bottom-4 right-4 w-52 sm:w-72 aspect-video rounded-xl shadow-2xl'
              : 'w-full h-full flex items-center justify-center'
          }`}
        >
          <div
            className={`relative overflow-hidden transition-all duration-300 ${
              layoutMode === 'pip'
                ? 'w-full h-full rounded-xl border-2'
                : 'w-full h-full sm:max-w-4xl'
            } ${getEmotionAura(emotion)} ${
              isSpeaking ? 'scale-[1.01] transition-transform duration-200' : ''
            }`}
          >
            {/* If a generated AI video is active, play it directly! */}
            {activeVideoUrl ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  src={activeVideoUrl}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className={`w-full h-full ${videoAspect === 'cover' ? 'object-cover' : 'object-contain'}`}
                />
                <div className="absolute top-3 left-3 bg-purple-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-purple-200 border border-purple-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  فيديو متحرك (Gemini Omni Flash)
                </div>
                <button
                  onClick={onClearVideo}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white px-2 py-0.5 rounded text-[10px] border border-zinc-700 transition-colors"
                >
                  العودة للصورة الأصلية
                </button>
              </div>
            ) : (
              /* High-fidelity default photo with breathing and reaction animations */
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_qmzo6yqmzo6yqmzo_44cc4a19.jpg"
                  alt="الكابتن ريان - بث مباشر"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isSpeaking ? 'scale-105 brightness-105' : 'scale-100'
                  }`}
                />

                {/* Ambient RGB lighting on the streamer */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                    emotion === 'rage'
                      ? 'bg-rose-600/15'
                      : emotion === 'hype'
                      ? 'bg-cyan-500/10'
                      : emotion === 'celebrate'
                      ? 'bg-amber-500/10'
                      : 'bg-transparent'
                  }`}
                />

                {/* Subtle CRT / stream scanline overlay */}
                <div className="absolute inset-0 pointer-events-none scanline opacity-30" />
              </div>
            )}

            {/* Live Reactive Audio Visualizer Wave Bars (when speaking) */}
            {isSpeaking && (
              <div className="absolute bottom-3 left-3 z-20 flex items-end gap-1 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-purple-500/40">
                <Volume2 className="w-3.5 h-3.5 text-purple-400 mr-1" />
                <span className="w-1 bg-purple-400 rounded-full wave-bar" style={{ animationDelay: '0ms', height: '14px' }} />
                <span className="w-1 bg-pink-400 rounded-full wave-bar" style={{ animationDelay: '150ms', height: '22px' }} />
                <span className="w-1 bg-amber-400 rounded-full wave-bar" style={{ animationDelay: '300ms', height: '18px' }} />
                <span className="w-1 bg-cyan-400 rounded-full wave-bar" style={{ animationDelay: '450ms', height: '26px' }} />
                <span className="w-1 bg-emerald-400 rounded-full wave-bar" style={{ animationDelay: '200ms', height: '16px' }} />
                <span className="text-[11px] font-bold text-white ml-1 font-mono">يتحدث...</span>
              </div>
            )}

            {/* Streamer Emotion & Status Tag */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              {currentReaction?.actionBadge && (
                <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-700 text-xs font-bold text-amber-300 flex items-center gap-1 shadow-lg">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {currentReaction.actionBadge}
                </div>
              )}

              {/* Processing loader */}
              {isProcessing && (
                <div className="bg-purple-600/90 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>يفكر ويرد...</span>
                </div>
              )}
            </div>

            {/* Live Subtitles / Streamer Dialogue Box */}
            {currentReaction?.reply && (
              <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-30 pointer-events-none">
                <div className="bg-zinc-950/90 backdrop-blur-md border border-purple-500/50 rounded-xl p-3.5 sm:p-4 text-center shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-purple-300 font-bold text-xs uppercase tracking-wider">
                      الكابتن ريان على المايك:
                    </span>
                  </div>
                  <p className="text-white text-sm sm:text-base font-bold leading-relaxed tracking-wide text-balance">
                    "{currentReaction.reply}"
                  </p>
                </div>
              </div>
            )}

            {/* On-Screen Big Event Banner (if triggered) */}
            {currentReaction?.bannerText && (
              <div className="absolute top-12 inset-x-4 z-30 pointer-events-none animate-bounce">
                <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-black px-4 py-2 rounded-xl text-center shadow-xl text-sm sm:text-base border-2 border-white/80">
                  ⭐ {currentReaction.bannerText} ⭐
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast HUD Bottom Controls */}
      <div className="bg-zinc-900 border-t border-zinc-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Background / Stage Switcher */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-zinc-400 font-medium hidden sm:inline">مشهد البث:</span>
          <button
            onClick={() => setStreamBg('cyber')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              streamBg === 'cyber'
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            🎮 لعبة كاونتر 2026
          </button>
          <button
            onClick={() => setStreamBg('studio')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              streamBg === 'studio'
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            🎙️ الاستوديو المظلم
          </button>
          <button
            onClick={() => setStreamBg('breaking')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              streamBg === 'breaking'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            🚨 شاشة الأخبار العاجلة
          </button>
        </div>

        {/* Quick feature shortcuts */}
        <div className="flex items-center gap-2">
          {activeVideoUrl && (
            <button
              onClick={() => setVideoAspect(prev => prev === 'cover' ? '16:9' : 'cover')}
              className="text-zinc-300 hover:text-white px-2 py-1 rounded bg-zinc-800 border border-zinc-700"
            >
              تناسب: {videoAspect === 'cover' ? 'ملء الشاشة' : '16:9 أصلي'}
            </button>
          )}

          <button
            onClick={onOpenVideoAnimator}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>صانع الفيديو (Omni Flash)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
