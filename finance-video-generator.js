const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const sharp = require('sharp');
const ffmpegPath = require('ffmpeg-static');
const { getNextSerialTopic, getTopicBySerial } = require('./serial-tracker');

const OUTPUT_DIR = path.join(__dirname, 'output_videos');
const TEMP_DIR = path.join(__dirname, 'temp_finance_work');
const AUDIO_ASSETS_DIR = path.join(__dirname, 'assets', 'audio');

function ensureDirectories() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
  if (!fs.existsSync(AUDIO_ASSETS_DIR)) fs.mkdirSync(AUDIO_ASSETS_DIR, { recursive: true });
}

/**
 * Get Audio duration in seconds using ffmpeg
 */
function getAudioDuration(filePath) {
  try {
    const cmd = `"${ffmpegPath}" -i "${filePath}" 2>&1`;
    const output = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const match = output.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
    if (match) {
      const hours = parseFloat(match[1]);
      const minutes = parseFloat(match[2]);
      const seconds = parseFloat(match[3]);
      return hours * 3600 + minutes * 60 + seconds;
    }
  } catch (err) {
    if (err.stdout || err.stderr) {
      const output = (err.stdout || '') + (err.stderr || '');
      const match = output.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      if (match) {
        const hours = parseFloat(match[1]);
        const minutes = parseFloat(match[2]);
        const seconds = parseFloat(match[3]);
        return hours * 3600 + minutes * 60 + seconds;
      }
    }
  }
  return 5.0; // fallback duration
}

/**
 * Generate Speech Audio for a specific sentence using MsEdgeTTS with pacing control
 * Allows +22% FAST delivery in first 10 seconds, and normal +0% speed thereafter!
 */
async function generateSceneAudio(text, sceneIndex, sessionFolder, speedRate = '+0%', voice = 'hi-IN-MadhurNeural') {
  const sceneAudioDir = path.join(sessionFolder, `scene_audio_${sceneIndex}`);
  if (!fs.existsSync(sceneAudioDir)) fs.mkdirSync(sceneAudioDir, { recursive: true });

  // For Scene 0 (Hook), eliminate punctuation pauses while keeping natural clear pacing
  let cleanText = text;
  let effectiveRate = speedRate;
  if (sceneIndex === 0) {
    cleanText = text
      .replace(/अमीर बनना है\? तो ये करो!/g, 'अमीर बनना है तो ये करो!')
      .replace(/अमीर बनना है\? तो ये करो/g, 'अमीर बनना है तो ये करो')
      .replace(/अमीर बनना है\?/g, 'अमीर बनना है');
    effectiveRate = '+16%'; // Balanced, energetic yet natural and clear
  }

  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const res = await tts.toFile(sceneAudioDir, cleanText, { rate: effectiveRate });
  await tts.close();

  const finalAudioPath = path.join(sessionFolder, `scene_${sceneIndex}.mp3`);
  fs.copyFileSync(res.audioFilePath, finalAudioPath);
  return finalAudioPath;
}

/**
 * Helper to escape XML characters for SVG text
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

/**
 * Render Main Visual Infographic Card depending on scene layout:
 * - trap: High-contrast danger alert with specific mistakes & consequences
 * - formula: 3-column metric cards with real numbers, percentages & rupee values
 * - steps: 3 numbered action roadmap cards with progress flow
 * - wealth_result: Giant gold net worth badge with invested vs profit comparison
 * - cta: High-conversion subscribe, like & share buttons
 * - hook / default: Glowing topic card with 3 key pillars
 */
