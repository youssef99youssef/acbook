import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  DollarSign,
  Heart,
  Flame,
  Smile,
  Shield,
  Star,
  Zap,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { ChatMessage } from '../types/streamer';
import { INITIAL_CHAT_MESSAGES, SIMULATED_CHATTERS, RANDOM_CHAT_LINES } from '../data/mockStreamData';

interface LiveChatProps {
  onSendMessageToStreamer: (message: string, isSuperChat?: boolean, amount?: number, viewerName?: string) => void;
  isProcessing: boolean;
}

export const LiveChat: React.FC<LiveChatProps> = ({
  onSendMessageToStreamer,
  isProcessing
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [viewerName, setViewerName] = useState('أنت (المشاهد المميز)');
  const [showSuperChatModal, setShowSuperChatModal] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState<number>(20);
  const [superChatMessage, setSuperChatMessage] = useState('');
  const [chatSpeed, setChatSpeed] = useState<'normal' | 'fast' | 'paused'>('normal');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodic simulated chatters to keep stream feeling 100% alive
  useEffect(() => {
    if (chatSpeed === 'paused') return;
    const intervalTime = chatSpeed === 'fast' ? 2200 : 4500;

    const interval = setInterval(() => {
      const randomChatter = SIMULATED_CHATTERS[Math.floor(Math.random() * SIMULATED_CHATTERS.length)];
      const randomLine = RANDOM_CHAT_LINES[Math.floor(Math.random() * RANDOM_CHAT_LINES.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const newMsg: ChatMessage = {
        id: 'sim-' + Date.now() + Math.random(),
        sender: randomChatter.name,
        avatarColor: randomChatter.color,
        badge: randomChatter.badge as any,
        message: randomLine,
        timestamp: timeStr
      };

      setMessages(prev => [...prev.slice(-40), newMsg]);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [chatSpeed]);

  const handleSendStandardMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: viewerName,
      avatarColor: '#a855f7',
      badge: 'sub',
      message: text,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Trigger streamer live reaction
    onSendMessageToStreamer(text, false, undefined, viewerName);
  };

  const handleSendSuperChat = () => {
    if (!superChatMessage.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: 'sc-' + Date.now(),
      sender: viewerName,
      avatarColor: '#f59e0b',
      badge: 'donor',
      isSuperChat: true,
      donationAmount: superChatAmount,
      message: superChatMessage.trim(),
      timestamp: timeStr
    };

    setMessages(prev => [...prev, newMsg]);
    setShowSuperChatModal(false);

    // Call streamer reaction with donation details
    onSendMessageToStreamer(superChatMessage.trim(), true, superChatAmount, viewerName);
    setSuperChatMessage('');
  };

  const renderBadge = (badge?: string) => {
    switch (badge) {
      case 'mod':
        return <span className="p-0.5 rounded bg-blue-500/20 text-blue-400" title="مشرف القناة"><Shield className="w-3 h-3" /></span>;
      case 'vip':
        return <span className="p-0.5 rounded bg-pink-500/20 text-pink-400" title="عضو VIP"><Star className="w-3 h-3" /></span>;
      case 'donor':
        return <span className="p-0.5 rounded bg-amber-500/20 text-amber-400 font-bold" title="متبرع سوبر شات"><DollarSign className="w-3 h-3" /></span>;
      case 'sub':
      default:
        return <span className="p-0.5 rounded bg-purple-500/20 text-purple-400" title="مشترك بالقناة"><Zap className="w-3 h-3" /></span>;
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[580px] lg:h-full overflow-hidden shadow-xl">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <h2 className="font-bold text-white text-sm">دردشة البث المباشر</h2>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        {/* Chat rate controls */}
        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setChatSpeed(chatSpeed === 'fast' ? 'normal' : 'fast')}
            className={`px-2 py-0.5 rounded transition-colors ${
              chatSpeed === 'fast'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {chatSpeed === 'fast' ? '⚡ شات عاصف' : 'سرعة الشات'}
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`text-xs leading-relaxed rounded-xl transition-all ${
              msg.isSuperChat
                ? 'p-3 bg-gradient-to-r from-amber-950/80 via-yellow-950/60 to-amber-950/80 border-2 border-amber-500/60 shadow-lg'
                : 'px-2 py-1.5 hover:bg-zinc-800/40'
            }`}
          >
            {msg.isSuperChat ? (
              <div>
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-amber-500/30">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-bold text-amber-300 text-sm">{msg.sender}</span>
                    <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">
                      ${msg.donationAmount} SUPER CHAT
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300/60 font-mono">{msg.timestamp}</span>
                </div>
                <p className="text-amber-100 font-bold text-sm">{msg.message}</p>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <span className="text-[10px] text-zinc-500 font-mono mt-0.5 shrink-0">{msg.timestamp}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {renderBadge(msg.badge)}
                  <span
                    className="font-bold"
                    style={{ color: msg.avatarColor || '#e4e4e7' }}
                  >
                    {msg.sender}:
                  </span>
                </div>
                <span className="text-zinc-200 break-words font-medium">{msg.message}</span>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Reaction Chips for user */}
      <div className="px-3 py-1.5 bg-zinc-950/40 border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => {
            setInputText('كابتن ريان اسطورة البث بلا منازع! 🔥');
          }}
          className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap text-[11px] transition-colors"
        >
          🔥 أسطورة
        </button>
        <button
          onClick={() => {
            setInputText('هههههههههههههه مت ضحك والله لقطة تاريخية 😂');
          }}
          className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap text-[11px] transition-colors"
        >
          😂 لقطة مضحكة
        </button>
        <button
          onClick={() => {
            setInputText('وش رأيك في الأحداث الأخيرة والبطولة الجديدة؟');
          }}
          className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap text-[11px] transition-colors"
        >
          ❓ سؤال للستريمر
        </button>
      </div>

      {/* Input Box and SuperChat Button */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800">
        <form onSubmit={handleSendStandardMessage} className="flex items-center gap-2">
          {/* SuperChat Donation Button */}
          <button
            type="button"
            onClick={() => setShowSuperChatModal(true)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            title="إرسال سوبر شات وتبرع للستريمر"
          >
            <DollarSign className="w-4 h-4 stroke-[3]" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="اكتب رسالتك وتحدث مع الستريمر..."
            disabled={isProcessing}
            className="flex-1 bg-zinc-900 border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white font-bold transition-all active:scale-95"
            title="إرسال"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* SuperChat / Donation Modal */}
      {showSuperChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-amber-500/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-2">
                <DollarSign className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-black text-white">إرسال سوبر شات / تبرع ذهبي</h3>
              <p className="text-xs text-zinc-400 mt-1">
                الستريمر سينطق اسمك ويشكرك بصوته بحماس مع مؤثرات حصرية!
              </p>
            </div>

            {/* Amount Presets */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[5, 20, 50, 100].map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setSuperChatAmount(amount)}
                  className={`py-2 rounded-xl font-black text-sm transition-all ${
                    superChatAmount === amount
                      ? 'bg-amber-500 text-zinc-950 scale-105 shadow-md shadow-amber-500/40'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Donor Name */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">اسمك في البث:</label>
              <input
                type="text"
                value={viewerName}
                onChange={e => setViewerName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Custom Message */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">رسالتك المميزة:</label>
              <textarea
                value={superChatMessage}
                onChange={e => setSuperChatMessage(e.target.value)}
                placeholder="اكتب التحدي أو الرسالة التي تريد أن يقرأها الكابتن ريان..."
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSuperChatModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSendSuperChat}
                disabled={!superChatMessage.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50"
              >
                تبرع الآن (${superChatAmount}) 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
