import type { SupportedLanguage } from "./types";

type TranslationKey =
  | "appName"
  | "tagline"
  | "placeholder"
  | "send"
  | "newChat"
  | "context"
  | "cropName"
  | "country"
  | "state"
  | "district"
  | "locality"
  | "soilType"
  | "waterAvailability"
  | "growthStage"
  | "low"
  | "medium"
  | "high"
  | "unknown"
  | "planning"
  | "sowing"
  | "vegetative"
  | "flowering"
  | "fruiting"
  | "harvesting"
  | "language"
  | "english"
  | "hindi"
  | "telugu"
  | "disclaimer"
  | "retry"
  | "errorGeneric"
  | "emptyChat"
  | "emptyChatSub"
  | "possibleCauses"
  | "recommendations"
  | "precautions"
  | "followUp"
  | "expertAdvice"
  | "about"
  | "home"
  | "aboutTitle"
  | "aboutDesc"
  | "aboutPurpose"
  | "aboutCategories"
  | "aboutLanguages"
  | "aboutLimitations"
  | "aboutExpertReminder"
  | "notFound"
  | "notFoundDesc"
  | "goHome"
  | "contextToggle"
  | "contextHide"
  | "exampleQuestions"
  | "clearChat";

const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  en: {
    appName: "KrishiMitra AI",
    tagline: "Your AI assistant for smarter farming",
    placeholder: "Ask your farming question...",
    send: "Send",
    newChat: "New Chat",
    context: "Farming Context",
    cropName: "Crop Name",
    country: "Country",
    state: "State / Region",
    district: "District",
    locality: "Village / Locality",
    soilType: "Soil Type",
    waterAvailability: "Water Availability",
    growthStage: "Growth Stage",
    low: "Low",
    medium: "Medium",
    high: "High",
    unknown: "Unknown",
    planning: "Planning",
    sowing: "Sowing",
    vegetative: "Vegetative",
    flowering: "Flowering",
    fruiting: "Fruiting",
    harvesting: "Harvesting",
    language: "Language",
    english: "English",
    hindi: "हिन्दी",
    telugu: "తెలుగు",
    disclaimer:
      "⚠️ KrishiMitra AI provides general agricultural guidance only. Always consult local agricultural experts for critical decisions.",
    retry: "Retry",
    errorGeneric: "Something went wrong. Please try again.",
    emptyChat: "Welcome to KrishiMitra AI! 🌾",
    emptyChatSub: "Ask any farming question to get started. Try one of the examples below.",
    possibleCauses: "Possible Causes",
    recommendations: "Recommendations",
    precautions: "⚠️ Precautions",
    followUp: "Follow-up Questions",
    expertAdvice: "🔬 Expert consultation recommended for this topic.",
    about: "About",
    home: "Home",
    aboutTitle: "About KrishiMitra AI",
    aboutDesc:
      "KrishiMitra AI is an AI-powered agricultural advisory assistant that helps farmers, students, and agricultural beginners access practical farming guidance through a simple conversational interface.",
    aboutPurpose:
      "Our mission is to make agricultural information more accessible by providing clear, context-aware, and safety-conscious guidance.",
    aboutCategories:
      "Crop selection, soil management, seed selection, irrigation, nutrient management, pest management, plant diseases, weather precautions, harvesting, and sustainable farming.",
    aboutLanguages: "English, Hindi (हिन्दी), and Telugu (తెలుగు).",
    aboutLimitations:
      "KrishiMitra AI provides general guidance based on agricultural knowledge. It does not have access to live weather data, soil test results, or local market prices. AI-generated advice should never be treated as a substitute for professional agricultural expertise.",
    aboutExpertReminder:
      "For high-risk decisions involving chemicals, disease management, or significant investment, always consult a qualified local agricultural expert.",
    notFound: "Page Not Found",
    notFoundDesc: "The page you're looking for doesn't exist.",
    goHome: "Go to KrishiMitra AI",
    contextToggle: "📋 Set Farming Context",
    contextHide: "Hide Context",
    exampleQuestions: "Try asking:",
    clearChat: "Clear Chat",
  },
  hi: {
    appName: "कृषिमित्र AI",
    tagline: "स्मार्ट खेती के लिए आपका AI सहायक",
    placeholder: "अपना कृषि प्रश्न पूछें...",
    send: "भेजें",
    newChat: "नई बातचीत",
    context: "खेती का संदर्भ",
    cropName: "फसल का नाम",
    country: "देश",
    state: "राज्य / क्षेत्र",
    district: "जिला",
    locality: "गाँव / स्थान",
    soilType: "मिट्टी का प्रकार",
    waterAvailability: "पानी की उपलब्धता",
    growthStage: "विकास चरण",
    low: "कम",
    medium: "मध्यम",
    high: "अधिक",
    unknown: "अज्ञात",
    planning: "योजना",
    sowing: "बुवाई",
    vegetative: "वानस्पतिक",
    flowering: "फूल आना",
    fruiting: "फल आना",
    harvesting: "कटाई",
    language: "भाषा",
    english: "English",
    hindi: "हिन्दी",
    telugu: "తెలుగు",
    disclaimer:
      "⚠️ कृषिमित्र AI केवल सामान्य कृषि मार्गदर्शन प्रदान करता है। महत्वपूर्ण निर्णयों के लिए हमेशा स्थानीय कृषि विशेषज्ञों से परामर्श करें।",
    retry: "पुनः प्रयास",
    errorGeneric: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    emptyChat: "कृषिमित्र AI में आपका स्वागत है! 🌾",
    emptyChatSub: "शुरू करने के लिए कोई भी कृषि प्रश्न पूछें। नीचे दिए गए उदाहरण आज़माएँ।",
    possibleCauses: "संभावित कारण",
    recommendations: "सिफारिशें",
    precautions: "⚠️ सावधानियां",
    followUp: "अनुवर्ती प्रश्न",
    expertAdvice: "🔬 इस विषय के लिए विशेषज्ञ परामर्श की सिफारिश की जाती है।",
    about: "के बारे में",
    home: "होम",
    aboutTitle: "कृषिमित्र AI के बारे में",
    aboutDesc:
      "कृषिमित्र AI एक AI-संचालित कृषि सलाहकार सहायक है जो किसानों, छात्रों और कृषि शुरुआती लोगों को सरल बातचीत इंटरफ़ेस के माध्यम से व्यावहारिक कृषि मार्गदर्शन प्रदान करता है।",
    aboutPurpose:
      "हमारा मिशन स्पष्ट, संदर्भ-जागरूक और सुरक्षा-सचेत मार्गदर्शन प्रदान करके कृषि जानकारी को अधिक सुलभ बनाना है।",
    aboutCategories:
      "फसल चयन, मिट्टी प्रबंधन, बीज चयन, सिंचाई, पोषक तत्व प्रबंधन, कीट प्रबंधन, पौधों के रोग, मौसम सावधानियां, कटाई, और टिकाऊ खेती।",
    aboutLanguages: "अंग्रेजी (English), हिन्दी, और तेलुगु (తెలుగు)।",
    aboutLimitations:
      "कृषिमित्र AI कृषि ज्ञान पर आधारित सामान्य मार्गदर्शन प्रदान करता है। इसकी लाइव मौसम डेटा, मिट्टी परीक्षण परिणामों या स्थानीय बाजार कीमतों तक पहुँच नहीं है।",
    aboutExpertReminder:
      "रसायनों, रोग प्रबंधन या महत्वपूर्ण निवेश से जुड़े उच्च-जोखिम वाले निर्णयों के लिए, हमेशा एक योग्य स्थानीय कृषि विशेषज्ञ से परामर्श करें।",
    notFound: "पेज नहीं मिला",
    notFoundDesc: "आप जो पेज खोज रहे हैं वह मौजूद नहीं है।",
    goHome: "कृषिमित्र AI पर जाएं",
    contextToggle: "📋 खेती का संदर्भ सेट करें",
    contextHide: "संदर्भ छुपाएं",
    exampleQuestions: "यह पूछकर देखें:",
    clearChat: "चैट साफ़ करें",
  },
  te: {
    appName: "కృషిమిత్ర AI",
    tagline: "తెలివైన వ్యవసాయం కోసం మీ AI సహాయకుడు",
    placeholder: "మీ వ్యవసాయ ప్రశ్న అడగండి...",
    send: "పంపండి",
    newChat: "కొత్త చాట్",
    context: "వ్యవసాయ సందర్భం",
    cropName: "పంట పేరు",
    country: "దేశం",
    state: "రాష్ట్రం / ప్రాంతం",
    district: "జిల్లా",
    locality: "గ్రామం / ప్రాంతం",
    soilType: "నేల రకం",
    waterAvailability: "నీటి లభ్యత",
    growthStage: "పెరుగుదల దశ",
    low: "తక్కువ",
    medium: "మధ్యస్థం",
    high: "ఎక్కువ",
    unknown: "తెలియదు",
    planning: "ప్రణాళిక",
    sowing: "విత్తనం",
    vegetative: "వృక్షసంబంధ",
    flowering: "పూత",
    fruiting: "కాయ",
    harvesting: "కోత",
    language: "భాష",
    english: "English",
    hindi: "हिन्दी",
    telugu: "తెలుగు",
    disclaimer:
      "⚠️ కృషిమిత్ర AI సాధారణ వ్యవసాయ మార్గదర్శకత్వం మాత్రమే అందిస్తుంది. కీలక నిర్ణయాల కోసం ఎల్లప్పుడూ స్థానిక వ్యవసాయ నిపుణులను సంప్రదించండి.",
    retry: "మళ్ళీ ప్రయత్నించండి",
    errorGeneric: "ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    emptyChat: "కృషిమిత్ర AI కి స్వాగతం! 🌾",
    emptyChatSub: "ప్రారంభించడానికి ఏదైనా వ్యవసాయ ప్రశ్న అడగండి. దిగువ ఉదాహరణలను ప్రయత్నించండి.",
    possibleCauses: "సంభావ్య కారణాలు",
    recommendations: "సిఫారసులు",
    precautions: "⚠️ జాగ్రత్తలు",
    followUp: "ఫాలో-అప్ ప్రశ్నలు",
    expertAdvice: "🔬 ఈ అంశం కోసం నిపుణుల సంప్రదింపు సిఫార్సు చేయబడింది.",
    about: "గురించి",
    home: "హోమ్",
    aboutTitle: "కృషిమిత్ర AI గురించి",
    aboutDesc:
      "కృషిమిత్ర AI అనేది AI-ఆధారిత వ్యవసాయ సలహా సహాయకుడు, ఇది రైతులు, విద్యార్థులు మరియు వ్యవసాయ ప్రారంభకులకు సరళమైన సంభాషణ ఇంటర్‌ఫేస్ ద్వారా ఆచరణాత్మక వ్యవసాయ మార్గదర్శకత్వం అందిస్తుంది.",
    aboutPurpose:
      "స్పష్టమైన, సందర్భ-అవగాహన మరియు భద్రత-స్పృహ మార్గదర్శకత్వం అందించడం ద్వారా వ్యవసాయ సమాచారాన్ని మరింత అందుబాటులోకి తీసుకురావడం మా లక్ష్యం.",
    aboutCategories:
      "పంట ఎంపిక, నేల నిర్వహణ, విత్తన ఎంపిక, నీటిపారుదల, పోషక నిర్వహణ, పురుగుల నిర్వహణ, మొక్కల వ్యాధులు, వాతావరణ జాగ్రత్తలు, కోత, మరియు స్థిరమైన వ్యవసాయం.",
    aboutLanguages: "ఆంగ్లం (English), హిందీ (हिन्दी), మరియు తెలుగు.",
    aboutLimitations:
      "కృషిమిత్ర AI వ్యవసాయ జ్ఞానం ఆధారంగా సాధారణ మార్గదర్శకత్వం అందిస్తుంది. దీనికి ప్రత్యక్ష వాతావరణ డేటా, నేల పరీక్ష ఫలితాలు లేదా స్థానిక మార్కెట్ ధరలకు ప్రాప్యత లేదు.",
    aboutExpertReminder:
      "రసాయనాలు, వ్యాధి నిర్వహణ లేదా ముఖ్యమైన పెట్టుబడికి సంబంధించిన అధిక-ప్రమాద నిర్ణయాల కోసం, ఎల్లప్పుడూ అర్హత కలిగిన స్థానిక వ్యవసాయ నిపుణులను సంప్రదించండి.",
    notFound: "పేజీ కనుగొనబడలేదు",
    notFoundDesc: "మీరు వెతుకుతున్న పేజీ ఉనికిలో లేదు.",
    goHome: "కృషిమిత్ర AI కి వెళ్ళండి",
    contextToggle: "📋 వ్యవసాయ సందర్భం సెట్ చేయండి",
    contextHide: "సందర్భం దాచండి",
    exampleQuestions: "ఇది అడిగి చూడండి:",
    clearChat: "చాట్ క్లియర్ చేయండి",
  },
};

