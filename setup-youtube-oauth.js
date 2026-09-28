/**
 * Setup YouTube OAuth CLI Tool
 * Easily generates YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN
 * Saves them locally to .env and displays them for GitHub Secrets!
 */

const { google } = require('googleapis');
const http = require('http');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');
require('dotenv').config();

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultValue = '') {
  return new Promise(resolve => {
    const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
    rl.question(prompt, answer => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function main() {
  console.log(`\n=============================================================`);
  console.log(`🔐 YouTube OAuth & GitHub Actions Auto-Uploader Setup`);
  console.log(`=============================================================`);
  console.log(`This tool connects your YouTube Channel and generates the`);
  console.log(`OAuth Refresh Token required for 100% automated uploads via GitHub Actions!\n`);

  // Step 1: Client ID & Secret
  let defaultClientId = process.env.YOUTUBE_CLIENT_ID || '';
  let defaultClientSecret = process.env.YOUTUBE_CLIENT_SECRET || '';

  const credsPath = path.join(__dirname, 'config', 'credentials.json');
  if (fs.existsSync(credsPath)) {
    try {
      const c = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
      defaultClientId = defaultClientId || c.youtube?.client_id || c.installed?.client_id || c.web?.client_id || '';
      defaultClientSecret = defaultClientSecret || c.youtube?.client_secret || c.installed?.client_secret || c.web?.client_secret || '';
    } catch {}
  }

  let clientId = defaultClientId;
  let clientSecret = defaultClientSecret;

  if (!clientId || !clientSecret) {
    clientId = await ask('1. Enter your Google Client ID', defaultClientId);
    clientSecret = await ask('2. Enter your Google Client Secret', defaultClientSecret);
  } else {
    console.log(`✅ Found credentials automatically from config/credentials.json!`);
    console.log(`Client ID: ${clientId}\n`);
  }

  if (!clientId || !clientSecret) {
    console.error('\n❌ Error: Client ID and Client Secret are required!');
    console.log('Get them from Google Cloud Console (APIs & Services -> Credentials -> Create OAuth 2.0 Client ID)');
    rl.close();
    process.exit(1);
  }

  const PORT = 8080;
  const REDIRECT_URI = `http://localhost:${PORT}`;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' // ensures refresh_token is returned
  });

  // Step 2: Start local callback receiver server
  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
      if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/callback') {
        const code = parsedUrl.searchParams.get('code');
        const error = parsedUrl.searchParams.get('error');

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`<h2>❌ Authorization Failed: ${error}</h2>`);
          console.error(`\n❌ Authorization failed: ${error}`);
          server.close();
          rl.close();
          return;
        }

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background: #0f172a; color: #fff;">
              <h1 style="color: #22c55e;">🎉 YouTube Authorization Successful!</h1>
              <p style="font-size: 18px;">Refresh Token generated successfully. You can close this tab and check your terminal.</p>
            </div>
          `);

          const { tokens } = await oauth2Client.getToken(code);
          const refreshToken = tokens.refresh_token;

          if (!refreshToken) {
            console.warn('\n⚠️ Warning: Google did not return a refresh token.');
            console.warn('Go to https://myaccount.google.com/permissions, remove access for this app, and run setup again with prompt=consent.');
          }

          // Save to .env
          let envContent = '';
          const envPath = path.join(__dirname, '.env');
          if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
          }

          function setEnvVar(name, val) {
            const regex = new RegExp(`^${name}=.*$`, 'm');
            if (regex.test(envContent)) {
              envContent = envContent.replace(regex, `${name}=${val}`);
            } else {
              envContent += `\n${name}=${val}`;
            }
          }

          setEnvVar('YOUTUBE_CLIENT_ID', clientId);
          setEnvVar('YOUTUBE_CLIENT_SECRET', clientSecret);
          if (refreshToken) setEnvVar('YOUTUBE_REFRESH_TOKEN', refreshToken);
          setEnvVar('YOUTUBE_PRIVACY_STATUS', 'public');

          fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

          // Save to config/tokens.json as fallback
          const configDir = path.join(__dirname, 'config');
          if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
          fs.writeFileSync(
            path.join(configDir, 'tokens.json'),
            JSON.stringify({ youtube: tokens }, null, 2),
            'utf8'
          );

          console.log(`\n=============================================================`);
          console.log(`✅ SUCCESS! YouTube Credentials Generated & Saved Locally`);
          console.log(`=============================================================`);
          console.log(`Saved locally to: ${envPath}`);
          console.log(`\n🔑 GITHUB REPOSITORY SECRETS (Copy-paste these into GitHub!):`);
          console.log(`Go to: GitHub Repo -> Settings -> Secrets and variables -> Actions -> New repository secret\n`);
          console.log(`1. Secret Name:  YOUTUBE_CLIENT_ID`);
          console.log(`   Secret Value: ${clientId}\n`);
          console.log(`2. Secret Name:  YOUTUBE_CLIENT_SECRET`);
          console.log(`   Secret Value: ${clientSecret}\n`);
          console.log(`3. Secret Name:  YOUTUBE_REFRESH_TOKEN`);
          console.log(`   Secret Value: ${refreshToken || 'Check tokens.json'}\n`);
          console.log(`=============================================================`);

          server.close();
          rl.close();
          process.exit(0);
        }
      }
    } catch (err) {
      console.error('\n❌ Token exchange error:', err.message);
      server.close();
      rl.close();
      process.exit(1);
    }
  });

  server.listen(PORT, () => {
    console.log(`\n👉 Opening browser for YouTube authorization...`);
    console.log(`If it doesn't open automatically, open this URL in your browser:`);
    console.log(`\n${authUrl}\n`);

    const openCmd = process.platform === 'win32'
      ? `start "" "${authUrl}"`
      : process.platform === 'darwin'
      ? `open "${authUrl}"`
      : `xdg-open "${authUrl}"`;

    exec(openCmd, () => {});
  });
}

main().catch(err => {
  console.error('Fatal error:', err);
  rl.close();
  process.exit(1);
});
