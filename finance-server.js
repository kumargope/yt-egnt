const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { generateFinanceVideo, OUTPUT_DIR } = require('./finance-video-generator');
const { getCurrentSerial, getAllTopicsSummary, getTopicBySerial } = require('./serial-tracker');
const { generateFinanceSEO } = require('./finance-seo-generator');
const { isYouTubeConfigured, uploadToYouTube } = require('./youtube-uploader');

const app = express();
const PORT = process.env.FINANCE_PORT || 5000;

app.use(express.json());
app.use('/videos', express.static(OUTPUT_DIR));

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Get list of generated videos
app.get('/api/videos', (req, res) => {
  try {
    const files = fs.readdirSync(OUTPUT_DIR)
      .filter(f => f.endsWith('.mp4'))
      .map(f => {
        const fullPath = path.join(OUTPUT_DIR, f);
        const stats = fs.statSync(fullPath);
        const seoPath = fullPath.replace(/\.mp4$/i, '.seo.json');
        let seo = null;
        if (fs.existsSync(seoPath)) {
          try { seo = JSON.parse(fs.readFileSync(seoPath, 'utf8')); } catch {}
        }
        return {
          filename: f,
          url: `/videos/${encodeURIComponent(f)}`,
          sizeMb: (stats.size / (1024 * 1024)).toFixed(2),
          createdAt: stats.birthtime,
          fullPath,
          seo
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, videos: files });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get 1000 topics list with current serial tracker status
app.get('/api/topics', (req, res) => {
  try {
    const topics = getAllTopicsSummary();
    const currentSerial = getCurrentSerial();
    const nextTopic = getTopicBySerial(currentSerial);
    res.json({
      success: true,
      currentSerial,
      totalCount: topics.length,
      nextTopic: {
        serialNumber: nextTopic.serialNumber,
        paddedNumber: nextTopic.paddedNumber,
        headline: nextTopic.headline,
        title: nextTopic.title
      },
      topics
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Single Click Generate Endpoint (Runs sequentially 1, 2, 3... or specific topic)
let isGenerating = false;
let currentProgress = { step: 0, message: 'Ready' };

app.post('/api/generate', async (req, res) => {
  if (isGenerating) {
    return res.status(429).json({ success: false, error: 'एक वीडियो पहले से जनरेट हो रहा है, कृपया थोड़ा इंतजार करें!' });
  }

  isGenerating = true;
  currentProgress = { step: 1, message: 'शुरू हो रहा है...' };

  const { topicId } = req.body || {};

  try {
    const result = await generateFinanceVideo(topicId || null, progress => {
      currentProgress = progress;
    });

    // Generate and save SEO metadata
    const seo = generateFinanceSEO(result.topic);
    const seoPath = result.videoPath.replace(/\.mp4$/i, '.seo.json');
    fs.writeFileSync(seoPath, JSON.stringify(seo, null, 2), 'utf8');

    isGenerating = false;
    currentProgress = { step: 5, message: 'सफल! वीडियो तैयार है।' };
    res.json({
      success: true,
      video: result,
      seo,
      nextSerial: getCurrentSerial()
    });
  } catch (err) {
    isGenerating = false;
    currentProgress = { step: 0, message: 'Failed: ' + err.message };
    res.status(500).json({ success: false, error: err.message });
  }
});

// YouTube Status Endpoint
app.get('/api/youtube/status', (req, res) => {
  res.json({
    configured: isYouTubeConfigured(),
    privacyStatus: process.env.YOUTUBE_PRIVACY_STATUS || 'public'
  });
});

// YouTube Upload Endpoint
app.post('/api/youtube/upload', async (req, res) => {
  const { filename } = req.body || {};
  if (!filename) {
    return res.status(400).json({ success: false, error: 'Filename is required' });
  }

  const videoPath = path.join(OUTPUT_DIR, filename);
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ success: false, error: 'Video file not found' });
  }

  if (!isYouTubeConfigured()) {
    return res.status(400).json({
      success: false,
      error: 'YouTube credentials are not configured. Run "node setup-youtube-oauth.js" in your terminal first.'
    });
  }

  try {
    const seoPath = videoPath.replace(/\.mp4$/i, '.seo.json');
    let seo = null;
    if (fs.existsSync(seoPath)) {
      seo = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
    } else {
      const serialMatch = filename.match(/#(\d+)/);
      if (serialMatch) {
        const topic = getTopicBySerial(parseInt(serialMatch[1]));
        seo = generateFinanceSEO(topic);
      } else {
        seo = {
          title: `${filename.replace(/\.mp4$/i, '')} #shorts`,
          description: 'Auto-generated Finance Short #shorts #finance',
          tags: ['shorts', 'finance', 'money', 'investing']
        };
      }
    }

    const uploadResult = await uploadToYouTube({
      videoPath,
      seo,
      privacyStatus: process.env.YOUTUBE_PRIVACY_STATUS || 'public'
    });

    res.json({ success: true, ...uploadResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get current progress
app.get('/api/progress', (req, res) => {
  res.json({ isGenerating, ...currentProgress });
});

// Open Folder in Windows Explorer
app.post('/api/open-folder', (req, res) => {
  try {
    exec(`explorer.exe "${OUTPUT_DIR}"`);
    res.json({ success: true, path: OUTPUT_DIR });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Main HTML Page
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ 1,000 Finance Videos Machine (Sequential Auto-Runner)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at top, #111827, #030712);
      color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
    }
    .container {
      max-width: 960px;
      width: 100%;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .badge-bar {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .badge {
      display: inline-block;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
    }
    .badge-gold {
      background: rgba(250, 204, 21, 0.15);
      color: #facc15;
      border: 1px solid rgba(250, 204, 21, 0.4);
    }
    h1 {
      font-size: 36px;
      font-weight: 900;
      background: linear-gradient(135deg, #facc15, #f59e0b, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #9ca3af;
      font-size: 15px;
    }
    .hero-card {
      background: rgba(17, 24, 39, 0.9);
      border: 1px solid rgba(250, 204, 21, 0.3);
      border-radius: 24px;
      padding: 32px 24px;
      text-align: center;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), 0 0 50px rgba(250, 204, 21, 0.08);
      margin-bottom: 30px;
    }
    .serial-indicator {
      background: #1f2937;
      border: 2px solid #facc15;
      border-radius: 18px;
      padding: 14px 20px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 22px;
      box-shadow: 0 4px 20px rgba(250, 204, 21, 0.15);
      max-width: 100%;
    }
    .serial-number-pill {
      background: #facc15;
      color: #000;
      font-weight: 900;
      font-size: 16px;
      padding: 4px 12px;
      border-radius: 12px;
      letter-spacing: 1px;
    }
    .serial-title-text {
      color: #f3f4f6;
      font-weight: 700;
      font-size: 15px;
      text-align: left;
    }
    .topic-selector {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .topic-selector label {
      font-size: 14px;
      color: #9ca3af;
      font-weight: 600;
    }
    .topic-selector select {
      background: #1f2937;
      color: #f3f4f6;
      border: 1px solid #4b5563;
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 14px;
      outline: none;
      cursor: pointer;
      max-width: 100%;
      width: 650px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
    .run-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 20px 48px;
      font-size: 22px;
      font-weight: 900;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      align-items: center;
      gap: 14px;
      outline: none;
    }
    .run-btn:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 15px 40px rgba(16, 185, 129, 0.6);
      background: linear-gradient(135deg, #34d399, #10b981);
    }
    .run-btn:disabled {
      background: #374151;
      color: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .progress-box {
      margin-top: 24px;
      display: none;
      background: #1f2937;
      border-radius: 16px;
      padding: 20px;
      border: 1px solid #374151;
    }
    .progress-bar-bg {
      background: #374151;
      height: 12px;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .progress-bar-fill {
      background: linear-gradient(90deg, #facc15, #10b981);
      height: 100%;
      width: 0%;
      transition: width 0.4s ease;
    }
    .progress-status {
      font-size: 15px;
      font-weight: 600;
      color: #fbbf24;
    }
    .player-section {
      display: none;
      margin-top: 28px;
      background: #030712;
      border: 1px solid #374151;
      border-radius: 20px;
      padding: 24px;
      text-align: center;
    }
    .player-wrapper {
      max-width: 320px;
      margin: 0 auto 18px auto;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8);
      border: 2px solid #facc15;
    }
    video {
      width: 100%;
      height: auto;
      display: block;
    }
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn-secondary {
      background: #1f2937;
      color: #f3f4f6;
      border: 1px solid #4b5563;
      padding: 10px 20px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: 0.2s;
    }
    .btn-secondary:hover {
      background: #374151;
      border-color: #9ca3af;
    }
    .history-card {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid #1f2937;
      border-radius: 20px;
      padding: 24px;
    }
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .history-header h3 {
      font-size: 20px;
      color: #e5e7eb;
    }
    .video-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px;
      border-radius: 12px;
      background: #111827;
      border: 1px solid #1f2937;
      margin-bottom: 10px;
      transition: 0.2s;
    }
    .video-item:hover {
      background: #1e293b;
      border-color: #3b82f6;
    }
    .video-info {
      text-align: left;
    }
    .video-name {
      font-weight: 700;
      font-size: 15px;
      color: #f3f4f6;
      margin-bottom: 4px;
    }
    .video-meta {
      font-size: 12px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge-bar">
        <span class="badge badge-gold">📚 TOTAL 1,000 FINANCE TOPICS</span>
        <span class="badge">🔄 SERIAL NUMBER AUTO-RUNNER</span>
        <span class="badge">⚡ ZERO API KEY • 100% FREE</span>
        <span id="ytBadge" class="badge">🔴 YouTube: Checking...</span>
      </div>
      <h1>1,000 Finance Video Machine</h1>
      <p class="subtitle">जितनी बार RUN दबाएंगे, हर बार क्रम अनुसार (#1, #2, #3...) अगला वीडियो अपने आप बनेगा और YouTube SEO भी तैयार होगा!</p>
    </div>

    <div class="hero-card">
      <!-- Live Sequential Status Indicator -->
      <div class="serial-indicator">
        <span class="serial-number-pill" id="serialBadge">NEXT: #0001</span>
        <div class="serial-title-text" id="serialTitle">लोड हो रहा है...</div>
      </div>

      <div class="topic-selector">
        <label for="topicSelect">📋 टॉपिक लिस्ट (1,000 उपलब्ध):</label>
        <select id="topicSelect" onchange="onTopicChange()">
          <option value="">🔄 Auto Serial (अपने आप अगला सीरियल नंबर वीडियो बनाएगा)</option>
        </select>
      </div>

      <button id="runBtn" class="run-btn" onclick="startGeneration()">
        <span style="font-size: 26px;">🚀</span> RUN: अगला वीडियो बनाएं
      </button>

      <div id="progressBox" class="progress-box">
        <div class="progress-bar-bg">
          <div id="progressBar" class="progress-bar-fill"></div>
        </div>
        <div id="progressStatus" class="progress-status">प्रारंभ हो रहा है...</div>
      </div>

      <div id="playerSection" class="player-section">
        <h3 style="color: #34d399; margin-bottom: 14px;">🎉 नया वीडियो बनकर तैयार है!</h3>
        <div class="player-wrapper">
          <video id="videoPlayer" controls autoplay muted></video>
        </div>

        <!-- SEO Metadata Box -->
        <div id="seoBox" style="display:none; background: #0b1329; border: 1px solid #1e3a8a; border-radius: 12px; padding: 16px; margin: 16px 0; text-align: left;">
          <div style="font-weight: 700; color: #60a5fa; margin-bottom: 6px; font-size: 13px;">🎯 VIRAL YOUTUBE SEO METADATA (AUTOGENERATED)</div>
          <div style="font-size: 14px; font-weight: bold; color: #facc15; margin-bottom: 8px;" id="seoTitle"></div>
          <div style="font-size: 12px; color: #94a3b8; max-height: 100px; overflow-y: auto; white-space: pre-wrap; margin-bottom: 8px; font-family: monospace;" id="seoDesc"></div>
          <div style="font-size: 11px; color: #38bdf8;" id="seoTags"></div>
        </div>

        <div class="action-buttons">
          <a id="downloadLink" class="btn-secondary" download>⬇️ डाउनलोड करें</a>
          <button id="uploadYtBtn" class="btn-secondary" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; font-weight: bold;" onclick="uploadCurrentVideo()">🔴 YouTube पर अपलोड करें</button>
          <button class="btn-secondary" onclick="openFolder()">📂 लोकल फोल्डर खोलें</button>
        </div>
      </div>
    </div>

    <div class="history-card">
      <div class="history-header">
        <h3>📁 आपके तैयार वीडियो (Local Output)</h3>
        <button class="btn-secondary" onclick="openFolder()">📂 Open Folder</button>
      </div>
      <div id="videoList">लोड हो रहा है...</div>
    </div>
  </div>

  <script>
    let pollInterval = null;
    let cachedNextTopic = null;
    let currentLoadedFilename = null;
    let currentLoadedSeo = null;

    // Check YouTube OAuth status
    async function checkYouTubeStatus() {
      try {
        const res = await fetch('/api/youtube/status');
        const data = await res.json();
        const badge = document.getElementById('ytBadge');
        if (data.configured) {
          badge.textContent = '🔴 YouTube Connected (Auto-Upload Ready)';
          badge.style.background = 'rgba(239, 68, 68, 0.2)';
          badge.style.color = '#f87171';
          badge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        } else {
          badge.textContent = '⚙️ YouTube: Run setup-youtube-oauth.js';
          badge.style.background = 'rgba(234, 179, 8, 0.15)';
          badge.style.color = '#facc15';
        }
      } catch(e) {}
    }

    // Load topics list and current serial pointer
    async function loadTopics() {
      try {
        const res = await fetch('/api/topics');
        const data = await res.json();
        
        cachedNextTopic = data.nextTopic;
        updateSerialIndicator(data.nextTopic);

        const select = document.getElementById('topicSelect');
        select.innerHTML = '<option value="">🔄 Auto Serial (क्रम संख्या #' + data.nextTopic.paddedNumber + ' - ' + data.nextTopic.headline + ')</option>';

        data.topics.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.id;
          opt.textContent = '#' + t.paddedNumber + ': ' + t.headline + ' [' + t.category + ']';
          select.appendChild(opt);
        });
      } catch (e) {
        console.error('Failed to load topics', e);
      }
    }

    function updateSerialIndicator(nextTopic) {
      if (!nextTopic) return;
      document.getElementById('serialBadge').textContent = 'NEXT: #' + nextTopic.paddedNumber;
      document.getElementById('serialTitle').textContent = nextTopic.headline;
    }

    function onTopicChange() {
      const val = document.getElementById('topicSelect').value;
      if (!val && cachedNextTopic) {
        updateSerialIndicator(cachedNextTopic);
      } else {
        const select = document.getElementById('topicSelect');
        const selectedText = select.options[select.selectedIndex].text;
        document.getElementById('serialTitle').textContent = selectedText;
      }
    }

    // Load past generated videos
    async function loadVideos() {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        const list = document.getElementById('videoList');
        if (!data.videos || data.videos.length === 0) {
          list.innerHTML = '<p style="color:#6b7280; text-align:center; padding: 20px;">अभी तक कोई वीडियो नहीं बना है। ऊपर "RUN" बटन दबाएं!</p>';
          return;
        }

        list.innerHTML = data.videos.map(v => \`
          <div class="video-item">
            <div class="video-info">
              <div class="video-name">\${v.filename}</div>
              <div class="video-meta">
                \${v.sizeMb} MB • \${new Date(v.createdAt).toLocaleString()}
                \${v.seo ? '<span style="color:#facc15; margin-left:8px;">🎯 SEO Ready</span>' : ''}
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-secondary" style="padding: 6px 12px; font-size: 13px;" onclick="playVideo('\${v.url}', '\${v.filename}', \${JSON.stringify(v.seo || null).replace(/"/g, '&quot;')})">▶️ देखें</button>
              <button class="btn-secondary" style="background:#dc2626; color:white; border:none; padding: 6px 12px; font-size: 13px;" onclick="uploadVideo('\${v.filename}')">🔴 YouTube</button>
              <a class="btn-secondary" style="padding: 6px 12px; font-size: 13px;" href="\${v.url}" download>⬇️ सेव</a>
            </div>
          </div>
        \`).join('');
      } catch (e) {
        console.error('Failed to load videos', e);
      }
    }

    function playVideo(url, filename, seo) {
      const section = document.getElementById('playerSection');
      const player = document.getElementById('videoPlayer');
      const dl = document.getElementById('downloadLink');
      player.src = url;
      dl.href = url;
      currentLoadedFilename = filename;
      currentLoadedSeo = seo;

      if (seo) {
        document.getElementById('seoBox').style.display = 'block';
        document.getElementById('seoTitle').textContent = '📌 Title: ' + seo.title;
        document.getElementById('seoDesc').textContent = seo.description;
        document.getElementById('seoTags').textContent = '🏷️ Tags: ' + seo.tags.join(', ');
      } else {
        document.getElementById('seoBox').style.display = 'none';
      }

      section.style.display = 'block';
      section.scrollIntoView({ behavior: 'smooth' });
      player.play();
    }

    async function uploadCurrentVideo() {
      if (!currentLoadedFilename) {
        alert('कृपया पहले कोई वीडियो चुनें!');
        return;
      }
      await uploadVideo(currentLoadedFilename);
    }

    async function uploadVideo(filename) {
      const confirmUpload = confirm(\`क्या आप इस वीडियो को YouTube पर अपलोड करना चाहते हैं?\\n\${filename}\`);
      if (!confirmUpload) return;

      const ytBtn = document.getElementById('uploadYtBtn');
      if (ytBtn) ytBtn.disabled = true;

      try {
        alert('YouTube पर अपलोड शुरू हो रहा है... कृपया 10-20 सेकंड प्रतीक्षा करें!');
        const res = await fetch('/api/youtube/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename })
        });
        const data = await res.json();
        if (data.success) {
          alert(\`🎉 अपलोड सफल!\\nVideo ID: \${data.videoId}\\nURL: \${data.videoUrl}\`);
          window.open(data.videoUrl, '_blank');
        } else {
          alert('❌ अपलोड विफल: ' + data.error);
        }
      } catch (e) {
        alert('❌ अपलोड एरर: ' + e.message);
      } finally {
        if (ytBtn) ytBtn.disabled = false;
      }
    }

    async function startGeneration() {
      const btn = document.getElementById('runBtn');
      const progressBox = document.getElementById('progressBox');
      const progressBar = document.getElementById('progressBar');
      const progressStatus = document.getElementById('progressStatus');
      const selectedTopic = document.getElementById('topicSelect').value;

      btn.disabled = true;
      btn.innerHTML = '⏳ वीडियो बन रहा है...';
      progressBox.style.display = 'block';
      progressBar.style.width = '15%';
      progressStatus.textContent = '1/5: सीरियल नंबर के अनुसार टॉपिक और स्क्रिप्ट चुनी जा रही है...';

      // Start polling progress
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch('/api/progress');
          const data = await res.json();
          if (data.step) {
            progressBar.style.width = (data.step * 20) + '%';
            progressStatus.textContent = data.message;
          }
        } catch (e) {}
      }, 1000);

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topicId: selectedTopic || null })
        });
        const data = await res.json();

        clearInterval(pollInterval);

        if (data.success) {
          progressBar.style.width = '100%';
          progressStatus.textContent = '✅ वीडियो #' + data.video.paddedNumber + ' बनकर तैयार है और लोकल में सेव हो चुका है!';
          playVideo(data.video.filePath ? '/videos/' + encodeURIComponent(data.video.filename) : '', data.video.filename, data.seo);
          loadVideos();
          loadTopics(); // Refresh serial counter to next topic!
        } else {
          progressStatus.textContent = '❌ एरर: ' + data.error;
        }
      } catch (err) {
        clearInterval(pollInterval);
        progressStatus.textContent = '❌ एरर: ' + err.message;
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span style="font-size: 26px;">🚀</span> RUN: अगला सीरियल वीडियो बनाएं';
      }
    }

    async function openFolder() {
      try {
        await fetch('/api/open-folder', { method: 'POST' });
      } catch (e) {
        alert('फोल्डर पाथ: C:\\\\Users\\\\Mukesh\\\\.gemini\\\\antigravity\\\\scratch\\\\yt-agent\\\\output_videos');
      }
    }

    loadTopics();
    loadVideos();
    checkYouTubeStatus();
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ 1,000 Finance Video Machine UI is LIVE!`);
  console.log(`👉 Open: http://localhost:${PORT}`);
  console.log(`📁 Video Output Directory: ${OUTPUT_DIR}`);
  console.log(`======================================================\n`);
});
