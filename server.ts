import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({ apiKey });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Provide the default streamer image as base64
app.get('/api/default-streamer-image', (req, res) => {
  try {
    const imagePath = path.resolve(__dirname, 'public/assets/aistudio/Gemini_Generated_Image_qmzo6yqmzo6yqmzo_44cc4a19.jpg');
    if (fs.existsSync(imagePath)) {
      const fileBuffer = fs.readFileSync(imagePath);
      const base64 = fileBuffer.toString('base64');
      return res.json({
        exists: true,
        mimeType: 'image/jpeg',
        base64: base64,
        url: '/assets/aistudio/Gemini_Generated_Image_qmzo6yqmzo6yqmzo_44cc4a19.jpg'
      });
    }
    return res.status(404).json({ exists: false, error: 'Default image not found' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Fast, authentic streamer dialogue response
app.post('/api/streamer/respond', async (req, res) => {
  try {
    const {
      message,
      viewerName = 'متابع أسطوري',
      donationAmount,
      isSuperChat = false,
      streamTopic = 'بث ألعاب وردود أفعال حية على الأحداث',
      streamerPersonality = 'حماسي، عفوي، محب للمجتمع، فكاهي وعاشق للألعاب'
    } = req.body;

    const ai = getAiClient();

    const systemPrompt = `
أنت ستريمر عربي مشهور اسمه "الكابتن ريان" (Rayan Live)، تبث ألعاباً وسوالف مباشرة (مثل تويتش ويوتيوب جيمنج).
ترتدي كمامة سوداء وسماعات رأس احترافية مع مايكروفون استوديو معلق.
شخصيتك: ${streamerPersonality}. موضوع البث: ${streamTopic}.

عندما يكتب متابع في الشات أو يرسل سوبر شات أو تبرع:
1. رد بعفوية وحماس كأنك في بث مباشر حقيقي وتتكلم في المايك مباشرة بصوتك.
2. استخدم مصطلحات الستريمرز والجيمنج المحببة (مثل: "يا أساطير", "ولكم يا وحش", "جي جي GG", "نو واي مستحيل", "منور الشات", "شكراً على الدعم الأسطوري", "يا جماعة اسمعوا هالسالفة").
3. إذا كان هناك تبرع أو سوبر شات، اشكره بحرارة وتفاعل معه بطريقة ملحمية كوميدية!
4. اجعل الرد صوتياً وطبيعياً (بين جملتين إلى 3 جمل سريعة وممتعة).

أعد الإجابة بصيغة JSON حصراً:
{
  "reply": "نص ما يقوله الستريمر بصوته للمتابعين",
  "emotion": "hype" | "laugh" | "shocked" | "chill" | "rage" | "celebrate",
  "soundEffect": "cheer" | "airhorn" | "applause" | "fail" | "donation" | "level_up" | "none",
  "actionBadge": "شارة مختصرة مثل: رد ناري 🔥 أو شكر أسطوري ❤️ أو صدمة 😱",
  "bannerText": "نص شريط الإشعار على الشاشة"
}
`;

    const userPrompt = `
المتابع "${viewerName}" كتب في الشات:
"${message}"
${donationAmount ? `مع تبرع بقيمة: ${donationAmount}$ (${isSuperChat ? 'SuperChat سوبر شات ذهبي' : 'تبرع مباشر'})` : ''}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            emotion: { type: Type.STRING },
            soundEffect: { type: Type.STRING },
            actionBadge: { type: Type.STRING },
            bannerText: { type: Type.STRING }
          },
          required: ['reply', 'emotion', 'soundEffect', 'actionBadge']
        }
      }
    });

    let replyData = {
      reply: 'يا هلا ومرحب بيك يا أسطورة! نورت البث والله!',
      emotion: 'hype',
      soundEffect: donationAmount ? 'donation' : 'cheer',
      actionBadge: donationAmount ? 'شكر أسطوري ❤️' : 'تحية البث 👋',
      bannerText: donationAmount ? `تبرع جديد بقيمة ${donationAmount}$ من ${viewerName}!` : ''
    };

    if (response.text) {
      try {
        replyData = JSON.parse(response.text.trim());
      } catch (e) {
        console.warn('JSON parse warning:', e);
      }
    }

    res.json({
      success: true,
      data: replyData,
      audioUrl: null // Client uses high-speed Web Speech API engine
    });

  } catch (error: any) {
    console.error('Error in streamer response:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'حدث خطأ أثناء معالجة تفاعل الستريمر'
    });
  }
});

// Streamer event reaction endpoint (breaking events, news, game clutches, raids)
app.post('/api/streamer/event-reaction', async (req, res) => {
  try {
    const {
      eventTitle,
      eventDescription,
      category = 'gaming',
      intensity = 'high'
    } = req.body;

    const ai = getAiClient();

    const systemPrompt = `
أنت "الكابتن ريان" الستريمر، في بث مباشر يشاهده الآلاف.
حدث الآن حدث مفاجئ أثناء البث!
المطلوب: قدم رد فعل مباشر (Reaction) بصوتك وانفعالك الحقيقي.
تفاجأ، اصرخ بحماس أو اضحك بقوة، وجه نظرك للشات، اطلب من المتابعين التعليق وكتابة سبام في الشات!

أخرج النتيجة بصيغة JSON:
{
  "reactionText": "كلام الستريمر الحماسي وتعبيره الصوتي",
  "emotion": "shocked" | "hype" | "laugh" | "rage" | "celebrate",
  "soundEffect": "airhorn" | "cheer" | "applause" | "fail" | "level_up",
  "actionBadge": "شارة رد الفعل",
  "chatHypeMessage": "الرسالة التي يطلب من الشات كتابتها سبام (مثل: اكتبوا 1111 أو GG)",
  "screenOverlayTitle": "عنوان ضخم يظهر على شاشة البث"
}
`;

    const prompt = `الحدث المباشر هو: "${eventTitle}". تفاصيل الحدث: "${eventDescription}". نوع الحدث: "${category}". شدة الحدث: "${intensity}".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reactionText: { type: Type.STRING },
            emotion: { type: Type.STRING },
            soundEffect: { type: Type.STRING },
            actionBadge: { type: Type.STRING },
            chatHypeMessage: { type: Type.STRING },
            screenOverlayTitle: { type: Type.STRING }
          },
          required: ['reactionText', 'emotion', 'soundEffect', 'screenOverlayTitle']
        }
      }
    });

    let reactionData = {
      reactionText: `يا جماعة مش معقول اللي قاعد يصير الآن! شفتوا ${eventTitle}؟! مستحيل والله!`,
      emotion: 'shocked',
      soundEffect: 'airhorn',
      actionBadge: 'صدمة البث 😱',
      chatHypeMessage: 'اكتبوا 1111 في الشات فوراً!',
      screenOverlayTitle: `🚨 حدث عاجل: ${eventTitle}`
    };

    if (response.text) {
      try {
        reactionData = JSON.parse(response.text.trim());
      } catch (e) {
        console.warn('JSON parse warning:', e);
      }
    }

    res.json({
      success: true,
      data: reactionData,
      audioUrl: null
    });

  } catch (error: any) {
    console.error('Error in event reaction:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'فشل توليد رد الفعل على الحدث'
    });
  }
});

