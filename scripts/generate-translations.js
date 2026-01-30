// Script to generate translation files for all languages
// This creates translation files that fall back to English structure
// You can then fill in proper translations later

const fs = require('fs');
const path = require('path');

const enTranslation = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../public/locales/en/common.json'), 'utf8')
);

const languages = [
  'fr', 'de', 'zh', 'ar', 'hi', 'pt', 'ru', 'ja', 'ko', 'it', 'nl', 'tr', 'vi', 'th',
  'pl', 'id', 'ms', 'cs', 'sv', 'da', 'fi', 'no', 'he', 'uk', 'ro', 'hu', 'el', 'bg',
  'hr', 'sr', 'sk', 'sl', 'et', 'lv', 'lt', 'is', 'ga', 'mt', 'cy', 'eu', 'ca', 'gl',
  'fa', 'ur', 'bn', 'ta', 'te', 'ml', 'kn', 'gu', 'pa', 'ne', 'si', 'my', 'km', 'lo',
  'ka', 'hy', 'az', 'kk', 'ky', 'uz', 'tg', 'mn', 'sw', 'af', 'zu', 'xh'
];

languages.forEach(lang => {
  const dir = path.join(__dirname, '../public/locales', lang);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filePath = path.join(dir, 'common.json');
  
  // For now, use English structure (will fall back properly)
  // You can replace these with proper translations later
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(enTranslation, null, 2), 'utf8');
    console.log(`Created ${lang}/common.json`);
  }
});

console.log('Translation files generated!');
console.log('Note: These files currently use English structure.');
console.log('Please replace with proper translations for each language.');



