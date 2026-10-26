import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Film,
  Download,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
  Video,
  Layers,
  ArrowRight
} from 'lucide-react';

interface VideoAnimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVideoToStream: (videoUrl: string) => void;
}

export const VideoAnimatorModal: React.FC<VideoAnimatorModalProps> = ({
  isOpen,
  onClose,
  onApplyVideoToStream
}) => {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('/assets/aistudio/Gemini_Generated_Image_qmzo6yqmzo6yqmzo_44cc4a19.jpg');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [prompt, setPrompt] = useState<string>(
    'The streamer wearing a black mask and headset talks passionately into his broadcast microphone with lively head movements, expressive eye contact and energetic gestures in his live streaming studio.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch default image base64 on load
  useEffect(() => {
    const fetchDefaultImage = async () => {
      try {
        const res = await fetch('/api/default-streamer-image');
        const data = await res.json();
        if (data.exists && data.base64) {
          setSelectedImageBase64(data.base64);
        }
      } catch (err) {
        console.warn('Could not load default image base64:', err);
      }
    };
    fetchDefaultImage();
  }, []);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('يرجى اختيار ملف صورة صالح (JPEG أو PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreviewUrl(result);
      setSelectedImageBase64(result);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUseDefaultImage = async () => {
    setImagePreviewUrl('/assets/aistudio/Gemini_Generated_Image_qmzo6yqmzo6yqmzo_44cc4a19.jpg');
    try {
      const res = await fetch('/api/default-streamer-image');
      const data = await res.json();
      if (data.exists && data.base64) {
        setSelectedImageBase64(data.base64);
        setErrorMsg(null);
      }
    } catch (e: any) {
      setErrorMsg('فشل استرجاع الصورة الافتراضية.');
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedImageBase64) {
      setErrorMsg('يرجى اختيار صورة أولاً.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setProgressPercent(10);
    setProgressStage('إرسال الصورة إلى نموذج Gemini Omni Flash عبر Interactions API...');

    // Progress simulation while model renders
    const progressTimer = setInterval(() => {
      setProgressPercent(prev => {
        if (prev < 30) {
          setProgressStage('تحليل إيماءات الوجه والتفاصيل البصرية...');
          return prev + 6;
        } else if (prev < 65) {
          setProgressStage('توليد حركة الستريمر والكلام التفاعلي في الاستوديو...');
          return prev + 4;
        } else if (prev < 90) {
          setProgressStage('معالجة وترميز إطارات الفيديو بدقة عالية...');
          return prev + 2;
        }
        return prev;
      });
    }, 1200);

    try {
      const res = await fetch('/api/animate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImageBase64,
          prompt,
          aspectRatio,
          duration: '5s',
          resolution: '720p'
        })
      });

      clearInterval(progressTimer);
      const data = await res.json();

      if (data.success && data.videoUrl) {
        setProgressPercent(100);
        setProgressStage('اكتمل توليد الفيديو بنجاح!');
        setGeneratedVideoUrl(data.videoUrl);
      } else {
        throw new Error(data.error || 'فشل توليد الفيديو من النموذج.');
      }
    } catch (err: any) {
      clearInterval(progressTimer);
      console.error('Video generation error:', err);
      setErrorMsg(err.message || 'حدث خطأ أثناء الاتصال بنموذج gemini-omni-1.1-flash.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-zinc-900 border border-purple-500/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Film className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  استوديو تحريك الصور إلى فيديو (Gemini Omni Flash)
                </h2>
                <span className="bg-purple-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                  gemini-omni-1.1-flash
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                حوّل صورة الستريمر أو أي صورة ترفعها إلى فيديو حي ومتحرك بنسبة 16:9 أو 9:16
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Image Selection & Preview */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>الصورة المراد تحريكها:</span>
                  <button
                    type="button"
                    onClick={handleUseDefaultImage}
                    className="text-purple-400 hover:text-purple-300 text-[11px] underline"
                  >
                    استخدام صورة الستريمر الافتراضية
                  </button>
                </label>

                {/* Preview Box */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-zinc-700 flex items-center justify-center group">
                  <img
                    src={imagePreviewUrl}
                    alt="معاينة الصورة"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/90 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      تغيير الصورة
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
                  <span>يمكنك رفع صورة جديدة من جهازك</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    <Upload className="w-3 h-3" />
                    رفع صورة أخرى
                  </button>
                </div>
              </div>

              {/* Aspect Ratio Selection (16:9 or 9:16) */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  نسبة الأبعاد (Aspect Ratio):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                      aspectRatio === '16:9'
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white">16:9 (عرضي)</div>
                      <div className="text-[11px] text-zinc-400">مثالي لبثوث تويتش واليوتيوب</div>
                    </div>
                    <div className="w-8 h-5 rounded border-2 border-current shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                      aspectRatio === '9:16'
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white">9:16 (طولي)</div>
                      <div className="text-[11px] text-zinc-400">مثالي لتيك توك والريلز</div>
                    </div>
                    <div className="w-5 h-8 rounded border-2 border-current shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Motion Prompt & Generation Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  وصف الحركة المطلوب (Motion Prompt):
                </label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-purple-500 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              {/* Prompt Presets */}
              <div>
                <span className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
                  نماذج حركات جاهزة وسريعة:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setPrompt(
                        'The streamer wearing a black mask and headset speaks passionately into his microphone with lively head movements, expressive eye gestures and nods during a live stream.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors"
                  >
                    🎙️ كلام حماسي بالمايك
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPrompt(
                        'The streamer reacts with intense shock, wide eyes, and dramatic head turn towards his chat monitor in excitement.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors"
                  >
                    😱 ردة فعل صدمة وذهول
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPrompt(
                        'The streamer bursts into energetic laughter, throwing his head back and gesturing playfully to the stream audience.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors"
                  >
                    😂 ضحك ومزاح مع الشات
                  </button>
                </div>
              </div>

              {/* Progress Bar (if generating) */}
              {isGenerating && (
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                      {progressStage}
                    </span>
                    <span className="font-mono text-purple-300">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    جاري التوليد بواسطة gemini-omni-1.1-flash (قد يستغرق حوالي 20 إلى 45 ثانية)...
                  </p>
                </div>
              )}

              {/* Generate Button */}
              {!isGenerating && (
                <button
                  type="button"
                  onClick={handleGenerateVideo}
                  disabled={!selectedImageBase64}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-600/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>توليد الفيديو بواسطة Gemini Omni Flash 🚀</span>
                </button>
              )}
            </div>
          </div>

          {/* Generated Video Result Preview */}
          {generatedVideoUrl && (
            <div className="mt-6 pt-6 border-t border-zinc-800 bg-zinc-950/80 p-5 rounded-2xl border border-purple-500/40 animate-in fade-in slide-in-from-bottom-3">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-white font-bold text-base">الفيديو المتحرك الناتج بنجاح!</h3>
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                    {aspectRatio}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generatedVideoUrl}
                    download={`streamer-animated-${aspectRatio}.mp4`}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    تحميل الفيديو MP4
                  </a>

                  {/* Apply to Stream Broadcast */}
                  <button
                    type="button"
                    onClick={() => {
                      onApplyVideoToStream(generatedVideoUrl);
                      onClose();
                    }}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    تعيين كفيديو البث المباشر الآن! 🎥
                  </button>
                </div>
              </div>

              {/* Video Player */}
              <div
                className={`mx-auto rounded-xl overflow-hidden bg-black border border-zinc-700 shadow-2xl flex items-center justify-center ${
                  aspectRatio === '9:16' ? 'max-w-xs aspect-[9/16]' : 'max-w-2xl aspect-video'
                }`}
              >
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