function renderMainVisualCard(scene, theme, isFinalCta, isHook, sceneIndex, totalScenes) {
  const icon = scene.icon || '💰';
  const visualTitle = escapeXml(scene.visualTitle || '');
  const layout = scene.layout || (isFinalCta ? 'cta' : isHook ? 'hook' : 'default');

  if (layout === 'trap') {
    const p1 = escapeXml(scene.trapPoint1 || 'बिना सोचे-समझे खर्च और कर्ज का जाल');
    const p2 = escapeXml(scene.trapPoint2 || 'महीने के अंत में जीरो बैलेंस और पछतावा');
    return `
      <g filter="url(#cardGlow)">
        <rect x="80" y="340" width="920" height="860" rx="36" fill="#150608" fill-opacity="0.96" stroke="#ef4444" stroke-width="4"/>
      </g>
      <circle cx="540" cy="440" r="65" fill="#ef4444" fill-opacity="0.22" stroke="#ef4444" stroke-width="2"/>
      <text x="540" y="475" font-family="Segoe UI Emoji, Segoe UI, sans-serif" font-size="65" text-anchor="middle">⚠️</text>
      <text x="540" y="550" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="38" font-weight="900" fill="#f87171" text-anchor="middle">
        ${visualTitle || '90% लोग यहाँ भारी गलती करते हैं!'}
      </text>
      <line x1="280" y1="585" x2="800" y2="585" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>

      <g transform="translate(120, 620)">
        <rect x="0" y="0" width="840" height="150" rx="22" fill="#260b0f" stroke="#f87171" stroke-width="2"/>
        <text x="36" y="48" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="26" font-weight="900" fill="#fca5a5">❌ सबसे बड़ी भूल (THE BIG MISTAKE):</text>
        <text x="36" y="105" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="28" font-weight="800" fill="#ffffff">${p1}</text>
      </g>

      <g transform="translate(120, 800)">
        <rect x="0" y="0" width="840" height="150" rx="22" fill="#260b0f" stroke="#f87171" stroke-width="2"/>
        <text x="36" y="48" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="26" font-weight="900" fill="#fca5a5">📉 भयानक परिणाम (THE COST):</text>
        <text x="36" y="105" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="28" font-weight="800" fill="#ffffff">${p2}</text>
      </g>

      <g transform="translate(120, 980)">
        <rect x="0" y="0" width="840" height="80" rx="40" fill="#ef4444" fill-opacity="0.25" stroke="#ef4444" stroke-width="2"/>
        <text x="420" y="50" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="25" font-weight="800" fill="#fca5a5" text-anchor="middle">
          🚨 बिना सही प्लानिंग के जिंदगी भर आर्थिक तंगी रहेगी!
        </text>
      </g>
    `;
  }

  if (layout === 'formula' && scene.columns && scene.columns.length === 3) {
    const c0 = scene.columns[0];
    const c1 = scene.columns[1];
    const c2 = scene.columns[2];
    const summary = escapeXml(scene.formulaSummary || '⭐ इस फॉर्मूले से हर महीने वेल्थ तेजी से ग्रो होगी!');
    return `
      <g filter="url(#cardGlow)">
        <rect x="80" y="340" width="920" height="860" rx="36" fill="#09131e" fill-opacity="0.96" stroke="#38bdf8" stroke-width="4"/>
      </g>
      <circle cx="540" cy="435" r="60" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2"/>
      <text x="540" y="470" font-family="Segoe UI Emoji, Segoe UI, sans-serif" font-size="60" text-anchor="middle">💡</text>
      <text x="540" y="535" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="36" font-weight="900" fill="#38bdf8" text-anchor="middle">
        ${visualTitle || 'THE MASTER FORMULA'}
      </text>
      <line x1="280" y1="565" x2="800" y2="565" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>

      <g transform="translate(120, 595)">
        <rect x="0" y="0" width="260" height="385" rx="22" fill="#132338" stroke="#34d399" stroke-width="3"/>
        <text x="130" y="68" font-family="Segoe UI, sans-serif" font-size="50" font-weight="900" fill="#34d399" text-anchor="middle">${escapeXml(c0.top)}</text>
        <text x="130" y="115" font-family="Segoe UI, sans-serif" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(c0.label)}</text>
        <line x1="30" y1="140" x2="230" y2="140" stroke="#334155" stroke-width="2"/>
        <text x="130" y="200" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="26" font-weight="900" fill="#facc15" text-anchor="middle">${escapeXml(c0.val)}</text>
        <text x="130" y="265" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="19" font-weight="700" fill="#94a3b8" text-anchor="middle">${escapeXml(c0.sub)}</text>
      </g>

      <g transform="translate(410, 595)">
        <rect x="0" y="0" width="260" height="385" rx="22" fill="#132338" stroke="#fbbf24" stroke-width="3"/>
        <text x="130" y="68" font-family="Segoe UI, sans-serif" font-size="50" font-weight="900" fill="#fbbf24" text-anchor="middle">${escapeXml(c1.top)}</text>
        <text x="130" y="115" font-family="Segoe UI, sans-serif" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(c1.label)}</text>
        <line x1="30" y1="140" x2="230" y2="140" stroke="#334155" stroke-width="2"/>
        <text x="130" y="200" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="26" font-weight="900" fill="#facc15" text-anchor="middle">${escapeXml(c1.val)}</text>
        <text x="130" y="265" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="19" font-weight="700" fill="#94a3b8" text-anchor="middle">${escapeXml(c1.sub)}</text>
      </g>

      <g transform="translate(700, 595)">
        <rect x="0" y="0" width="260" height="385" rx="22" fill="#132338" stroke="#38bdf8" stroke-width="3"/>
        <text x="130" y="68" font-family="Segoe UI, sans-serif" font-size="50" font-weight="900" fill="#38bdf8" text-anchor="middle">${escapeXml(c2.top)}</text>
        <text x="130" y="115" font-family="Segoe UI, sans-serif" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(c2.label)}</text>
        <line x1="30" y1="140" x2="230" y2="140" stroke="#334155" stroke-width="2"/>
        <text x="130" y="200" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="26" font-weight="900" fill="#facc15" text-anchor="middle">${escapeXml(c2.val)}</text>
        <text x="130" y="265" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="19" font-weight="700" fill="#94a3b8" text-anchor="middle">${escapeXml(c2.sub)}</text>
      </g>

      <g transform="translate(120, 1010)">
        <rect x="0" y="0" width="840" height="74" rx="20" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="2"/>
        <text x="420" y="47" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="25" font-weight="800" fill="#34d399" text-anchor="middle">
          ${summary}
        </text>
      </g>
    `;
  }

  if (layout === 'steps' && scene.step1) {
    const s1 = scene.step1;
    const s2 = scene.step2 || { title: 'अनुशासन बनाए रखें', desc: 'हर महीने निरंतरता जरूरी है' };
    const s3 = scene.step3 || { title: 'वेल्थ को ट्रैक करें', desc: 'कम्पाउंडिंग का आनंद लें' };
    return `
      <g filter="url(#cardGlow)">
        <rect x="80" y="340" width="920" height="860" rx="36" fill="#091024" fill-opacity="0.96" stroke="#60a5fa" stroke-width="4"/>
      </g>
      <circle cx="540" cy="435" r="60" fill="#60a5fa" fill-opacity="0.2" stroke="#60a5fa" stroke-width="2"/>
      <text x="540" y="470" font-family="Segoe UI Emoji, Segoe UI, sans-serif" font-size="60" text-anchor="middle">🛠️</text>
      <text x="540" y="535" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="36" font-weight="900" fill="#93c5fd" text-anchor="middle">
        ${visualTitle || 'ACTION ROADMAP: कैसे लागू करें?'}
      </text>
      <line x1="280" y1="565" x2="800" y2="565" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>

      <g transform="translate(120, 595)">
        <rect x="0" y="0" width="840" height="115" rx="20" fill="#172554" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="65" cy="58" r="34" fill="#3b82f6"/>
        <text x="65" y="70" font-family="Segoe UI, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle">1</text>
        <text x="125" y="48" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="28" font-weight="900" fill="#ffffff">${escapeXml(s1.title)}</text>
        <text x="125" y="90" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="23" font-weight="600" fill="#93c5fd">${escapeXml(s1.desc)}</text>
      </g>

      <g transform="translate(120, 730)">
        <rect x="0" y="0" width="840" height="115" rx="20" fill="#172554" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="65" cy="58" r="34" fill="#3b82f6"/>
        <text x="65" y="70" font-family="Segoe UI, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle">2</text>
        <text x="125" y="48" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="28" font-weight="900" fill="#ffffff">${escapeXml(s2.title)}</text>
        <text x="125" y="90" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="23" font-weight="600" fill="#93c5fd">${escapeXml(s2.desc)}</text>
      </g>

      <g transform="translate(120, 865)">
        <rect x="0" y="0" width="840" height="115" rx="20" fill="#172554" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="65" cy="58" r="34" fill="#3b82f6"/>
        <text x="65" y="70" font-family="Segoe UI, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle">3</text>
        <text x="125" y="48" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="28" font-weight="900" fill="#ffffff">${escapeXml(s3.title)}</text>
        <text x="125" y="90" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="23" font-weight="600" fill="#93c5fd">${escapeXml(s3.desc)}</text>
      </g>

      <g transform="translate(120, 1005)">
        <rect x="0" y="0" width="840" height="74" rx="20" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
        <text x="420" y="47" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="25" font-weight="800" fill="#60a5fa" text-anchor="middle">
          🚀 अनुशासन + ऑटोमेशन = 100% फाइनेंशियल सफलता!
        </text>
      </g>
    `;
  }

  if (layout === 'wealth_result') {
    const stat = escapeXml(scene.wealthStat || '₹90 LAKH+');
    const invested = escapeXml(scene.investedAmount || '₹14.4 Lakh');
    const gain = escapeXml(scene.compoundGain || '+₹76.8 Lakh');
    const note = escapeXml(scene.wealthNote || '20 साल @ 15% CAGR • पूरी वित्तीय आज़ादी!');
    return `
      <g filter="url(#cardGlow)">
        <rect x="80" y="340" width="920" height="860" rx="36" fill="#151206" fill-opacity="0.96" stroke="#facc15" stroke-width="4"/>
      </g>
      <circle cx="540" cy="435" r="60" fill="#facc15" fill-opacity="0.2" stroke="#facc15" stroke-width="2"/>
      <text x="540" y="470" font-family="Segoe UI Emoji, Segoe UI, sans-serif" font-size="60" text-anchor="middle">🏆</text>
      <text x="540" y="535" font-family="Segoe UI, sans-serif" font-size="28" font-weight="900" fill="#fde047" text-anchor="middle" letter-spacing="3">
        COMPOUND WEALTH RESULT
      </text>
      <line x1="280" y1="565" x2="800" y2="565" stroke="#facc15" stroke-width="2" stroke-linecap="round"/>

      <g transform="translate(120, 595)">
        <rect x="0" y="0" width="840" height="190" rx="28" fill="#282208" stroke="#facc15" stroke-width="3"/>
        <text x="420" y="60" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="26" font-weight="800" fill="#fef08a" text-anchor="middle">संभावित कुल संपत्ति (NET WORTH)</text>
        <text x="420" y="145" font-family="Segoe UI, sans-serif" font-size="76" font-weight="900" fill="#facc15" text-anchor="middle" letter-spacing="1">
          ${stat}
        </text>
      </g>

      <g transform="translate(120, 805)">
        <rect x="0" y="0" width="405" height="135" rx="20" fill="#1f1a07" stroke="#ca8a04" stroke-width="2"/>
        <text x="202" y="46" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="22" font-weight="800" fill="#d4d4d8" text-anchor="middle">आपकी जेब से लगा</text>
        <text x="202" y="100" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">${invested}</text>
      </g>
      <g transform="translate(555, 805)">
        <rect x="0" y="0" width="405" height="135" rx="20" fill="#052e16" stroke="#22c55e" stroke-width="2"/>
        <text x="202" y="46" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="22" font-weight="800" fill="#86efac" text-anchor="middle">कम्पाउंडिंग मुनाफा</text>
        <text x="202" y="100" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="34" font-weight="900" fill="#4ade80" text-anchor="middle">${gain}</text>
      </g>

      <g transform="translate(120, 965)">
        <rect x="0" y="0" width="840" height="85" rx="22" fill="#facc15" fill-opacity="0.18" stroke="#facc15" stroke-width="2"/>
        <text x="420" y="55" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="26" font-weight="900" fill="#fef08a" text-anchor="middle">
          ${note}
        </text>
      </g>
    `;
  }

  if (layout === 'cta' || isFinalCta) {
    return `
      <g filter="url(#cardGlow)">
        <rect x="80" y="340" width="920" height="860" rx="36" fill="#140608" fill-opacity="0.96" stroke="#ef4444" stroke-width="4"/>
      </g>
      <circle cx="540" cy="435" r="60" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="2"/>
      <text x="540" y="470" font-family="Segoe UI Emoji, Segoe UI, sans-serif" font-size="60" text-anchor="middle">🔔</text>
      <text x="540" y="535" font-family="Segoe UI, sans-serif" font-size="32" font-weight="900" fill="#f87171" text-anchor="middle" letter-spacing="2">
        JOIN 100,000+ SMART INVESTORS
      </text>
      <line x1="280" y1="565" x2="800" y2="565" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>

      <g transform="translate(130, 615)">
        <rect x="0" y="0" width="820" height="150" rx="75" fill="#dc2626" stroke="#ffffff" stroke-width="4"/>
        <text x="410" y="95" font-family="Segoe UI, sans-serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">
          🔔 SUBSCRIBE NOW
        </text>
      </g>

      <g transform="translate(130, 795)">
        <rect x="0" y="0" width="395" height="110" rx="55" fill="#1d4ed8" stroke="#60a5fa" stroke-width="3"/>
        <text x="197" y="70" font-family="Segoe UI, sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle">
          👍 LIKE VIDEO
        </text>
      </g>
      <g transform="translate(555, 795)">
        <rect x="0" y="0" width="395" height="110" rx="55" fill="#15803d" stroke="#4ade80" stroke-width="3"/>
        <text x="197" y="70" font-family="Segoe UI, sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle">
          ↗️ SHARE IT
        </text>
      </g>

      <g transform="translate(130, 945)">
        <rect x="0" y="0" width="820" height="90" rx="24" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
        <text x="410" y="58" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="27" font-weight="800" fill="#c7d2fe" text-anchor="middle">
          ⭐ हर रोज़ 30 सेकंड में फाइनेंस की नई सीख पाएं!
        </text>
      </g>
    `;
  }

  // Default Fallback
  const detailLines = (scene.visualDetail || '').split('\n').map(l => escapeXml(l.trim())).filter(Boolean);
  let detailSvg = '';
  detailLines.forEach((line, i) => {
    const yPos = 760 + (i * 95);
    detailSvg += `
      <g transform="translate(130, ${yPos})">
        <rect x="0" y="0" width="820" height="78" rx="20" fill="#18181b" fill-opacity="0.94" stroke="${theme.border}" stroke-width="2"/>
        <text x="40" y="52" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="31" font-weight="800" fill="#f3f4f6">
          ${line}
        </text>
      </g>
    `;
  });

  return `
    <g filter="url(#cardGlow)">
      <rect x="80" y="340" width="920" height="860" rx="36" fill="#090d16" fill-opacity="0.93" stroke="${theme.border}" stroke-width="4"/>
    </g>
    <circle cx="540" cy="470" r="95" fill="${theme.accent}" fill-opacity="0.22" stroke="${theme.border}" stroke-width="3"/>
    <text x="540" y="515" font-family="Segoe UI Emoji, Segoe UI, sans-serif" font-size="95" text-anchor="middle">${icon}</text>
    <text x="540" y="635" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">
      ${visualTitle}
    </text>
    <line x1="320" y1="675" x2="760" y2="675" stroke="${theme.border}" stroke-width="3" stroke-linecap="round"/>
    ${detailSvg}
  `;
}

