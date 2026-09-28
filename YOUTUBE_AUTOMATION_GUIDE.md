# 🚀 YouTube Automation & Daily 6:00 PM IST Auto-Upload Setup Guide

यह गाइड आपको बताएगा कि कैसे आप अपने GitHub रिपॉजिटरी में **Daily Finance Shorts Auto-Publisher** सेट कर सकते हैं, ताकि **हर रोज शाम 6:00 बजे (18:00 IST)** आपका बॉट खुद-ब-खुद:
1. 1,000 टॉपिक्स में से अगला क्रमवार वीडियो बनाएगा (#1, #2, #3...)
2. वायरल SEO टाइटल, डिस्क्रिप्शन और टैग्स जनरेट करेगा
3. सीधे आपके YouTube चैनल पर **Shorts** के रूप में पब्लिकली अपलोड करेगा
4. सीरियल ट्रैकर को ऑटोमैटिक अपडेट करके GitHub में सेव कर देगा!

---

## 🛠️ Step 1: Google Cloud Console से YouTube API Key & OAuth प्राप्त करें (केवल 2 मिनट का काम)

1. [Google Cloud Console](https://console.cloud.google.com/) पर जाएं और अपने Google अकाउंट से लॉगिन करें।
2. एक नया प्रोजेक्ट बनाएं (जैसे: `YouTube-Finance-Bot`).
3. **APIs & Services -> Library** में जाएं और **"YouTube Data API v3"** सर्च करके **Enable** करें।
4. **OAuth Consent Screen** पर क्लिक करें:
   - User Type: **External** चुनें और Create पर क्लिक करें।
   - App name में `YouTube Bot` और अपना ईमेल डालें।
   - **Scopes** में `.../auth/youtube.upload` और `.../auth/youtube` जोड़ें।
   - **Test Users** में अपना वही Google ईमेल जोड़ें जिस चैनल पर वीडियो अपलोड करना है।
5. **Credentials -> Create Credentials -> OAuth Client ID** पर क्लिक करें:
   - Application type: **Web application** (या Desktop app) चुनें।
   - Name: `YouTube Bot Client`
   - **Authorized redirect URIs** में डालें: `http://localhost:8080/callback`
   - **Create** पर क्लिक करें।
   - अब आपको **Client ID** और **Client Secret** मिल जाएगा। इसे कॉपी कर लें!

---

## 🔑 Step 2: Refresh Token जनरेट करें (1-क्लिक कमांड)

अपने टर्मिनल में यह कमांड चलाएं:
```bash
npm run youtube:setup
```
- यह आपसे **Client ID** और **Client Secret** पूछेगा।
- यह आपके ब्राउज़र में Google लॉगिन पेज खोलेगा।
- अपना YouTube चैनल चुनें और **Continue / Allow** करें।
- टर्मिनल में तुरंत **YOUTUBE_CLIENT_ID**, **YOUTUBE_CLIENT_SECRET**, और **YOUTUBE_REFRESH_TOKEN** प्रिंट हो जाएंगे!

---

## ☁️ Step 3: GitHub Repository Secrets में जोड़ें

1. अपने GitHub Repository में जाएं: `https://github.com/<your-username>/<repo-name>`
2. **Settings** -> **Secrets and variables** -> **Actions** पर क्लिक करें।
3. **New repository secret** पर क्लिक करें और ये 3 सीक्रेट्स जोड़ें:

| Secret Name | Secret Value | विवरण |
|---|---|---|
| `YOUTUBE_CLIENT_ID` | `xxxx.apps.googleusercontent.com` | आपका Google Client ID |
| `YOUTUBE_CLIENT_SECRET` | `GOCSPX-xxxx` | आपका Google Client Secret |
| `YOUTUBE_REFRESH_TOKEN` | `1//04xxxx` | Step 2 से मिला Refresh Token |
| `YOUTUBE_PRIVACY_STATUS` | `public` *(वैकल्पिक)* | 'public', 'unlisted', या 'private' |

---

## ⏰ Step 4: GitHub Actions में हर शाम 6:00 बजे कैसे चलेगा?

- वर्कफ़्लो फाइल पहले से कॉन्फ़िगर है: [`.github/workflows/daily-finance-short.yml`](file:///.github/workflows/daily-finance-short.yml)
- **Cron Schedule:** `30 12 * * *` (12:30 UTC = **6:00 PM IST भारतीय समय**)।
- हर दिन शाम 6:00 बजे GitHub Actions का Ubuntu सर्वर अपने आप ऑन होगा, अगला वीडियो बनाएगा, वायरल SEO के साथ YouTube Shorts में अपलोड करेगा, और सीरियल काउंटर आगे बढ़ा देगा।

### मैन्युअल टेस्ट करना (Manual Trigger):
यदि आप शाम 6 बजे से पहले खुद टेस्ट करना चाहते हैं:
1. GitHub Repo में **Actions** टैब पर जाएं।
2. बायीं तरफ **"Daily Finance Short Auto-Publisher"** पर क्लिक करें।
3. **Run workflow** बटन पर क्लिक करें।
4. 1-2 मिनट में वीडियो तैयार होकर YouTube पर लाइव हो जाएगा!

---

## 💻 Local Testing & Web Dashboard (अपने कंप्यूटर पर टेस्ट करें)

### 1. लोकल में ऑटो-अपलोड टेस्ट करना:
```bash
npm run daily:publish
```

### 2. लोकल वेब डैशबोर्ड खोलना:
```bash
npm run finance
```
ब्राउज़र में खोलें: **http://localhost:5000**
- यहाँ आप हर वीडियो का लाइव SEO देख सकते हैं।
- किसी भी वीडियो के आगे लाल रंग का **"🔴 YouTube"** बटन दबाकर तुरंत 1-क्लिक में अपलोड कर सकते हैं!
