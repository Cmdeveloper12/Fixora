import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Send, User, Bot, Wrench, ShieldAlert, CheckCircle2, 
  ArrowRight, RotateCcw, AlertTriangle, ShieldCheck, Zap, Droplets, 
  Snowflake, Activity, Globe, Mic, MicOff, ThumbsUp 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isSafetyWarning?: boolean;
  categorySuggestion?: string;
  diySteps?: string[];
  safeOutcome?: boolean;
}

export const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'नमस्कार! 🙏 मी Fixora चा स्मार्ट AI असिस्टंट आहे.\n\nघरातील कोणतीही समस्या (फॅन, AC, नळ, पाणी गळती, कुलूप, वायरिंग किंवा वॉशिंग मशीन) मला **तुमच्या भाषेत (मराठी, हिंदी किंवा English)** सांगा. मी ChatGPT प्रमाणे लगेच समस्येचे निदान आणि उपाय सांगेन!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'auto' | 'mr' | 'hi' | 'en'>('auto');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: 'फॅन फिरत नाही, नुसता आवाज करतोय', lang: 'mr', icon: '⚡' },
    { label: 'नळातून पाणी सतत गळत आहे', lang: 'mr', icon: '💧' },
    { label: 'AC चालू आहे पण थंड हवा येत नाही', lang: 'hi', icon: '❄️' },
    { label: 'Switchboard मधून जळल्याचा वास येतोय', lang: 'mr', icon: '🔥' },
    { label: 'RO purifer taste is bitter & motor vibrates', lang: 'en', icon: '🚰' },
    { label: 'Washing machine water is not draining', lang: 'en', icon: '🧺' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Speech Recognition setup if browser supports it
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support voice input. Please type your problem.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang === 'mr' ? 'mr-IN' : selectedLang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const detectLanguage = (text: string): 'mr' | 'hi' | 'en' => {
    if (selectedLang !== 'auto') return selectedLang;
    const mrWords = ['माझा', 'नाही', 'चालू', 'पाणी', 'वाजतो', 'गळत', 'आहे', 'काय', 'फिरत', 'बटन', 'करणे', 'कसा', 'सांगा', 'फॅन', 'नळ'];
    const hiWords = ['मेरा', 'पानी', 'ठंडा', 'नहीं', 'चल', 'रहा', 'आवाज़', 'खराब', 'कैसे', 'बताओ', 'पंखा', 'बिजली'];
    
    if (mrWords.some(w => text.includes(w))) return 'mr';
    if (hiWords.some(w => text.includes(w))) return 'hi';
    return 'en';
  };

  const generateAIResponse = (userText: string): { 
    reply: string; 
    category?: string; 
    diySteps?: string[]; 
    isSafetyWarning?: boolean;
    safeOutcome?: boolean;
  } => {
    const lower = userText.toLowerCase();
    const lang = detectLanguage(userText);

    // 1. DANGEROUS / HIGH-VOLTAGE / BURNING / GAS
    if (
      lower.includes('spark') || lower.includes('smoke') || lower.includes('smell') || 
      lower.includes('धूर') || lower.includes('जळल्या') || lower.includes('ठिणगी') || 
      lower.includes('shock') || lower.includes('करंट') || lower.includes('आग') || 
      lower.includes('gas') || lower.includes('गॅस') || lower.includes('जलने')
    ) {
      if (lang === 'mr') {
        return {
          reply: `🚨 **धोकादायक समस्या आढळली (HAZARDOUS ISSUE)!**\n\nयातून इलेक्ट्रिक शॉक किंवा शॉर्ट सर्किटचा गंभीर धोका आहे. **स्वतः हात लावू नका!**\n\n**तातडीची खबरदारी:**\n1. मुख्य वीज पुरवठा (Main MCB / Inverter Switch) त्वरित बंद करा.\n2. जळालेल्या सॉकेट किंवा उपकरणाला पाणी लावू नका.\n3. फिक्सोरा प्रमाणित इलेक्ट्रिशियन तात्काळ बोलावून घ्या.`,
          category: 'Electrician',
          isSafetyWarning: true,
          diySteps: [
            'मेन स्विच / MCB त्वरित OFF करा',
            'उपकरणाच्या वायरला हात लावू नका',
            'तातडीने प्रमाणित इलेक्ट्रिशियन बोलवा'
          ]
        };
      } else if (lang === 'hi') {
        return {
          reply: `🚨 **गंभीर खतरा (HAZARDOUS ISSUE)!**\n\nइसमें बिजली का झटका या शॉर्ट सर्किट लगने का खतरा है। **खुद मरम्मत करने की कोशिश न करें!**\n\n**तुरंत सुरक्षा कदम:**\n1. मुख्य बिजली स्विच (Main MCB) तुरंत बंद कर दें।\n2. उपकरण के प्लग या तार को न छुएं।\n3. फिक्सोरा सत्यापित इलेक्ट्रीशियन को अभी बुक करें।`,
          category: 'Electrician',
          isSafetyWarning: true,
          diySteps: [
            'मेन स्विच / MCB तुरंत बंद करें',
            'तारों को बिल्कुल न छुएं',
            'सत्यापित इलेक्ट्रीशियन को कॉल करें'
          ]
        };
      } else {
        return {
          reply: `🚨 **CRITICAL SAFETY ALERT (HIGH RISK)!**\n\nSparks, burning smell, or electric shocks represent severe short-circuit and fire risks. **DO NOT ATTEMPT DIY REPAIR!**\n\n**Immediate Safety Protocol:**\n1. Switch OFF your Main MCB / Inverter power switch immediately.\n2. Keep children and family away from the affected board.\n3. Dispatch a Fixora Certified Electrician immediately.`,
          category: 'Electrician',
          isSafetyWarning: true,
          diySteps: [
            'Immediately turn off Main MCB',
            'Do not touch exposed wiring or burnt plugs',
            'Book verified Fixora emergency electrician'
          ]
        };
      }
    }

    // 2. CEILING FAN / ELECTRICIAN
    if (lower.includes('fan') || lower.includes('पंखा') || lower.includes('फॅन') || lower.includes('घुम') || lower.includes('आवाज')) {
      if (lang === 'mr') {
        return {
          reply: `⚡ **फॅन तपासणी व उपाय (Ceiling Fan Diagnosis):**\n\nफॅन नुसता गुंग आवाज करत असेल आणि फिरत नसेल, तर ९०% प्रकरणांत **Capacitor (कॅपेसिटर)** खराब झालेला असतो किंवा बेअरिंग जाम असते.\n\n**घरगुती तपासणी (Safe DIY Steps):**\n1. रेग्युलेटर चालू करून फॅनला हळूच एखाद्या लाकडी पट्टीने फिरवून पहा. फिरल्यास कॅपेसिटर बदलावे लागेल.\n2. फॅनच्या पात्यांवर धूळ साचली असल्यास वजन वाढून फॅन संथ फिरतो, पात्या पुसून घ्या.\n3. जर तरीही फिरत नसेल, तर मोटर वाइंडिंग किंवा कॅपेसिटर बदलण्यासाठी फिक्सोरा इलेक्ट्रिशियन उपलब्ध आहे (दर: फक्त ₹२९९).`,
          category: 'Electrician',
          safeOutcome: true,
          diySteps: [
            'रेग्युलेटर नॉब व्यवस्थित १-५ वर फिरवून तपासा',
            'पात्यांवर साचलेली जाळी व धूळ कोरड्या कापडाने साफ करा',
            'कॅपेसिटर बदलण्यासाठी खालील बटनावरून इलेक्ट्रिशियन बुक करा'
          ]
        };
      } else if (lang === 'hi') {
        return {
          reply: `⚡ **पंखे की जांच व समाधान (Ceiling Fan Diagnosis):**\n\nअगर पंखा सिर्फ हमिंग आवाज़ कर रहा है और घूम नहीं रहा, तो अधिकांश मामलों में इसका **कैपेसिटर (Capacitor)** खराब हो चुका होता है।\n\n**आसान जांच कदम:**\n1. रेगुलेटर ऑन करके पंखे को लकड़ी के डंडे से हल्का धक्का देकर देखें। अगर चल पड़े तो कैपेसिटर बदलना होगा।\n2. ब्लेड पर जमी गंदगी साफ करें।\n3. नए कैपेसिटर या मोटर सर्विसिंग के लिए हमारे इलेक्ट्रीशियन से तुरंत सहायता लें।`,
          category: 'Electrician',
          safeOutcome: true,
          diySteps: [
            'रेगुलेटर की स्पीड जांचें',
            'ब्लेड्स की धूल साफ करें',
            'कैपेसिटर बदलने हेतु इलेक्ट्रीशियन बुक करें'
          ]
        };
      } else {
        return {
          reply: `⚡ **Ceiling Fan Diagnosis & Safe Fix:**\n\nIf your ceiling fan is buzzing/humming but not spinning, the run capacitor (usually 2.5 µF) has degraded, or the bearing has seized.\n\n**Safe Troubleshooting Steps:**\n1. Check if the regulator switch is fully seated and not slipping.\n2. Gently give the blade a clockwise push using a safe wooden ruler with the switch ON. If it starts spinning, the capacitor requires replacement.\n3. If it remains stationary, our certified electrician can install an OEM capacitor in 30 mins for ₹299.`,
          category: 'Electrician',
          safeOutcome: true,
          diySteps: [
            'Verify regulator contact and wall switch',
            'Clean dust accumulation on blades',
            'Book verified electrician for capacitor replacement'
          ]
        };
      }
    }

    // 3. TAP / LEAKAGE / PLUMBING
    if (lower.includes('tap') || lower.includes('leak') || lower.includes('water') || lower.includes('नळ') || lower.includes('गळत') || lower.includes('पाणी') || lower.includes('नल') || lower.includes('टपक')) {
      if (lang === 'mr') {
        return {
          reply: `💧 **नळ गळती तपासणी (Tap & Leakage Diagnosis):**\n\nनळ बंद करूनही पाणी टपकत असल्यास नळातील **रबर वॉशर (Washer)** किंवा **सिरॅमिक कार्ट्रिज (Cartridge)** झिजलेले असते.\n\n**घरगुती उपाय (DIY Steps):**\n1. सिंकच्या खालचा कंट्रोल कॉक (Angle Valve) किंचित घट्ट करा.\n2. नळाचे वरचे कॅप उघडून स्क्रू सैल झाला आहे का ते पहा.\n3. जर वॉशर किंवा कार्ट्रिज बदलायचे असेल, तर फिक्सोरा प्लंबर ₹२४९ मध्ये नवीन कार्ट्रिज बसवून देईल.`,
          category: 'Plumber',
          safeOutcome: true,
          diySteps: [
            'Angle valve किंचित घट्ट करून पाण्याचा दाब नियंत्रित करा',
            'नळाचा स्क्रू व हेड सैल असल्यास घट्ट करा',
            'नवीन कार्ट्रिज बसवण्यासाठी प्लंबर बुक करा'
          ]
        };
      } else {
        return {
          reply: `💧 **Plumbing & Tap Leakage Fix:**\n\nPersistent tap dripping is usually caused by a worn-out rubber O-ring or ceramic disc cartridge inside the spindle.\n\n**Safe DIY Fix:**\n1. Shut off the angle valve below the sink clockwise to isolate the leak.\n2. Unscrew the aerator mesh at the tap mouth and clear sand/limescale particles.\n3. If internal spindle replacement is needed, Fixora Plumbers provide 45-min doorstep cartridge replacement starting at ₹249.`,
          category: 'Plumber',
          safeOutcome: true,
          diySteps: [
            'Isolate water via angle stop valve',
            'Clean aerator filter mesh',
            'Schedule expert cartridge replacement'
          ]
        };
      }
    }

    // 4. AC REPAIR
    if (lower.includes('ac') || lower.includes('cooling') || lower.includes('थंड') || lower.includes('थंडा') || lower.includes('हवा')) {
      if (lang === 'mr') {
        return {
          reply: `❄️ **AC कूलिंग तपासणी (AC Troubleshooting):**\n\nAC चालू असून थंड हवा येत नसेल तर:\n1. **एअर फिल्टर (Air Filter):** इनडोअर युनिट उघडून जाळी बाहेर काढा आणि पाण्याने धुवून कोरडी करून पुन्हा बसवा. ७०% वेळा यामुळे कूलिंग पूर्ववत होते.\n2. रिमोटचा मोड **"Cool Mode" (❄️ आयकॉन)** आणि तापमान २४°C वर सेट आहे का ते तपासा.\n3. आउटडोअर युनिटचा पंखा फिरत आहे का ते खिडकीतून पहा. जर कंप्रेसर चालू होत नसेल, तर गॅस लिकेज किंवा कंप्रेसर कॅपेसिटर तपासण्यासाठी फिक्सोरा AC टेक्निशियन उपलब्ध आहे.`,
          category: 'AC Repair',
          safeOutcome: true,
          diySteps: [
            'इनडोअर एअर फिल्टर पाण्याने स्वच्छ धुवा',
            'रिमोट कूल मोड (Cool Mode) वर सेट करा',
            'गॅस किंवा कंप्रेसर तपासणीसाठी टेक्निशियन बुक करा'
          ]
        };
      } else {
        return {
          reply: `❄️ **AC Diagnosis & Jet Service Guide:**\n\nIf your AC runs but blows room-temperature air:\n1. **Clean Air Mesh Filters:** 70% of cooling issues are resolved by sliding out the indoor mesh filter and rinsing under tap water.\n2. **Remote Mode Check:** Confirm the mode is set to 'Cool' (snowflake icon) with fan speed on High/Auto.\n3. If the outdoor condenser unit isn't humming, a gas top-up or capacitor replacement is needed. Fixora HVAC specialists offer foam-jet servicing for ₹499.`,
          category: 'AC Repair',
          safeOutcome: true,
          diySteps: [
            'Rinse dust filters under running water',
            'Set temperature to 24°C on Cool Mode',
            'Book AC specialist for gas/pressure check'
          ]
        };
      }
    }

    // 5. DEFAULT INTELLIGENT MULTILINGUAL RESPONSE
    if (lang === 'mr') {
      return {
        reply: `🔧 **फिक्सोरा एआय डायग्नोसिस:**\n\nतुमची समस्या मी समजून घेतली आहे: *"${userText}"*.\n\n**मार्गदर्शन व पुढील पावले:**\n1. उपकरणाचा मुख्य वीज किंवा पाणी पुरवठा सुरक्षित असल्याची खात्री करा.\n2. किरकोळ बिघाड असल्यास उपकरणाची जोडणी व स्वच्छता तपासून पहा.\n3. सुरक्षित आणि दर्जेदार दुरुस्तीसाठी फिक्सोराचे व्हेरिफाइड तज्ज्ञ तुमच्या भागात उपलब्ध आहेत. तुम्ही खालील बटनावरून थेट योग्य टेक्निशियन निवडू शकता!`,
        category: 'Services',
        safeOutcome: true,
        diySteps: [
          'उपकरणाचे कनेक्शन व स्विच तपासा',
          'धोकादायक असल्यास स्वतः दुरुस्त करू नका',
          'योग्य सेवा विभागातून तज्ज्ञ बुक करा'
        ]
      };
    } else if (lang === 'hi') {
      return {
        reply: `🔧 **फिक्सोरा एआई समाधान:**\n\nआपकी समस्या: *"${userText}"*.\n\n**समाधान एवं सुझाव:**\n1. सबसे पहले सुरक्षा की जांच करें कि उपकरण से कोई रिसाव या चिंगारी तो नहीं आ रही।\n2. बेसिक कनेक्शन और स्विच बोर्ड रीसेट करके देखें।\n3. पक्की और सुरक्षित मरम्मत के लिए हमारे सत्यापित विशेषज्ञ तकनीशियन उपलब्ध हैं।`,
        category: 'Services',
        safeOutcome: true,
        diySteps: [
          'पावर सप्लाई और प्लग चेक करें',
          'सुरक्षा नियमों का पालन करें',
          'जरूरत पड़ने पर तकनीशियन बुक करें'
        ]
      };
    } else {
      return {
        reply: `🔧 **Fixora AI Smart Diagnostic Assessment:**\n\nRegarding your request: *"${userText}"*.\n\n**Assessment & Recommendations:**\n1. Ensure the equipment power switch and breaker line are intact.\n2. Inspect visible connections for loose fittings or blockages.\n3. If physical dismantling or specialized tools are required, book one of our verified local partners below for transparent, upfront pricing.`,
        category: 'Services',
        safeOutcome: true,
        diySteps: [
          'Inspect wall outlet & main circuit',
          'Clear any visible obstruction',
          'Connect with verified Fixora professional'
        ]
      };
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    // Simulate AI processing delay like ChatGPT
    setTimeout(() => {
      const aiResult = generateAIResponse(query);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSafetyWarning: aiResult.isSafetyWarning,
        categorySuggestion: aiResult.category,
        diySteps: aiResult.diySteps,
        safeOutcome: aiResult.safeOutcome
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      if (aiResult.safeOutcome) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    }, 700);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: 'संभाषण रीसेट केले आहे. मला तुमची नवीन समस्या कोणत्याही भाषेत सांगा!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header with Language Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 dark:text-white">
                Fixora AI Diagnostician
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                ChatGPT Mode
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              बोलून किंवा टाईप करून विचारा • मराठी, हिंदी, English सपोर्ट
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setSelectedLang('auto')}
              className={`px-2 py-1 rounded-lg font-semibold transition ${selectedLang === 'auto' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500'}`}
            >
              Auto
            </button>
            <button
              onClick={() => setSelectedLang('mr')}
              className={`px-2 py-1 rounded-lg font-semibold transition ${selectedLang === 'mr' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500'}`}
            >
              मराठी
            </button>
            <button
              onClick={() => setSelectedLang('hi')}
              className={`px-2 py-1 rounded-lg font-semibold transition ${selectedLang === 'hi' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500'}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setSelectedLang('en')}
              className={`px-2 py-1 rounded-lg font-semibold transition ${selectedLang === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">उदाहरणे:</span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(qp.label)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/60 dark:border-slate-700 transition shadow-2xs"
          >
            <span>{qp.icon}</span>
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="glass-card border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 min-h-[460px] max-h-[580px] overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-xs shadow-md'
                  : msg.isSafetyWarning
                  ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-slate-900 dark:text-white rounded-tl-xs'
                  : 'bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </div>

              {/* DIY Steps List */}
              {msg.diySteps && msg.diySteps.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    मार्गदर्शक कृती (Action Steps):
                  </div>
                  {msg.diySteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Book Technician Action Button if problem requires expert */}
              {msg.categorySuggestion && (
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigate(`/technicians?diagnosis=${encodeURIComponent(msg.text.slice(0, 100))}`)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition ${
                      msg.isSafetyWarning
                        ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/30'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{msg.categorySuggestion} तज्ज्ञ बुक करा →</span>
                  </button>
                  <span className="text-[10px] text-slate-400">
                    Fixora Certified • Upfront Pricing
                  </span>
                </div>
              )}

              <div className={`text-[10px] text-right ${msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0 shadow-md">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-slate-400 font-medium ml-1">Fixora AI विचार करत आहे...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-2 sm:p-3 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-lg flex items-center gap-2">
        <button
          onClick={handleVoiceInput}
          type="button"
          className={`p-3 rounded-2xl transition ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600'
          }`}
          title={isListening ? 'Listening... Speak now' : 'Voice Input (बोलून सांगा)'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="घरातील कोणतीही अडचण मराठी, हिंदी किंवा इंग्लिशमध्ये टाईप करा..."
          className="flex-1 bg-transparent px-2 py-3 text-sm focus:outline-none text-slate-900 dark:text-white placeholder-slate-400"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputPrompt.trim()}
          type="button"
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-500/25 transition"
        >
          <span>पाठवा</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Assurance Footer */}
      <div className="flex items-center justify-center gap-4 text-xs text-slate-400 text-center">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Safe Non-Hazardous DIY Guidance
        </span>
        <span>•</span>
        <span>Verified Local Pune Technicians</span>
      </div>

    </div>
  );
};
