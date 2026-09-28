/**
 * Finance SEO Generator
 * Generates viral, high-ranking YouTube Shorts SEO metadata:
 * - Clicky, high-retention Titles (< 100 characters with emojis & #shorts)
 * - Rich SEO Descriptions with timestamps, bullet summaries, keywords, hashtags & disclaimer
 * - 25+ High-Volume Search Tags (< 500 characters)
 * - Category, Language, and MadeForKids flags
 */

function generateFinanceSEO(topic) {
  const serial = topic.paddedNumber || String(topic.serialNumber).padStart(4, '0');
  const headline = topic.headline || 'अमीर बनने का गुप्त फॉर्मूला';
  const englishTitle = topic.title || 'Finance Secret';

  // 1. Viral Clicky Title (< 100 chars, optimized for YouTube Shorts algorithm)
  // Hook + Hindi Headline + English Keyword + #shorts
  let rawTitle = `अमीर बनना है तो ये करो! 💰 ${headline} #${serial} #shorts`;
  if (rawTitle.length > 95) {
    rawTitle = `अमीर बनना है तो ये करो! 💰 ${headline} #shorts`;
  }
  if (rawTitle.length > 95) {
    rawTitle = `${headline} - अमीर बनने का फॉर्मूला! 💰 #shorts`;
  }
  const title = rawTitle.slice(0, 100);

  // 2. High-Converting SEO Description
  const stepsScene = (topic.scenes || []).find(s => s.layout === 'steps' || s.step1);
  const formulaScene = (topic.scenes || []).find(s => s.layout === 'formula' || s.formulaSummary);
  const wealthScene = (topic.scenes || []).find(s => s.layout === 'wealth_result' || s.wealthStat);

  const step1 = topic.step1 || stepsScene?.step1;
  const step2 = topic.step2 || stepsScene?.step2;
  const step3 = topic.step3 || stepsScene?.step3;
  const formulaSummary = topic.formulaSummary || formulaScene?.formulaSummary;
  const wealthStat = topic.wealthStat || wealthScene?.wealthStat;
  const compoundGain = topic.compoundGain || wealthScene?.compoundGain;

  const stepsList = [];
  if (step1 && step1.title) stepsList.push(`1️⃣ ${step1.title}: ${step1.desc || ''}`);
  if (step2 && step2.title) stepsList.push(`2️⃣ ${step2.title}: ${step2.desc || ''}`);
  if (step3 && step3.title) stepsList.push(`3️⃣ ${step3.title}: ${step3.desc || ''}`);

  const bulletsSection = stepsList.length > 0
    ? `\n🔥 इस वीडियो में क्या सीखोगे:\n${stepsList.join('\n')}\n`
    : '';

  const formulaLine = formulaSummary ? `💡 फॉर्मूला: ${formulaSummary}\n` : '';
  const resultLine = wealthStat ? `🏆 रिजल्ट: ${wealthStat} (${compoundGain || ''})\n` : '';

  const description = `अमीर बनना है तो ये करो! आज के इस 30 सेकंड के वीडियो में जानिए: "${headline}" (${englishTitle}) का पूरा गणित और सीक्रेट फॉर्मूला। 
${bulletsSection}${formulaLine}${resultLine}
📌 अगर आप भी फाइनेंशियल फ्रीडम (Financial Freedom) पाना चाहते हैं, अपनी सैलरी से अमीर बनना चाहते हैं और सही जगह निवेश करना चाहते हैं, तो अभी सब्सक्राइब करें!

━━━━━━━━━━━━━━━━━━━━━
🔍 RELATED SEARCH TOPICS:
• How to get rich in India / अमीर कैसे बनें
• Personal Finance tips in Hindi
• SIP Investment for beginners
• Paise kaise bachaye aur invest kare
• Salary budgeting rules (50-30-20 rule)
• Mutual funds compounding power
• Stock market basics for beginners
━━━━━━━━━━━━━━━━━━━━━

#Shorts #Finance #PersonalFinance #MoneyTips #Investing #MutualFunds #StockMarketIndia #HindiFinance #FinancialFreedom #WealthMindset #SIP #Paisa #AmeerBano

⚠️ DISCLAIMER:
यह वीडियो केवल वित्तीय साक्षरता और शैक्षणिक (Educational) उद्देश्यों के लिए है। किसी भी प्रकार के निवेश से पहले अपने प्रमाणित वित्तीय सलाहकार (SEBI Registered Advisor) से परामर्श अवश्य लें।`;

  // 3. High-Ranking Search Tags (< 500 characters limit on YouTube)
  const baseTags = [
    'shorts',
    'youtube shorts',
    'finance shorts',
    'personal finance hindi',
    'paise kaise bachaye',
    'ameer kaise bane',
    'sip investment in hindi',
    'mutual funds for beginners',
    'how to invest money',
    'money saving tips',
    'financial freedom',
    'stock market hindi',
    'wealth mindset',
    'compound interest hindi',
    'salary budgeting',
    'hindi finance video',
    englishTitle.toLowerCase(),
    headline.toLowerCase().replace(/[^\w\s\u0900-\u097F]/gi, '').trim()
  ];

  // Remove duplicates and enforce 500 characters ceiling
  const uniqueTags = Array.from(new Set(baseTags.filter(Boolean)));
  const finalTags = [];
  let totalChars = 0;
  for (const tag of uniqueTags) {
    if (totalChars + tag.length + 1 <= 480) {
      finalTags.push(tag);
      totalChars += tag.length + 1;
    }
  }

  return {
    title,
    description,
    tags: finalTags,
    categoryId: '27', // Education
    defaultLanguage: 'hi',
    defaultAudioLanguage: 'hi',
    privacyStatus: process.env.YOUTUBE_PRIVACY_STATUS || 'public',
    selfDeclaredMadeForKids: false,
    embeddable: true,
    license: 'youtube'
  };
}

module.exports = { generateFinanceSEO };