// Animate Images into Video endpoint using gemini-omni-1.1-flash via Interactions API
app.post('/api/animate-video', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      prompt = 'The streamer reacts dynamically, talking passionately into his broadcast microphone with expressive eye contact and subtle head movements in his stream studio.',
      aspectRatio = '16:9',
      duration = '5s',
      resolution = '720p'
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'يرجى تقديم صورة (imageBase64) لتحويلها إلى فيديو.'
      });
    }

    const cleanData = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';
    const validDuration = duration === '10s' ? '10s' : '5s';

    console.log(`[Omni Flash Video] Starting animation with aspect ratio ${validAspectRatio}...`);
    const ai = getAiClient();

    const interaction = await ai.interactions.create({
      model: 'gemini-omni-1.1-flash',
      input: [
        {
          type: 'image',
          mime_type: mimeType,
          data: cleanData,
        },
        {
          type: 'text',
          text: prompt,
        }
      ],
      background: false,
      store: false,
      stream: false,
      response_format: {
        type: 'video',
        aspect_ratio: validAspectRatio,
        duration: validDuration,
        resolution: resolution === '1080p' ? '1080p' : (resolution === '360p' ? '360p' : '720p'),
      }
    }, { timeout: 360000 });

    console.log('[Omni Flash Video] Interaction response received!');
    const videoPart = interaction.output_video;

    if (videoPart) {
      if (videoPart.data) {
        const videoMime = videoPart.mime_type || 'video/mp4';
        return res.json({
          success: true,
          videoUrl: `data:${videoMime};base64,${videoPart.data}`,
          mimeType: videoMime,
          aspectRatio: validAspectRatio,
          prompt: prompt
        });
      } else if (videoPart.uri) {
        return res.json({
          success: true,
          videoUrl: videoPart.uri,
          mimeType: videoPart.mime_type || 'video/mp4',
          aspectRatio: validAspectRatio,
          prompt: prompt
        });
      }
    }

    for (const step of interaction.steps || []) {
      if (step.type === 'model_output') {
        const vid = step.content?.find(c => c.type === 'video');
        if (vid) {
          if (vid.data) {
            const videoMime = vid.mime_type || 'video/mp4';
            return res.json({
              success: true,
              videoUrl: `data:${videoMime};base64,${vid.data}`,
              mimeType: videoMime,
              aspectRatio: validAspectRatio,
              prompt: prompt
            });
          } else if (vid.uri) {
            return res.json({
              success: true,
              videoUrl: vid.uri,
              mimeType: vid.mime_type || 'video/mp4',
              aspectRatio: validAspectRatio,
              prompt: prompt
            });
          }
        }
      }
    }

    return res.status(502).json({
      success: false,
      error: 'لم يتم العثور على محتوى فيديو في رد النموذج، يرجى المحاولة مرة أخرى.'
    });

  } catch (error: any) {
    console.error('Error in video animation with gemini-omni-1.1-flash:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'فشل توليد الفيديو بواسطة gemini-omni-1.1-flash.'
    });
  }
});

async function initServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LiveStreamer Studio server running at http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('Failed to initialize server:', err);
  process.exit(1);
});