export function t(key: TranslationKey, lang: SupportedLanguage): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

export const exampleQuestions: Record<SupportedLanguage, string[]> = {
  en: [
    "My tomato plants have yellow leaves. What should I do?",
    "Which crops are best for the winter season?",
    "How can I improve soil health naturally?",
    "What is the best irrigation method for chilli plants?",
    "How to manage aphids without chemicals?",
  ],
  hi: [
    "मेरे टमाटर के पौधों की पत्तियां पीली हो रही हैं। क्या करूं?",
    "सर्दियों के मौसम के लिए कौन सी फसलें अच्छी हैं?",
    "मिट्टी की सेहत प्राकृतिक रूप से कैसे सुधारें?",
    "मिर्च के पौधों के लिए सबसे अच्छी सिंचाई विधि क्या है?",
    "बिना रसायनों के माहू कीट का प्रबंधन कैसे करें?",
  ],
  te: [
    "నా టమాటా మొక్కల ఆకులు పసుపు రంగుకు మారుతున్నాయి. ఏమి చేయాలి?",
    "శీతాకాలానికి ఏ పంటలు అనుకూలం?",
    "నేల ఆరోగ్యాన్ని సహజంగా ఎలా మెరుగుపరచవచ్చు?",
    "మిరప మొక్కలకు ఉత్తమ నీటిపారుదల పద్ధతి ఏమిటి?",
    "రసాయనాలు లేకుండా పేనుపురుగులను ఎలా నిర్వహించాలి?",
  ],
};
