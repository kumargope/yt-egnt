/**
 * Master Daily Finance Short Runner
 * Generates the next sequential 30-sec Finance Short with:
 * - High-retention Hindi narration & dynamic infographic layouts
 * - Motivational BGM & synchronized SFX
 * - Complete Viral SEO Metadata (Title, Description, Tags, Category)
 * - Automatic YouTube Upload (via GitHub Actions or locally)
 */

const fs = require('fs');
const path = require('path');
const { generateFinanceVideo } = require('./finance-video-generator');
const { generateFinanceSEO } = require('./finance-seo-generator');
const { isYouTubeConfigured, uploadToYouTube } = require('./youtube-uploader');
const { getTopicBySerial } = require('./serial-tracker');
require('dotenv').config();

const TRACKER_PATH = path.join(__dirname, 'serial_tracker.json');

async function main() {
  const args = process.argv.slice(2);
  const shouldUpload = args.includes('--upload') || process.env.AUTO_UPLOAD === 'true';

  console.log(`\n=============================================================`);
  console.log(`🚀 AUTOMATED DAILY FINANCE SHORT PIPELINE`);
  console.log(`=============================================================`);
  console.log(`Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
  console.log(`Upload to YouTube: ${shouldUpload ? 'YES (Auto-Upload)' : 'NO (Generate Video Only)'}`);
  console.log(`=============================================================\n`);

  // Step 1: Generate Video
  const videoResult = await generateFinanceVideo(null, (p) => {
    console.log(`[Pipeline] [${p.step}/5] ${p.message}`);
  });

  const actualVideoPath = videoResult.videoPath || videoResult.filePath;
  const filename = videoResult.filename;
  const topic = videoResult.topicData || getTopicBySerial(videoResult.serialNumber);

  // Step 2: Generate Complete SEO Metadata
  console.log(`\n[SEO] 🎯 Generating Viral YouTube Shorts SEO Metadata...`);
  const seo = generateFinanceSEO(topic);

  // Save SEO alongside video
  const seoPath = actualVideoPath.replace(/\.mp4$/i, '.seo.json');
  fs.writeFileSync(seoPath, JSON.stringify(seo, null, 2), 'utf8');
  console.log(`[SEO] ✅ SEO metadata saved to: ${path.basename(seoPath)}`);
  console.log(`[SEO] 📌 Title: ${seo.title}`);
  console.log(`[SEO] 🏷️  Tags: ${seo.tags.slice(0, 6).join(', ')}... (${seo.tags.length} total)`);

  // Step 3: Handle Automatic YouTube Upload
  let uploadInfo = null;
  if (shouldUpload) {
    if (isYouTubeConfigured()) {
      try {
        console.log(`\n[YouTube] 📤 Auto-uploading to YouTube channel...`);
        uploadInfo = await uploadToYouTube({
          videoPath: actualVideoPath,
          seo,
          privacyStatus: process.env.YOUTUBE_PRIVACY_STATUS || 'public'
        });

        // Record upload info into serial_tracker.json
        if (fs.existsSync(TRACKER_PATH)) {
          try {
            const tracker = JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf8'));
            if (tracker.history && tracker.history.length > 0) {
              const latest = tracker.history[0];
              latest.youtubeId = uploadInfo.videoId;
              latest.youtubeUrl = uploadInfo.videoUrl;
              latest.uploadedAt = uploadInfo.uploadedAt;
              latest.privacyStatus = process.env.YOUTUBE_PRIVACY_STATUS || 'public';
              fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2), 'utf8');
            }
          } catch (tErr) {
            console.warn('[Pipeline] Could not update tracker with upload info:', tErr.message);
          }
        }
      } catch (uploadErr) {
        console.error(`\n❌ [YouTube] Upload failed:`, uploadErr.message);
        console.error(`Video file is safely preserved locally at: ${actualVideoPath}`);
        if (process.env.GITHUB_ACTIONS) {
          // Don't crash GitHub action if quota exceeded or minor network glitch
          console.warn('[GitHub Actions] Continuing workflow so tracker is preserved.');
        }
      }
    } else {
      console.warn(`\n⚠️ [YouTube] Upload skipped: YouTube OAuth credentials are not configured.`);
      console.log(`To enable auto-uploading:`);
      console.log(`1. Run locally: node setup-youtube-oauth.js`);
      console.log(`2. Add the generated secrets to GitHub: Settings -> Secrets -> Actions`);
      console.log(`   - YOUTUBE_CLIENT_ID`);
      console.log(`   - YOUTUBE_CLIENT_SECRET`);
      console.log(`   - YOUTUBE_REFRESH_TOKEN\n`);
    }
  }

  console.log(`\n=============================================================`);
  console.log(`🎉 DAILY PIPELINE COMPLETED SUCCESSFULLY!`);
  console.log(`=============================================================`);
  console.log(`🎬 Video:  ${filename}`);
  console.log(`⏱️ Duration: ${videoResult.duration?.toFixed(1) || '30.0'}s`);
  console.log(`📁 File:   ${actualVideoPath}`);
  if (uploadInfo) {
    console.log(`🚀 Live YouTube Shorts URL: ${uploadInfo.videoUrl}`);
  }
  console.log(`=============================================================\n`);

  return { videoResult, seo, uploadInfo };
}

if (require.main === module) {
  main().catch(err => {
    console.error('\n❌ Fatal error in daily short pipeline:', err);
    process.exit(1);
  });
}

module.exports = { main };
