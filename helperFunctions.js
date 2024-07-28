import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { name } from 'ejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Adjusted language list with ISO 639-1 codes where available
export async function createLangaugeList(language) {
    const allLanguages = [
        { name: 'English', code: 'en' },
        { name: 'عربي', code: 'ar' }, // Arabic
        { name: 'Deutsch', code: 'de' }, // German
        { name: 'Türkçe', code: 'tr' }, // Turkish
        { name: 'Español', code: 'es' }, // Spanish
        { name: 'français', code: 'fr' }, // French
        { name: 'italiano', code: 'it' }, // Italian
        { name: '日本語', code: 'ja' }, // Japanese
        { name: 'Slovak', code: 'sk' }, // Slovak
        { name: 'Português', code: 'pt' }, // Portuguese
        { name: 'Русский', code: 'ru' }, // Russian
        { name: '中文', code: 'zh' }, // Chinese
        { name: '한국어', code: 'ko' }, // Korean
        { name: 'Dutch', code: 'nl' }, // Dutch
        { name: 'ελληνικά', code: 'el' }, // Greek
        { name: 'हिन्दी', code: 'hi' }, // Hindi
        { name: 'ไทย', code: 'th' }, // Thai
        { name: 'Svenska', code: 'sv' }, // Swedish
        { name: 'Polski', code: 'pl' }, // Polish
        { name: 'עברית', code: 'he' }, // Hebrew
        { name: 'Suomi', code: 'fi' }, // Finnish
        { name: 'Dansk', code: 'da' }, // Danish
        { name: 'Norsk', code: 'no' }, // Norwegian
        { name: 'Magyar', code: 'hu' }, // Hungarian
        { name: 'Čeština', code: 'cs' }, // Czech
        { name: 'Українська', code: 'uk' }, // Ukrainian
        { name: 'Română', code: 'ro' }, // Romanian
        { name: 'Bahasa Indonesia', code: 'id' }, // Indonesian
        { name: 'Tiếng Việt', code: 'vi' }, // Vietnamese
        { name: 'فارسی', code: 'fa' }, // Persian
        { name: 'தமிழ்', code: 'ta' }, // Tamil
        { name: 'తెలుగు', code: 'te' }, // Telugu
        { name: 'മലയാളം', code: 'ml' }, // Malayalam
        { name: 'বাংলা', code: 'bn' }, // Bengali
        { name: 'ગુજરાતી', code: 'gu' }, // Gujarati
        { name: 'ਪੰਜਾਬੀ', code: 'pa' }, // Punjabi
        { name: 'اردو', code: 'ur' }, // Urdu
        { name: 'Bahasa Melayu', code: 'ms' }, // Malay
        { name: 'Filipino', code: 'fil' }, // Filipino
        { name: 'slovenščina', code: 'sl' }, // Slovenian
        { name: 'Hrvatski', code: 'hr' }, // Croatian
        { name: 'Srpski', code: 'sr' }, // Serbian
        { name: 'Bosanski', code: 'bs' }, // Bosnian
        { name: 'Македонски', code: 'mk' }, // Macedonian
        { name: 'Shqip', code: 'sq' }, // Albanian
        { name: 'български', code: 'bg' }, // Bulgarian
        { name: 'Eesti', code: 'et' }, // Estonian
        { name: 'Latviešu', code: 'lv' }, // Latvian
        { name: 'Lietuvių', code: 'lt' }, // Lithuanian
        { name: 'Galego', code: 'gl' }, // Galician
        { name: 'Català', code: 'ca' }, // Catalan
        { name: 'Íslenska', code: 'is' }, // Icelandic
        { name: 'Malti', code: 'mt' }, // Maltese
        { name: 'ქართული', code: 'ka' }, // Georgian
        { name: 'Հայերեն', code: 'hy' }, // Armenian
        { name: 'Azərbaycanca', code: 'az' }, // Azerbaijani
        { name: 'қазақ тілі', code: 'kk' }, // Kazakh
        { name: 'Ўзбек', code: 'uz' }, // Uzbek
        { name: 'Кыргызча', code: 'ky' }, // Kyrgyz
        { name: 'नेपाली', code: 'ne' }, // Nepali
        { name: 'සිංහල', code: 'si' }, // Sinhala
        { name: 'Kiswahili', code: 'sw' }, // Swahili
        { name: 'Amharic', code: 'am' }, // Amharic
        { name: 'Yorùbá', code: 'yo' }, // Yoruba
        { name: 'Igbo', code: 'ig' }, // Igbo
        { name: 'Hausa', code: 'ha' }, // Hausa
        { name: 'Sesotho', code: 'st' }, // Sesotho
        { name: 'Xitsonga', code: 'ts' }, // Tsonga
        { name: 'isiZulu', code: 'zu' }, // Zulu
        { name: 'isiXhosa', code: 'xh' }, // Xhosa
        { name: 'Luganda', code: 'lg' }, // Luganda
        { name: 'मराठी', code: 'mr' }, // Marathi
        { name: 'ಕನ್ನಡ', code: 'kn' }, // Kannada
        { name: 'беларуская', code: 'be' }, // Belarusian
        { name: 'Монгол', code: 'mn' }, // Mongolian
        { name: 'Kurdî', code: 'ku' }, // Kurdish
    ];
    

    const primaryLanguage = allLanguages.find(lang => lang.name === language);
    if (!primaryLanguage) {
        return allLanguages; // Return all languages if the input language is not found
    }

    const otherLanguages = allLanguages.filter(lang => lang.name !== language);
    return [primaryLanguage, ...otherLanguages];
}


export async function convertArrayBufferToBase64(buffer) {
    return  Buffer.from(buffer).toString('base64');
}


export async function cehckSizeandConvertTOBytea(file) {
    try {
        const compressedImageBuffer = await sharp(file.buffer)
        .resize({ // Resize the image
          width: 800, // You can adjust this width as needed
          height: 800, // You can adjust this height as needed
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .toFormat('jpeg')
        .jpeg({ quality: 100 }) // Adjust the quality to compress
        .toBuffer();
  
        if (compressedImageBuffer.length > 2 * 1024 * 1024) { // 2 MB limit
            return null;
        }
        return compressedImageBuffer;
    } catch (error) {
        console.error('Error converting image to bytea:', error);
    }
}

export async function  formatDate(date) {
    const pad = (num, size) => String(num).padStart(size, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1, 2); // Months are zero-indexed
    const day = pad(date.getDate(), 2);
    const hours = pad(date.getHours(), 2);
    const minutes = pad(date.getMinutes(), 2);
    const seconds = pad(date.getSeconds(), 2);
    const milliseconds = pad(date.getMilliseconds(), 3);
    const microseconds = '000'; // JavaScript Date object does not support microseconds

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}`;
}

async function isNumber(value) {
    // Regular expression to check if the value is a valid number
    const regex = /^-?\d+(\.\d+)?$/;
    return regex.test(value) && !isNaN(parseFloat(value));
}


export async function parsePrice(price) {
    if (isNumber(price)) {
        return parseFloat(price);
    } else {
        return NaN; // or handle the invalid input as needed
    }
}