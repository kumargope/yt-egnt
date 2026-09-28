/**
 * 6-Scene High-Retention Finance Video Topics
 * Opening Hook: DIRECT PUNCHY START -> "अमीर बनना है? तो ये करो!" (Fast speed, NO "रुको!")
 * Pacing:
 * Scene 1 (0-5s):  FAST SPEED (+24%) • DIRECT HOOK ("अमीर बनना है? तो ये करो!")
 * Scene 2 (5-10s): FAST SPEED (+18%) • THE PROBLEM / TRAP
 * Scene 3 (10-18s): NORMAL SPEED (+0%) • THE SOLUTION / CORE CONCEPT
 * Scene 4 (18-25s): NORMAL SPEED (+0%) • STEP-BY-STEP ACTIONABLE GYAN
 * Scene 5 (25-31s): NORMAL SPEED (+0%) • COMPOUNDING WEALTH RESULT
 * Scene 6 (31-36s): ENERGETIC (+5%) • CALL TO ACTION (LIKE & SUBSCRIBE)
 */

const FINANCE_TOPICS = [
  {
    id: '50-30-20-rule',
    title: '50-30-20 Money Rule',
    headline: 'पैसे बचाने और अमीर बनने का 50-30-20 रूल',
    scenes: [
      {
        speedRate: '+24%',
        audio: 'अमीर बनना है? तो ये करो! अपनी सैलरी आते ही पहले पांच दिनों में उड़ाना तुरंत बंद करो!',
        caption: 'अमीर बनना है? तो ये करो! सैलरी आते ही उड़ाना बंद करो!',
        highlight: 'अमीर बनना है? तो ये करो!',
        visualTitle: 'सैलरी का सही इस्तेमाल',
        visualDetail: '🔥 पहला कदम: फिजूलखर्ची बंद!\n💸 1st तारीख को अमीर, 5th को खाली हाथ नहीं\n👀 अगले 30 सेकंड में समझें अमीर बनने का फॉर्मूला',
        icon: '🚀',
        badge: '🔥 अमीर बनना है? ये करो!',
        theme: { bg1: '#260a0f', bg2: '#0d0204', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.35)', border: '#f87171' }
      },
      {
        speedRate: '+18%',
        audio: 'ज्यादातर लोग कमाते तो बहुत हैं, लेकिन महीने के आखिर में जेब खाली हो जाती है क्योंकि कोई बजट नहीं होता!',
        caption: 'ज्यादातर लोग कमाते हैं, पर महीने के आखिर में जेब खाली हो जाती है!',
        highlight: 'महीने के अंत में जेब खाली',
        visualTitle: 'बिना बजट की ज़िंदगी = कर्ज़ का जाल',
        visualDetail: '❌ दिखावे के चक्कर में भारी खर्चे\n❌ बचत के नाम पर बैंक में जीरो बैलेंस\n❌ महीने के अंत में दोस्तों से उधार',
        icon: '💸',
        badge: '💸 THE TRAP • 5-10s',
        theme: { bg1: '#241006', bg2: '#0d0502', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.3)', border: '#fb923c' }
      },
      {
        speedRate: '+0%',
        audio: 'तो आज ही अपनी जिंदगी में पचास तीस बीस का गोल्डन रूल लागू करो। यह रूल दुनिया के सबसे अमीर लोगों का सीक्रेट है।',
        caption: 'तो आज ही अपनाओ 50-30-20 का गोल्डन रूल!',
        highlight: '50-30-20 गोल्डन फॉर्मूला',
        visualTitle: 'अमीर बनने का 50-30-20 ब्लूप्रिंट',
        visualDetail: '🏠 50% = बुनियादी ज़रूरतें (Needs)\n🍿 30% = शौक और लाइफस्टाइल (Wants)\n📈 20% = तुरंत इन्वेस्टमेंट (Wealth)',
        icon: '💡',
        badge: '💡 THE SOLUTION • 10-18s',
        theme: { bg1: '#1c1706', bg2: '#0a0802', accent: '#facc15', glow: 'rgba(250, 204, 21, 0.3)', border: '#fde047' }
      },
      {
        speedRate: '+0%',
        audio: 'पचास परसेंट पैसा मकान किराया, राशन और बिल्स पर रखो। तीस परसेंट शौक और पार्टी के लिए। और बीस परसेंट सीधे एसआईपी में लगाओ।',
        caption: '50% मकान-राशन, 30% शौक, और 20% तुरंत SIP में लगाओ!',
        highlight: '20% तुरंत SIP में लगाओ',
        visualTitle: 'सैलरी का सही बंटवारा',
        visualDetail: '🏠 50% Needs: घर का किराया, राशन, बिजली बिल\n🍿 30% Wants: बाहर खाना, मूवीज, शॉपिंग\n🚀 20% Investment: इंडेक्स फंड और शेयर मार्केट',
        icon: '📊',
        badge: '📊 BREAKDOWN • 18-25s',
        theme: { bg1: '#071824', bg2: '#02090f', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.3)', border: '#0284c7' }
      },
      {
        speedRate: '+0%',
        audio: 'यही बीस परसेंट की छोटी सी बचत कम्पाउंडिंग की ताकत से पंद्रह साल में आपको एक करोड़पति बना देगी!',
        caption: 'यही 20% पैसा कम्पाउंडिंग से 15 साल में आपको करोड़पति बना देगा!',
        highlight: '15 साल में बनाएगा करोड़पति',
        visualTitle: '20% SIP = करोड़पति का सफर',
        visualDetail: '💰 हर महीने सिर्फ ₹5,000 की SIP\n🔥 कम्पाउंडिंग का जादू: ब्याज पर ब्याज\n🏆 15-20 साल बाद ₹1.5 Crore+ का फंड!',
        icon: '🏆',
        badge: '🚀 WEALTH RESULT • 25-31s',
        theme: { bg1: '#052214', bg2: '#010d07', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.35)', border: '#34d399' }
      },
      {
        speedRate: '+5%',
        audio: 'अगर यह जानकारी अच्छी लगी, तो अभी वीडियो को लाइक करें, और ऐसी ही अमीर बनने वाली टिप्स के लिए चैनल को सब्सक्राइब करें!',
        caption: 'वीडियो को तुरंत LIKE करें और चैनल को SUBSCRIBE करें!',
        highlight: '🔔 LIKE करें & SUBSCRIBE करें!',
        visualTitle: 'JOIN THE WEALTH FAMILY',
        visualDetail: '👍 वीडियो को Like करके सेव कर लें\n🔔 Subscribe करें और बेल आइकन दबाएं\n❤️ अपने दोस्तों और परिवार के साथ शेयर करें',
        icon: '🔔',
        badge: '⭐ LIKE & SUBSCRIBE • OUTRO',
        theme: { bg1: '#260a0f', bg2: '#0d0204', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', border: '#f87171' }
      }
    ]
  },
  {
    id: 'power-of-compounding',
    title: 'The Magic of Compounding',
    headline: 'कम्पाउंडिंग: दुनिया का 8वां अजूबा',
    scenes: [
      {
        speedRate: '+24%',
        audio: 'अमीर बनना है? तो ये करो! आज से ही सिर्फ पांच हज़ार रुपये बचाकर डेढ़ करोड़ कमाने का ये सीक्रेट समझो!',
        caption: 'अमीर बनना है? तो ये करो! ₹5,000 से ₹1.5 करोड़ का सीक्रेट!',
        highlight: 'अमीर बनना है? तो ये करो!',
        visualTitle: 'अमीर बनने का 8वां अजूबा',
        visualDetail: '🔥 सिर्फ ₹5,000 महीना बचाकर डेढ़ करोड़!\n⚡ आइंस्टीन का 8वां अजूबा (Compounding)\n👀 30 सेकंड में समझें पूरा गणित',
        icon: '🚀',
        badge: '🔥 अमीर बनना है? ये करो!',
        theme: { bg1: '#260a0f', bg2: '#0d0204', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.35)', border: '#f87171' }
      },
      {
        speedRate: '+18%',
        audio: 'निन्यानवे परसेंट लोग अपनी मेहनत की कमाई को बैंक में सड़ा देते हैं, और कम्पाउंडिंग की ताकत को कभी समझ ही नहीं पाते!',
        caption: '99% लोग अपनी कमाई बैंक में सड़ा देते हैं और गरीब रह जाते हैं!',
        highlight: '99% लोग बैंक में पैसा सड़ाते हैं',
        visualTitle: 'बैंक में पैसा = हर दिन नुकसान',
        visualDetail: '📉 बैंक FD ब्याज: सिर्फ 6.5%\n🔥 महंगाई (Inflation): 6.0%\n❌ 10 साल बाद भी पैसा वहीं का वहीं!',
        icon: '📉',
        badge: '💸 THE TRAP • 5-10s',
        theme: { bg1: '#241006', bg2: '#0d0502', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.3)', border: '#fb923c' }
      },
      {
        speedRate: '+0%',
        audio: 'कम्पाउंडिंग का मतलब है ब्याज पर भी ब्याज मिलना। जब आपका कमाया हुआ पैसा खुद आपके लिए नए पैसे कमा कर लाता है।',
        caption: 'Compounding का मतलब: ब्याज पर भी ब्याज मिलना!',
        highlight: 'ब्याज पर भी ब्याज',
        visualTitle: 'The 8th Wonder of World',
        visualDetail: '⚙️ एक्टिव जॉब: 8 घंटे मेहनत = सीमित आय\n⚡ कम्पाउंडिंग: 24 घंटे सातों दिन पैसा बढ़ता है\n😴 सोते समय भी आपकी संपत्ति बढ़ती है',
        icon: '🧠',
        badge: '💡 THE SOLUTION • 10-18s',
        theme: { bg1: '#1c1706', bg2: '#0a0802', accent: '#facc15', glow: 'rgba(250, 204, 21, 0.3)', border: '#fde047' }
      },
      {
        speedRate: '+0%',
        audio: 'अगर आप बीस साल की उम्र से सिर्फ पांच हज़ार रुपये इंडेक्स फंड में लगाते हो, तो पच्चीस साल में आपका कुल निवेश होगा सिर्फ पंद्रह लाख।',
        caption: '25 साल में आपका कुल निवेश होगा सिर्फ ₹15 लाख रुपये!',
        highlight: 'सिर्फ ₹15 लाख का निवेश',
        visualTitle: 'गणित जो कोई नहीं सिखाता',
        visualDetail: '💵 ₹166 प्रतिदिन की छोटी सी बचत\n📅 ₹5,000 प्रति माह नियमित निवेश\n💎 25 साल में कुल निवेश: ₹15,00,000',
        icon: '💵',
        badge: '📊 BREAKDOWN • 18-25s',
        theme: { bg1: '#071824', bg2: '#02090f', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.3)', border: '#0284c7' }
      },
      {
        speedRate: '+0%',
        audio: 'लेकिन पंद्रह परसेंट रिटर्न के साथ, आपको मिलेंगे डेढ़ करोड़ रुपये! यानी एक करोड़ पैंतीस लाख सिर्फ फ्री का ब्याज!',
        caption: 'लेकिन आपको मिलेंगे ₹1.5 करोड़! ₹1.35 करोड़ सिर्फ फ्री का ब्याज!',
        highlight: '₹1.35 करोड़ का शुद्ध मुनाफा!',
        visualTitle: 'जादुई परिणाम: ₹1.5 Crore!',
        visualDetail: '💰 आपका पैसा: ₹15 लाख\n🔥 कम्पाउंडिंग का रिटर्न: ₹1.35 करोड़!\n🏆 कुल संपत्ति: ₹1,50,00,000+',
        icon: '🏆',
        badge: '🚀 WEALTH RESULT • 25-31s',
        theme: { bg1: '#052214', bg2: '#010d07', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.35)', border: '#34d399' }
      },
      {
        speedRate: '+5%',
        audio: 'अगर यह सीक्रेट पसंद आया, तो अभी वीडियो को लाइक करें, और ऐसी ही अमीर बनने वाली टिप्स के लिए चैनल को तुरंत सब्सक्राइब करें!',
        caption: 'वीडियो को तुरंत LIKE करें और चैनल को SUBSCRIBE करें!',
        highlight: '🔔 LIKE करें & SUBSCRIBE करें!',
        visualTitle: 'JOIN THE WEALTH FAMILY',
        visualDetail: '👍 वीडियो को Like करके सेव कर लें\n🔔 Subscribe करें और बेल आइकन दबाएं\n❤️ अपने दोस्तों के साथ शेयर करें',
        icon: '🔔',
        badge: '⭐ LIKE & SUBSCRIBE • OUTRO',
        theme: { bg1: '#260a0f', bg2: '#0d0204', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', border: '#f87171' }
      }
    ]
  },
  {
    id: 'sip-vs-fd',
    title: 'SIP vs Fixed Deposit (FD)',
    headline: 'बैंक FD में पैसा लगाना भारी बेवकूफी क्यों है?',
    scenes: [
      {
        speedRate: '+24%',
        audio: 'अमीर बनना है? तो ये करो! बैंक की एफडी में पैसा सड़ाना बंद करो और इस एक जगह पैसा लगाना शुरू करो!',
        caption: 'अमीर बनना है? तो ये करो! बैंक FD छोड़ो और यहाँ पैसा लगाओ!',
        highlight: 'अमीर बनना है? तो ये करो!',
        visualTitle: 'FD छोड़ो, अमीर बनो',
        visualDetail: '🔥 बैंक FD में पैसा हर दिन घट रहा है\n⚡ इंडेक्स फंड और SIP की असली ताकत\n👀 30 सेकंड में समझें असली गणित',
        icon: '🚀',
        badge: '🔥 अमीर बनना है? ये करो!',
        theme: { bg1: '#260a0f', bg2: '#0d0204', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.35)', border: '#f87171' }
      },
      {
        speedRate: '+18%',
        audio: 'बैंक आपको एफडी पर सिर्फ छह परसेंट ब्याज देता है, और देश में महंगाई भी छह परसेंट की रफ्तार से बढ़ रही है!',
        caption: 'बैंक FD देता है 6% ब्याज, और महंगाई भी 6% से सब खा जाती है!',
        highlight: 'महंगाई सब खा जाती है',
        visualTitle: 'असली रिटर्न = ZERO',
        visualDetail: '🏦 बैंक FD ब्याज: 6.5%\n🔥 महंगाई (Inflation): 6.0%\n📉 टैक्स कटने के बाद असली कमाई: 0%!',
        icon: '📉',
        badge: '💸 THE TRAP • 5-10s',
        theme: { bg1: '#241006', bg2: '#0d0502', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.3)', border: '#fb923c' }
      },
      {
        speedRate: '+0%',
        audio: 'यानी दस साल बाद आपके पैसे की खरीदने की ताकत बिल्कुल नहीं बढ़ेगी। अमीर बनने के लिए आपको इंडेक्स फंड या एसआईपी चुनना होगा।',
        caption: 'अमीर बनने के लिए FD छोड़ो, Index Fund और SIP चुनो!',
        highlight: 'Index Fund और SIP चुनो',
        visualTitle: 'Equity SIP की असली ताकत',
        visualDetail: '📈 भारत की टॉप 50 कंपनियों में हिस्सेदारी\n💎 ऐतिहासिक औसत रिटर्न: 13-14%\n🚀 महंगाई को 2 गुना रफ्तार से पछाड़ता है',
        icon: '📊',
        badge: '💡 THE SOLUTION • 10-18s',
        theme: { bg1: '#1c1706', bg2: '#0a0802', accent: '#facc15', glow: 'rgba(250, 204, 21, 0.3)', border: '#fde047' }
      },
      {
        speedRate: '+0%',
        audio: 'अगर आप दस साल तक दस हज़ार की एफडी करते हो तो मिलेंगे उन्नीस लाख, लेकिन वही पैसा एसआईपी में देगा छब्बीस लाख रुपये!',
        caption: '10 साल में FD देगी ₹19 लाख, लेकिन SIP देगी पूरे ₹26 लाख!',
        highlight: 'सीधा ₹7 लाख का अतिरिक्त मुनाफा!',
        visualTitle: '10 साल की सीधी तुलना',
        visualDetail: '🏦 Bank FD (6.5%): ₹19.5 Lakh\n📈 Mutual Fund SIP (13%): ₹26.5 Lakh\n💰 अंतर: ₹7,00,000 का सीधा फायदा!',
        icon: '💰',
        badge: '📊 BREAKDOWN • 18-25s',
        theme: { bg1: '#071824', bg2: '#02090f', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.3)', border: '#0284c7' }
      },
      {
        speedRate: '+0%',
        audio: 'सीधा नियम याद रखो: बैंक एफडी सिर्फ इमरजेंसी खर्च के लिए है, और वेल्थ बनाने के लिए म्यूचुअल फंड एसआईपी!',
        caption: 'FD सिर्फ इमरजेंसी के लिए, वेल्थ बनाने के लिए SIP करो!',
        highlight: 'वेल्थ के लिए SIP करो',
        visualTitle: 'स्मार्ट इन्वेस्टर का गोल्डन रूल',
        visualDetail: '🛡️ 6 महीने का खर्च = बैंक FD या सेविंग्स में\n🚀 बाकी लॉन्ग टर्म वेल्थ = Equity SIP में\n🏆 यही है फाइनेंशियल फ्रीडम का रास्ता',
        icon: '🏆',
        badge: '🚀 WEALTH RESULT • 25-31s',
        theme: { bg1: '#052214', bg2: '#010d07', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.35)', border: '#34d399' }
      },
      {
        speedRate: '+5%',
        audio: 'अगर यह सीक्रेट पसंद आया, तो अभी वीडियो को लाइक करें, और ऐसी ही अमीर बनने वाली टिप्स के लिए चैनल को तुरंत सब्सक्राइब करें!',
        caption: 'वीडियो को तुरंत LIKE करें और चैनल को SUBSCRIBE करें!',
        highlight: '🔔 LIKE करें & SUBSCRIBE करें!',
        visualTitle: 'JOIN THE WEALTH FAMILY',
        visualDetail: '👍 वीडियो को Like करके सेव कर लें\n🔔 Subscribe करें और बेल आइकन दबाएं\n❤️ अपने दोस्तों के साथ शेयर करें',
        icon: '🔔',
        badge: '⭐ LIKE & SUBSCRIBE • OUTRO',
        theme: { bg1: '#260a0f', bg2: '#0d0204', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', border: '#f87171' }
      }
    ]
  },
  {
    id: 'car-emi-rule-20-4-10',
    title: 'Car Buying 20-4-10 Rule',
    headline: 'कार खरीदने का 20-4-10 फॉर्मूला',
    scenes: [
      {
        speedRate: '+24%',
        audio: 'अमीर बनना है? तो ये करो! दिखावे के चक्कर में पंद्रह लाख की कार मत खरीदो, पहले ये नियम समझो!',
        caption: 'अमीर बनना है? तो ये करो! दिखावे के लिए Car मत खरीदो!',
        highlight: 'अमीर बनना है? तो ये करो!',
        visualTitle: 'कार का दिखावा = बर्बादी',
        visualDetail: '🔥 80% युवा कार EMI के जाल में फंसे\n⚡ 20-4-10 रूल से लाखों रुपये बचाएं\n👀 30 सेकंड में समझें स्मार्ट तरीका',
        icon: '🚀',
        badge: '🔥 अमीर बनना है? ये करो!',
        theme: { bg1: '#260a0f', bg2: '#0d0204', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.35)', border: '#f87171' }
      },
      {
        speedRate: '+18%',
        audio: 'अस्सी परसेंट युवा बिना बजट सोचे सिर्फ दूसरों को इम्प्रेस करने के लिए अपनी पूरी सैलरी ईएमआई में फंसा देते हैं!',
        caption: '80% युवा दूसरों को इम्प्रेस करने में अपनी सैलरी EMI में फंसा देते हैं!',
        highlight: '80% युवा EMI के जाल में',
        visualTitle: 'डेप्रिसिएटिंग एसेट का जाल',
        visualDetail: '❌ कार संपत्ति (Asset) नहीं, लायबिलिटी है\n❌ सर्विस, इंश्योरेंस और पेट्रोल का भारी खर्च\n❌ निवेश करने के लिए पैसे नहीं बचते',
        icon: '🚗',
        badge: '💸 THE TRAP • 5-10s',
        theme: { bg1: '#241006', bg2: '#0d0502', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.3)', border: '#fb923c' }
      },
      {
        speedRate: '+0%',
        audio: 'तो कार खरीदने से पहले समझदार लोगों का बीस चार दस फॉर्मूला हमेशा याद रखो। यह फॉर्मूला आपकी जेब खाली नहीं होने देगा।',
        caption: 'कार खरीदने से पहले 20-4-10 का जादुई फॉर्मूला याद रखो!',
        highlight: '20-4-10 का फॉर्मूला',
        visualTitle: 'The 20-4-10 Formula',
        visualDetail: '💵 20 = कम से कम 20% डाउन पेमेंट\n📅 4 = अधिकतम 4 साल का लोन\n📉 10 = सैलरी का 10% से कम EMI',
        icon: '💡',
        badge: '💡 THE SOLUTION • 10-18s',
        theme: { bg1: '#1c1706', bg2: '#0a0802', accent: '#facc15', glow: 'rgba(250, 204, 21, 0.3)', border: '#fde047' }
      },
      {
        speedRate: '+0%',
        audio: 'पहला: बीस परसेंट डाउन पेमेंट अपनी जेब से दो। दूसरा: लोन चार साल से ज़्यादा का कभी मत लो। और तीसरा: ईएमआई आपकी सैलरी के दस परसेंट से कम हो!',
        caption: '20% Down Payment, 4 साल का Loan, और सैलरी के 10% से कम EMI!',
        highlight: 'सैलरी के 10% से कम EMI',
        visualTitle: 'तीनों नियमों का पालन करें',
        visualDetail: '💵 20% Down Payment: जेब से कैश दो\n⏳ Max 4 Years: लंबे लोन से बैंक कमाता है\n🛡️ 10% Salary: अगर ₹50K सैलरी तो ₹5K EMI मैक्स',
        icon: '🛡️',
        badge: '📊 BREAKDOWN • 18-25s',
        theme: { bg1: '#071824', bg2: '#02090f', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.3)', border: '#0284c7' }
      },
      {
        speedRate: '+0%',
        audio: 'जब आप इस नियम से गाड़ी खरीदते हैं, तो कार की ईएमआई आपके सपनों और इन्वेस्टमेंट पर कभी बोझ नहीं बनती!',
        caption: 'इस नियम से गाड़ी लोगे तो बजट पर कभी बोझ नहीं पड़ेगा!',
        highlight: 'बजट पर कभी बोझ नहीं',
        visualTitle: 'स्मार्ट बायर = टेंशन फ्री लाइफ',
        visualDetail: '🚘 नई कार का आनंद भी मिलेगा\n💰 हर महीने SIP और सेविंग्स भी जारी रहेगी\n🏆 असली अमीरी दिखावे में नहीं, बैंक बैलेंस में है',
        icon: '🏆',
        badge: '🚀 WEALTH RESULT • 25-31s',
        theme: { bg1: '#052214', bg2: '#010d07', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.35)', border: '#34d399' }
      },
      {
        speedRate: '+5%',
        audio: 'अगर यह सीक्रेट पसंद आया, तो अभी वीडियो को लाइक करें, और ऐसी ही अमीर बनने वाली टिप्स के लिए चैनल को तुरंत सब्सक्राइब करें!',
        caption: 'वीडियो को तुरंत LIKE करें और चैनल को SUBSCRIBE करें!',
        highlight: '🔔 LIKE करें & SUBSCRIBE करें!',
        visualTitle: 'JOIN THE WEALTH FAMILY',
        visualDetail: '👍 वीडियो को Like करके सेव कर लें\n🔔 Subscribe करें और बेल आइकन दबाएं\n❤️ अपने दोस्तों के साथ शेयर करें',
        icon: '🔔',
        badge: '⭐ LIKE & SUBSCRIBE • OUTRO',
        theme: { bg1: '#260a0f', bg2: '#0d0204', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', border: '#f87171' }
      }
    ]
  },
  {
    id: 'active-vs-passive-income',
    title: 'Active vs Passive Income',
    headline: 'सोते हुए भी पैसा कैसे कमाएं?',
    scenes: [
      {
        speedRate: '+24%',
        audio: 'अमीर बनना है? तो ये करो! सिर्फ एक नौकरी पर निर्भर रहना बंद करो और सोते हुए पैसा कमाना शुरू करो!',
        caption: 'अमीर बनना है? तो ये करो! सोते हुए पैसा कमाना शुरू करो!',
        highlight: 'अमीर बनना है? तो ये करो!',
        visualTitle: 'Warren Buffett का सीक्रेट',
        visualDetail: '🔥 दिन में सिर्फ 24 घंटे हैं, शरीर से अमीर नहीं बन सकते\n⚡ पैसा मजदूर बनकर आपके लिए काम करेगा\n👀 30 सेकंड में समझें पैसिव इनकम',
        icon: '🚀',
        badge: '🔥 अमीर बनना है? ये करो!',
        theme: { bg1: '#260a0f', bg2: '#0d0204', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.35)', border: '#f87171' }
      },
      {
        speedRate: '+18%',
        audio: 'एक्टिव इनकम का मतलब है कि अगर कल आपकी तबीयत खराब हो जाए और काम बंद हो जाए, तो आपकी सैलरी आना भी बंद हो जाएगी!',
        caption: 'Active Income: जहाँ काम बंद होते ही सैलरी आना बंद हो जाती है!',
        highlight: 'काम बंद = सैलरी बंद',
        visualTitle: 'एक्टिव इनकम की सीमा',
        visualDetail: '🏢 9 से 5 की ऑफिस नौकरी\n⏳ समय बेचकर पैसा मिलता है\n🛑 काम बंद तो चूल्हा जलना बंद!',
        icon: '💼',
        badge: '💸 THE TRAP • 5-10s',
        theme: { bg1: '#241006', bg2: '#0d0502', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.3)', border: '#fb923c' }
      },
      {
        speedRate: '+0%',
        audio: 'लेकिन पैसिव इनकम वह है जहाँ आप एक बार सिस्टम बनाते हो, और पैसा खुद मजदूर बनकर आपके लिए चौबीसों घंटे काम करता है।',
        caption: 'Passive Income: सिस्टम एक बार बनाओ, और पैसा 24 घंटे काम करे!',
        highlight: 'पैसा खुद मजदूर बनकर काम करे',
        visualTitle: 'पैसिव इनकम का जादू',
        visualDetail: '📈 स्टॉक्स के डिविडेंड्स (Dividends)\n🏠 रेंटल प्रॉपर्टी से हर महीने किराया\n💻 डिजिटल प्रोडक्ट्स और यूट्यूब रॉयल्टी',
        icon: '🚀',
        badge: '💡 THE SOLUTION • 10-18s',
        theme: { bg1: '#1c1706', bg2: '#0a0802', accent: '#facc15', glow: 'rgba(250, 204, 21, 0.3)', border: '#fde047' }
      },
      {
        speedRate: '+0%',
        audio: 'अमीर लोग कभी सैलरी पर निर्भर नहीं रहते। वे अपनी सैलरी का इस्तेमाल ऐसे एसेट्स खरीदने में करते हैं जो हर महीने नया पैसा खींचते हैं।',
        caption: 'अमीर लोग सैलरी से Assets खरीदते हैं जो नया पैसा खींच कर लाते हैं!',
        highlight: 'Assets नया पैसा खींचते हैं',
        visualTitle: 'Assets vs Liabilities',
        visualDetail: '❌ गरीब: सैलरी से महंगे फोन और गाड़ियां\n✅ अमीर: सैलरी से इंडेक्स फंड और रियल एस्टेट\n💎 असली अमीरी फ्रीडम में है',
        icon: '💎',
        badge: '📊 BREAKDOWN • 18-25s',
        theme: { bg1: '#071824', bg2: '#02090f', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.3)', border: '#0284c7' }
      },
      {
        speedRate: '+0%',
        audio: 'जब आपकी पैसिव इनकम आपके महीने के खर्चे से ज़्यादा हो जाए, तो समझो आप जिंदगी के लिए फाइनेंशियली फ्री हो चुके हो!',
        caption: 'जब Passive Income खर्चे से ज़्यादा हो जाए, तो आप आज़ाद हो!',
        highlight: '100% फाइनेंशियल फ्रीडम',
        visualTitle: 'सच्ची आज़ादी (Financial Freedom)',
        visualDetail: '🏝️ बॉस की चिक-चिक से हमेशा के लिए आज़ादी\n💰 परिवार के साथ बिताने का भरपूर समय\n🏆 पैसा आपके लिए काम करता है, आप पैसे के लिए नहीं!',
        icon: '🏆',
        badge: '🚀 WEALTH RESULT • 25-31s',
        theme: { bg1: '#052214', bg2: '#010d07', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.35)', border: '#34d399' }
      },
      {
        speedRate: '+5%',
        audio: 'अगर यह सीक्रेट पसंद आया, तो अभी वीडियो को लाइक करें, और ऐसी ही अमीर बनने वाली टिप्स के लिए चैनल को तुरंत सब्सक्राइब करें!',
        caption: 'वीडियो को तुरंत LIKE करें और चैनल को SUBSCRIBE करें!',
        highlight: '🔔 LIKE करें & SUBSCRIBE करें!',
        visualTitle: 'JOIN THE WEALTH FAMILY',
        visualDetail: '👍 वीडियो को Like करके सेव कर लें\n🔔 Subscribe करें और बेल आइकन दबाएं\n❤️ अपने दोस्तों के साथ शेयर करें',
        icon: '🔔',
        badge: '⭐ LIKE & SUBSCRIBE • OUTRO',
        theme: { bg1: '#260a0f', bg2: '#0d0204', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', border: '#f87171' }
      }
    ]
  }
];

function getRandomTopic() {
  const index = Math.floor(Math.random() * FINANCE_TOPICS.length);
  return { ...FINANCE_TOPICS[index], index };
}

function getTopicById(id) {
  return FINANCE_TOPICS.find(t => t.id === id) || getRandomTopic();
}

module.exports = {
  FINANCE_TOPICS,
  getRandomTopic,
  getTopicById
};
