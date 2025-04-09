// Script to copy variables from .env to local.settings.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

// Path to local.settings.json
const settingsPath = path.resolve(__dirname, '../local.settings.json');

// Read existing local.settings.json
let settings;
try {
  const settingsContent = fs.readFileSync(settingsPath, 'utf8');
  settings = JSON.parse(settingsContent);
} catch (error) {
  console.error('Error reading local.settings.json:', error);
  process.exit(1);
}

// Update settings with environment variables
const envVarsToSync = ['MARVEL_PUBLIC_KEY', 'MARVEL_PRIVATE_KEY', 'MARVEL_API_BASE'];
envVarsToSync.forEach(key => {
  if (process.env[key]) {
    settings.Values[key] = process.env[key];
  }
});

// Write updated settings back to local.settings.json
try {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  console.log('Successfully updated local.settings.json with values from .env');
} catch (error) {
  console.error('Error writing to local.settings.json:', error);
  process.exit(1);
}