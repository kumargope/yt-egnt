const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

const CREDENTIALS_PATH = path.join(__dirname, 'config', 'credentials.json');
const TOKENS_PATH = path.join(__dirname, 'config', 'tokens.json');

/**
 * Check if YouTube OAuth credentials are configured
 */
function isYouTubeConfigured() {
  if (
    process.env.YOUTUBE_CLIENT_ID &&
    process.env.YOUTUBE_CLIENT_SECRET &&
    process.env.YOUTUBE_REFRESH_TOKEN
  ) {
    return true;
  }

  if (fs.existsSync(CREDENTIALS_PATH) && fs.existsSync(TOKENS_PATH)) {
    try {
      const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
      const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
      if (
        (creds.youtube?.client_id || creds.client_id) &&
        (creds.youtube?.client_secret || creds.client_secret) &&
        (tokens.youtube?.refresh_token || tokens.refresh_token)
      ) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Get authenticated Google OAuth2 Client
 */
function getOAuthClient() {
  let clientId = process.env.YOUTUBE_CLIENT_ID;
  let clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  let refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    if (fs.existsSync(CREDENTIALS_PATH) && fs.existsSync(TOKENS_PATH)) {
      const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
      const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
      clientId = clientId || creds.youtube?.client_id || creds.client_id;
      clientSecret = clientSecret || creds.youtube?.client_secret || creds.client_secret;
      refreshToken = refreshToken || tokens.youtube?.refresh_token || tokens.refresh_token;
    }
  }

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'YouTube OAuth credentials missing! Please configure YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN.'
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:8080/callback');
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

/**
 * Upload video to YouTube with complete SEO metadata
 *
 * @param {Object} params
 * @param {string} params.videoPath - Absolute path to .mp4 video file
 * @param {Object} params.seo - Complete SEO metadata from finance-seo-generator
 * @param {string} [params.privacyStatus] - 'public' | 'unlisted' | 'private'
 */
async function uploadToYouTube({ videoPath, seo, privacyStatus = 'public' }) {
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found at: ${videoPath}`);
  }

  const fileSize = fs.statSync(videoPath).size;
  if (fileSize === 0) {
    throw new Error(`Video file is empty: ${videoPath}`);
  }

  console.log(`\n===========================================`);
  console.log(`🚀 Starting Automatic YouTube Shorts Upload...`);
  console.log(`📁 File: ${path.basename(videoPath)} (${(fileSize / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`📌 Title: ${seo.title}`);
  console.log(`🔒 Privacy: ${privacyStatus}`);
  console.log(`🏷️  Tags Count: ${seo.tags.length}`);
  console.log(`===========================================\n`);

  const auth = getOAuthClient();
  const youtube = google.youtube({ version: 'v3', auth });

  const requestBody = {
    snippet: {
      title: seo.title,
      description: seo.description,
      tags: seo.tags,
      categoryId: seo.categoryId || '27',
      defaultLanguage: seo.defaultLanguage || 'hi',
      defaultAudioLanguage: seo.defaultAudioLanguage || 'hi'
    },
    status: {
      privacyStatus: privacyStatus || seo.privacyStatus || 'public',
      selfDeclaredMadeForKids: false,
      embeddable: true,
      license: 'youtube'
    }
  };

  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody,
    media: {
      body: fs.createReadStream(videoPath)
    }
  });

  const videoId = response.data.id;
  const videoUrl = `https://www.youtube.com/shorts/${videoId}`;

  console.log(`\n🎉 UPLOAD SUCCESSFUL!`);
  console.log(`🆔 Video ID: ${videoId}`);
  console.log(`🔗 Shorts URL: ${videoUrl}`);
  console.log(`===========================================\n`);

  return {
    success: true,
    videoId,
    videoUrl,
    title: seo.title,
    uploadedAt: new Date().toISOString()
  };
}

module.exports = {
  isYouTubeConfigured,
  getOAuthClient,
  uploadToYouTube
};
