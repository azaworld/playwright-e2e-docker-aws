// Required environment variables:
// SFTP_HOST, SFTP_PORT, SFTP_USER, SFTP_PASS
const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const sftp = new Client();

const config = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT ? parseInt(process.env.SFTP_PORT) : 22,
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASS,
};

if (!config.host || !config.username || !config.password) {
  console.error('❌ Missing SFTP credentials. Please set SFTP_HOST, SFTP_USER, SFTP_PASS in your environment or .env file.');
  process.exit(1);
}

const localDir = path.join(__dirname, 'playwright-report');
const remoteDir = '/var/www/html/reports/latest';
const publicUrl = 'http://54.215.243.212/reports/latest/index.html';

async function uploadDir(local, remote) {
  const files = fs.readdirSync(local);
  for (const file of files) {
    const localPath = path.join(local, file);
    const remotePath = remote + '/' + file;
    if (fs.lstatSync(localPath).isDirectory()) {
      try { await sftp.mkdir(remotePath, true); } catch (e) {}
      await uploadDir(localPath, remotePath);
    } else {
      await sftp.fastPut(localPath, remotePath);
      console.log(`Uploaded: ${localPath} -> ${remotePath}`);
    }
  }
}

(async () => {
  try {
    await sftp.connect(config);
    try { await sftp.rmdir(remoteDir, true); } catch (e) {}
    await sftp.mkdir(remoteDir, true);
    await uploadDir(localDir, remoteDir);
    console.log('✅ Report uploaded!');
    console.log('Public URL:', publicUrl);
  } catch (err) {
    console.error('❌ Upload failed:', err);
  } finally {
    sftp.end();
  }
})(); 