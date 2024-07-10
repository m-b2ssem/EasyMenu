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
        {name: 'français', code: 'fr'}, // French
        {name: 'italiano', code: 'it'}, // Italian
        {name: '日本語', code: 'ja'}, // Japanese
        {name: 'Slovak', code: 'sk'}, // Slovak
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