/**
 * Generate 1080x1920 SVG slide for a specific scene
 * Distinct visuals, matching images, dynamic speed indicator & exact spoken dialogue
 */
function createSceneSlideSvg(topic, scene, sceneIndex, totalScenes) {
  const width = 1080;
  const height = 1920;
  const theme = scene.theme || {
    bg1: '#111827', bg2: '#030712', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.25)', border: '#34d399'
  };

  const badge = escapeXml(scene.badge);
  const headline = escapeXml(topic.headline);
  const icon = scene.icon || '💰';
  const visualTitle = escapeXml(scene.visualTitle);
  const caption = escapeXml(scene.caption);
  const highlight = escapeXml(scene.highlight);
  const isFinalCta = sceneIndex === totalScenes - 1;
  const isHook = sceneIndex === 0;

  // Calculate progress bar width
  const progressWidth = Math.round(((sceneIndex + 1) / totalScenes) * 920);

  // Speed tag indicator
  const speedTag = scene.speedRate === '+24%' || scene.speedRate === '+16%' ? '⚡ FAST PACING (0-5s)' :
                   scene.speedRate === '+10%' || scene.speedRate === '+18%' ? '⚠️ THE COSTLY TRAP' :
                   isFinalCta ? '🔔 SUBSCRIBE NOW' : '📖 DETAILED EXPLANATION';

  const cardContent = renderMainVisualCard(scene, theme, isFinalCta, isHook, sceneIndex, totalScenes);

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Background Gradient -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.bg1}"/>
          <stop offset="60%" stop-color="${theme.bg2}"/>
          <stop offset="100%" stop-color="#020408"/>
        </linearGradient>

        <!-- Accent Gradient -->
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${theme.accent}"/>
          <stop offset="100%" stop-color="#facc15"/>
        </linearGradient>

        <filter id="cardGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="25" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

      <!-- Ambient Glow Orbs -->
      <circle cx="200" cy="400" r="320" fill="${theme.accent}" fill-opacity="${isHook ? '0.22' : '0.12'}"/>
      <circle cx="880" cy="1400" r="350" fill="${theme.accent}" fill-opacity="0.10"/>

      <!-- Top Branding Pill -->
      <rect x="290" y="80" width="500" height="60" rx="30" fill="#111827" fill-opacity="0.9" stroke="#374151" stroke-width="2"/>
      <text x="540" y="122" font-family="Segoe UI, sans-serif" font-size="24" font-weight="800" fill="#9ca3af" text-anchor="middle" letter-spacing="3">
        ⚡ 30-SEC FINANCE GYAN
      </text>

      <!-- Speed & Scene Badge Header -->
      <g transform="translate(190, 160)">
        <rect x="0" y="0" width="340" height="48" rx="24" fill="${theme.accent}" fill-opacity="0.2" stroke="${theme.border}" stroke-width="2"/>
        <text x="170" y="32" font-family="Segoe UI, sans-serif" font-size="20" font-weight="900" fill="${theme.accent}" text-anchor="middle">
          ${badge}
        </text>

        <rect x="360" y="0" width="340" height="48" rx="24" fill="#1f2937" stroke="#4b5563" stroke-width="2"/>
        <text x="530" y="32" font-family="Segoe UI, sans-serif" font-size="19" font-weight="800" fill="#facc15" text-anchor="middle">
          ${speedTag}
        </text>
      </g>

      <!-- Topic Main Headline -->
      <text x="540" y="280" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">
        ${headline}
      </text>

      <!-- ================= MAIN VISUAL CARD (SCENE IMAGE) ================= -->
      ${cardContent}

      <!-- ================= LOWER CAPTION BOX (EXACT SPOKEN WORDS) ================= -->
      <rect x="60" y="1250" width="960" height="430" rx="32" fill="#0b1120" fill-opacity="0.96" stroke="#facc15" stroke-width="3"/>
      
      <!-- Subtitle Label -->
      <rect x="100" y="1275" width="240" height="40" rx="20" fill="#facc15" fill-opacity="0.2"/>
      <text x="220" y="1302" font-family="Segoe UI, sans-serif" font-size="19" font-weight="900" fill="#facc15" text-anchor="middle" letter-spacing="1">
        🎙️ LISTENING NOW
      </text>

      <!-- The Exact Spoken Sentence -->
      <text x="540" y="1395" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="40" font-weight="900" fill="#ffffff" text-anchor="middle">
        "${caption.slice(0, 36)}"
      </text>
      <text x="540" y="1460" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="40" font-weight="900" fill="#ffffff" text-anchor="middle">
        "${caption.slice(36, 82)}"
      </text>

      <!-- Glowing Highlight Pill -->
      <rect x="130" y="1530" width="820" height="90" rx="45" fill="${theme.accent}" fill-opacity="0.25" stroke="${theme.accent}" stroke-width="2"/>
      <text x="540" y="1588" font-family="Nirmala UI, Segoe UI, sans-serif" font-size="36" font-weight="900" fill="#fef08a" text-anchor="middle">
        ⭐ ${highlight}
      </text>

      <!-- ================= BOTTOM PROGRESS BAR ================= -->
      <rect x="80" y="1740" width="920" height="20" rx="10" fill="#1f2937"/>
      <rect x="80" y="1740" width="${progressWidth}" height="20" rx="10" fill="url(#accentGrad)"/>

      <text x="540" y="1820" font-family="Segoe UI, sans-serif" font-size="24" font-weight="700" fill="#9ca3af" text-anchor="middle">
        Scene ${sceneIndex + 1} of ${totalScenes} • High Retention Finance Short
      </text>
    </svg>
  `;
}

/**
 * Mix Voice Narration with Background Music (BGM) and Dynamic Sound Effects (SFX)
 * - Whoosh sound on every scene change/transition
 * - Ding / Cash chime on key calculation points (Scene 2 & Scene 4)
 * - Bell / Fanfare chime on the Like & Subscribe CTA scene
 * - Ducked BGM (volume: 0.13) with smooth fade-in and fade-out so Hindi narration remains loud, crisp, and prominent
 */
async function mixAudioWithBgmAndSfx({ masterAudioPath, totalAudioDuration, sceneData, sessionFolder, bgmChoice = 'bgm_motivational.mp3' }) {
  const finalSoundtrackPath = path.join(sessionFolder, 'final_soundtrack.mp3');
  
  const bgmPath = path.join(AUDIO_ASSETS_DIR, bgmChoice);
  const whooshPath = path.join(AUDIO_ASSETS_DIR, 'whoosh.mp3');
  const dingPath = path.join(AUDIO_ASSETS_DIR, 'ding.mp3');
  const bellPath = path.join(AUDIO_ASSETS_DIR, 'bell.mp3');

  // Verify core audio assets exist
  if (!fs.existsSync(bgmPath) || !fs.existsSync(whooshPath)) {
    console.warn('[AudioMixer] Audio assets not found in assets/audio, using master voice only.');
    return masterAudioPath;
  }

  // Calculate cumulative start time for each scene in milliseconds
  let cumulativeMs = 0;
  const sceneStartMs = sceneData.map(s => {
    const st = cumulativeMs;
    cumulativeMs += Math.round(s.duration * 1000);
    return st;
  });

  const numScenes = sceneData.length;
  const whooshOutputs = [];
  const whooshFilters = [];
  for (let i = 0; i < numScenes; i++) {
    const delay = Math.max(0, sceneStartMs[i]);
    const outName = `sw${i}`;
    whooshOutputs.push(`[${outName}]`);
    const vol = (i === 0) ? '0.28' : '0.38';
    whooshFilters.push(`[w${i}]adelay=${delay}|${delay},volume=${vol}[${outName}]`);
  }

  const dingOutputs = [];
  const dingFilters = [];
  const dingSceneIndices = [2, 4].filter(idx => idx < numScenes);
  if (dingSceneIndices.length > 0 && fs.existsSync(dingPath)) {
    for (let d = 0; d < dingSceneIndices.length; d++) {
      const idx = dingSceneIndices[d];
      const delay = sceneStartMs[idx] + 350;
      const outName = `sd${d}`;
      dingOutputs.push(`[${outName}]`);
      dingFilters.push(`[d${d}]adelay=${delay}|${delay},volume=0.30[${outName}]`);
    }
  }

  let bellFilter = '';
  let bellOutput = '';
  const lastSceneIndex = numScenes - 1;
  if (lastSceneIndex >= 0 && fs.existsSync(bellPath)) {
    const bellDelay = sceneStartMs[lastSceneIndex] + 250;
    bellFilter = `[4:a]adelay=${bellDelay}|${bellDelay},volume=0.45[s_bell]`;
    bellOutput = '[s_bell]';
  }

  const fadeOutStart = Math.max(0, totalAudioDuration - 1.5).toFixed(2);

  const filterParts = [
    `[0:a]volume=1.10[voice]`,
    `[1:a]volume=0.065,afade=t=in:st=0:d=0.8,afade=t=out:st=${fadeOutStart}:d=1.5[bgm]`,
    `[2:a]asplit=${numScenes}${Array.from({length: numScenes}, (_, i) => `[w${i}]`).join('')}`,
    ...whooshFilters
  ];

  if (dingSceneIndices.length > 0 && fs.existsSync(dingPath)) {
    filterParts.push(`[3:a]asplit=${dingSceneIndices.length}${Array.from({length: dingSceneIndices.length}, (_, i) => `[d${i}]`).join('')}`);
    filterParts.push(...dingFilters);
  }

  if (bellFilter) {
    filterParts.push(bellFilter);
  }

  const mixInputs = ['[voice]', '[bgm]', ...whooshOutputs, ...dingOutputs];
  if (bellOutput) mixInputs.push(bellOutput);

  filterParts.push(`${mixInputs.join('')}amix=inputs=${mixInputs.length}:duration=first:dropout_transition=0:normalize=0[aout]`);

  const complexFilter = filterParts.join(';');

  const args = [
    '-y',
    '-i', masterAudioPath,
    '-stream_loop', '-1', '-i', bgmPath,
    '-i', whooshPath
  ];

  if (dingSceneIndices.length > 0 && fs.existsSync(dingPath)) {
    args.push('-i', dingPath);
  }
  if (bellFilter) {
    args.push('-i', bellPath);
  }

  args.push(
    '-filter_complex', complexFilter,
    '-map', '[aout]',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    finalSoundtrackPath
  );

  console.log(`[AudioMixer] 🎵 Mixing BGM (${bgmChoice}) + SFX (${numScenes} Whooshes + ${dingSceneIndices.length} Dings + Bell) with Master Voice...`);

  await new Promise((resolve) => {
    const proc = spawn(ffmpegPath, args);
    let stderr = '';
    proc.stderr.on('data', d => stderr += d.toString());
    proc.on('close', code => {
      if (code === 0) {
        console.log(`[AudioMixer] ✅ Soundtrack created successfully: ${finalSoundtrackPath}`);
        resolve();
      } else {
        console.warn(`[AudioMixer] Mixing warning (code ${code}), falling back to voice narration.`);
        resolve();
      }
    });
    proc.on('error', err => {
      console.warn(`[AudioMixer] Mixing process error:`, err);
      resolve();
    });
  });

  if (fs.existsSync(finalSoundtrackPath)) {
    return finalSoundtrackPath;
  }
  return masterAudioPath;
}

/**
 * Generate a complete 30-Second Multi-Scene Finance Video
 * @param {string|null} topicId Optional topic ID or null for random
 * @param {function} onProgress Callback for status updates
 */
async function generateFinanceVideo(topicId = null, onProgress = () => {}) {
  if (typeof topicId === 'function') {
    onProgress = topicId;
    topicId = null;
  } else if (typeof topicId === 'object' && topicId !== null) {
    if (topicId.onProgress) onProgress = topicId.onProgress;
    topicId = topicId.topicId || null;
  }

  ensureDirectories();
  const startTime = Date.now();
  const sessionFolder = path.join(TEMP_DIR, `run_${Date.now()}`);
  fs.mkdirSync(sessionFolder, { recursive: true });

  try {
    // Step 1: Pick topic sequentially or by selected serial ID
    onProgress({ step: 1, message: 'सीरियल नंबर के अनुसार टॉपिक चुना जा रहा है...' });
    let topic;
    if (topicId) {
      const serialNum = String(topicId).replace('topic-', '');
      topic = getTopicBySerial(serialNum);
    } else {
      topic = getNextSerialTopic();
    }
    const scenes = topic.scenes || [];
    console.log(`[FinanceVideo] Selected Serial #${topic.paddedNumber || topic.serialNumber}: "${topic.title}" with ${scenes.length} dedicated scenes`);

    // Step 2: Generate scene-by-scene audio with PACING control and matching visual slides
    onProgress({ step: 2, message: `प्रत्येक सीन की हिंदी आवाज़ (फास्ट हुक + नॉर्मल पेस) तैयार हो रही है (0/${scenes.length})...` });

    const sceneData = [];
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const speedRate = scene.speedRate || (i < 2 ? '+20%' : '+0%');
      onProgress({ step: 2, message: `सीन ${i + 1}/${scenes.length} तैयार हो रहा है (Speed: ${speedRate})...` });

      // Generate TTS with precise speed rate
      const audioPath = await generateSceneAudio(scene.audio, i, sessionFolder, speedRate);
      const duration = getAudioDuration(audioPath);
      console.log(`[FinanceVideo] Scene ${i + 1} [Rate ${speedRate}] Audio Duration: ${duration.toFixed(2)}s - "${scene.audio.slice(0, 30)}..."`);

      // Generate exact visual slide for this scene
      const svg = createSceneSlideSvg(topic, scene, i, scenes.length);
      const slidePath = path.join(sessionFolder, `slide_${i}.png`);
      await sharp(Buffer.from(svg)).png().toFile(slidePath);

      sceneData.push({
        audioPath,
        slidePath,
        duration: Math.max(2.5, duration)
      });
    }

    // Step 3: Combine all audio files into a single master audio track
    onProgress({ step: 3, message: 'सभी सीन के ऑडियो को एक साथ जोड़ा जा रहा है...' });
    const audioConcatList = path.join(sessionFolder, 'audio_concat.txt');
    const audioConcatContent = sceneData.map(s => `file '${s.audioPath.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(audioConcatList, audioConcatContent);

    const masterAudioPath = path.join(sessionFolder, 'master_audio.mp3');
    await new Promise((resolve, reject) => {
      const proc = spawn(ffmpegPath, [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', audioConcatList,
        '-c', 'copy',
        masterAudioPath
      ]);
      proc.on('close', code => {
        if (code === 0) resolve();
        else reject(new Error(`Audio concat exited with code ${code}`));
      });
      proc.on('error', reject);
    });

    const totalAudioDuration = getAudioDuration(masterAudioPath);
    console.log(`[FinanceVideo] Total Master Audio Duration: ${totalAudioDuration.toFixed(2)}s`);

    // Step 3.5: Mix Voice with Background Music (BGM) & Sound Effects (SFX)
    onProgress({ step: 3, message: 'बैकग्राउंड म्यूजिक (BGM) और साउंड इफेक्ट्स (SFX) मिक्स किए जा रहे हैं...' });
    const bgmChoice = (topic.serialNumber % 2 === 0) ? 'bgm_passion.mp3' : 'bgm_motivational.mp3';
    const finalAudioTrack = await mixAudioWithBgmAndSfx({
      masterAudioPath,
      totalAudioDuration,
      sceneData,
      sessionFolder,
      bgmChoice
    });

    // Step 4: Prepare video concat list matching exact scene audio durations
    onProgress({ step: 4, message: '1080x1920 HD वीडियो रेंडर हो रहा है (FFmpeg)...' });
    let videoConcatContent = '';
    sceneData.forEach(s => {
      const p = s.slidePath.replace(/\\/g, '/');
      videoConcatContent += `file '${p}'\n`;
      videoConcatContent += `duration ${s.duration.toFixed(3)}\n`;
    });
    // Repeat last image to prevent dropped final frames
    const lastSlide = sceneData[sceneData.length - 1].slidePath.replace(/\\/g, '/');
    videoConcatContent += `file '${lastSlide}'\n`;

    const videoConcatList = path.join(sessionFolder, 'video_concat.txt');
    fs.writeFileSync(videoConcatList, videoConcatContent);

    // Step 5: Render final MP4 with synchronized video, voice, BGM & SFX
    const cleanTitle = topic.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    const padded = topic.paddedNumber || String(topic.serialNumber || 1).padStart(4, '0');
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const outputFilename = `Finance_#${padded}_${cleanTitle}_${timestamp}.mp4`;
    const finalVideoPath = path.join(OUTPUT_DIR, outputFilename);

    console.log(`[FinanceVideo] Rendering final video with BGM & SFX to: ${finalVideoPath}`);

    await new Promise((resolve, reject) => {
      const args = [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', videoConcatList,
        '-i', finalAudioTrack,
        '-c:v', 'libx264',
        '-r', '30',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        finalVideoPath
      ];

      const proc = spawn(ffmpegPath, args);
      proc.on('close', code => {
        if (code === 0) resolve();
        else reject(new Error(`FFmpeg exited with code ${code}`));
      });
      proc.on('error', reject);
    });

    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[FinanceVideo] ✅ Multi-Scene Video with Viral Hook created in ${elapsedSeconds}s: ${outputFilename}`);

    onProgress({ step: 5, message: '✅ वीडियो बनकर तैयार है और लोकल में सेव हो चुका है!' });

    return {
      success: true,
      filename: outputFilename,
      filePath: finalVideoPath,
      videoPath: finalVideoPath,
      duration: totalAudioDuration,
      topic: topic.title,
      topicData: topic,
      headline: topic.headline,
      serialNumber: topic.serialNumber,
      paddedNumber: topic.paddedNumber || String(topic.serialNumber).padStart(4, '0'),
      sceneCount: scenes.length,
      elapsedTime: `${elapsedSeconds}s`
    };
  } catch (error) {
    console.error('[FinanceVideo] Error generating video:', error);
    throw error;
  }
}

module.exports = {
  generateFinanceVideo,
  OUTPUT_DIR
};

// Allow CLI execution: node finance-video-generator.js
if (require.main === module) {
  console.log('🚀 Generating Multi-Scene Synchronized Finance Video with Viral Hook & Pacing...');
  generateFinanceVideo(null, progress => {
    console.log(`[${progress.step}/5] ${progress.message}`);
  }).then(res => {
    console.log('\n===========================================');
    console.log('🎉 HIGH-RETENTION VIDEO GENERATED SUCCESSFULLY!');
    console.log('📁 File Path:', res.filePath);
    console.log('⏱️  Duration:', `${res.duration.toFixed(1)}s`);
    console.log('🎬 Total Scenes:', res.sceneCount);
    console.log('💡 Topic:', res.headline);
    console.log('===========================================\n');
  }).catch(err => {
    console.error('Failed to generate video:', err);
  });
}
