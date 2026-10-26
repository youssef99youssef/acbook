/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BroadcastHeader } from './components/BroadcastHeader';
import { StreamPlayer } from './components/StreamPlayer';
import { LiveChat } from './components/LiveChat';
import { EventReactionsPanel } from './components/EventReactionsPanel';
import { SoundboardBar } from './components/SoundboardBar';
import { VideoAnimatorModal } from './components/VideoAnimatorModal';
import { StreamerReaction } from './types/streamer';
import { voiceEngine } from './utils/ttsPlayer';
import { soundboard } from './utils/soundEffects';

export default function App() {
  const [viewerCount, setViewerCount] = useState<number>(18492);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentReaction, setCurrentReaction] = useState<StreamerReaction | null>({
    reply: 'يا هلا ويا مية مرحبا بكل الأساطير اللي دخلوا البث! نورتوا الاستوديو، اكتبوا لنا وش ودكم نلعب أو نعلق عليه اليوم! 🔥',
    emotion: 'hype',
    soundEffect: 'cheer',
    actionBadge: 'بداية البث المباشر 🎙️',
    bannerText: 'أهلاً بكم في البث المباشر مع الكابتن ريان'
  });

  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isVideoAnimatorOpen, setIsVideoAnimatorOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Subscribe to speech status from voiceEngine
  useEffect(() => {
    const unsubscribe = voiceEngine.subscribe(speaking => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubscribe();
      voiceEngine.stop();
    };
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      soundboard.setMuted(next);
      if (next) {
        voiceEngine.stop();
      }
      return next;
    });
  }, []);

  // Handle message sent from chat to streamer
  const handleSendMessageToStreamer = async (
    message: string,
    isSuperChat = false,
    donationAmount?: number,
    viewerName = 'متابع البث'
  ) => {
    if (isSuperChat) {
      soundboard.play('donation');
      setViewerCount(prev => prev + Math.floor(Math.random() * 50) + 20);
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/streamer/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          viewerName,
          donationAmount,
          isSuperChat,
          streamTopic: 'بث ألعاب وردود أفعال حية على الأحداث'
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const reaction: StreamerReaction = {
          ...json.data,
          audioUrl: json.audioUrl
        };
        setCurrentReaction(reaction);

        // Play sound effect
        if (reaction.soundEffect && reaction.soundEffect !== 'none') {
          soundboard.play(reaction.soundEffect);
        }

        // Play voice
        if (!isMuted) {
          voiceEngine.speak(reaction.reply, reaction.audioUrl);
        }
      }
    } catch (err) {
      console.error('Failed to get streamer response:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle event trigger from panel
  const handleTriggerEventReaction = async (
    eventTitle: string,
    eventDesc: string,
    category: string,
    intensity: string
  ) => {
    setIsProcessing(true);
    setViewerCount(prev => prev + Math.floor(Math.random() * 300) + 120);

    try {
      const res = await fetch('/api/streamer/event-reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTitle,
          eventDescription: eventDesc,
          category,
          intensity
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const reaction: StreamerReaction = {
          reply: json.data.reactionText,
          emotion: json.data.emotion,
          soundEffect: json.data.soundEffect,
          actionBadge: json.data.actionBadge || 'ردة فعل مباشرة 🚨',
          bannerText: json.data.screenOverlayTitle,
          audioUrl: json.audioUrl
        };
        setCurrentReaction(reaction);

        // Play sound effect
        if (reaction.soundEffect && reaction.soundEffect !== 'none') {
          soundboard.play(reaction.soundEffect);
        }

        // Play voice
        if (!isMuted) {
          voiceEngine.speak(reaction.reply, reaction.audioUrl);
        }
      }
    } catch (err) {
      console.error('Failed to trigger event reaction:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Broadcast Header HUD */}
      <BroadcastHeader
        viewerCount={viewerCount}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenVideoAnimator={() => setIsVideoAnimatorOpen(true)}
        activeVideoUrl={activeVideoUrl}
      />

      {/* Main Stream Broadcast Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Main Broadcast Stage (Left / Center) */}
          <div className="lg:col-span-8 space-y-4">
            <StreamPlayer
              isSpeaking={isSpeaking}
              currentReaction={currentReaction}
              activeVideoUrl={activeVideoUrl}
              onClearVideo={() => setActiveVideoUrl(null)}
              onOpenVideoAnimator={() => setIsVideoAnimatorOpen(true)}
              isProcessing={isProcessing}
            />

            {/* Soundboard Bar */}
            <SoundboardBar
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />

            {/* Event Reactions Panel */}
            <EventReactionsPanel
              onTriggerEventReaction={handleTriggerEventReaction}
              isProcessing={isProcessing}
            />
          </div>

          {/* Live Chat & SuperChat Panel (Right Sidebar) */}
          <div className="lg:col-span-4 sticky top-20">
            <LiveChat
              onSendMessageToStreamer={handleSendMessageToStreamer}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </main>

      {/* Animate to Video Modal (Gemini Omni Flash) */}
      <VideoAnimatorModal
        isOpen={isVideoAnimatorOpen}
        onClose={() => setIsVideoAnimatorOpen(false)}
        onApplyVideoToStream={(url) => setActiveVideoUrl(url)}
      />

      {/* Footer info bar */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950 py-3 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>LiveStreamer AI Studio &copy; 2026 - نظام بث مباشر ذكي مع توليد فيديو متحرك عبر Gemini Omni Flash</span>
          <span className="font-mono text-zinc-600">RTMP://STREAM.RAYAN.LIVE // 1080P60</span>
        </div>
      </footer>
    </div>
  );
}
