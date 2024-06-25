import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Adjusted language list with ISO 639-1 codes where available
export function createLangaugeList(language) {
    const allLanguages = [
        { name: 'English', code: 'en' },
        { name: 'عربي', code: 'ar' }, // Arabic
        { name: 'Deutsch', code: 'de' }, // German
        { name: 'Türkçe', code: 'tr' }, // Turkish
        { name: 'Español', code: 'es' } // Spanish
    ];

    const primaryLanguage = allLanguages.find(lang => lang.name === language);
    if (!primaryLanguage) {
        return allLanguages; // Return all languages if the input language is not found
    }

    const otherLanguages = allLanguages.filter(lang => lang.name !== language);
    return [primaryLanguage, ...otherLanguages];
}



export async function convertArrayBufferToBase64(buffer) {
    return await Buffer.from(buffer).toString('base64');
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

