import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';
import path from 'path';



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

// Adjusted language list with ISO 639-1 codes where available
export async function createCurrencyList(currency) {
    const allCurrencies = [
        { name: 'Euro', code: 'EUR', sign: '€' },
        { name: 'Pound Sterling', code: 'GBP', sign: '£' },
        { name: 'United States Dollar', code: 'USD', sign: '$' },
        { name: 'ريال', code: 'SAR', sign: '﷼' }, // Saudi Riyal
        { name: 'Türk Lirası', code: 'TRY', sign: '₺' }, // Turkish Lira
        { name: '日本円', code: 'JPY', sign: '¥' }, // Japanese Yen
        { name: 'Российский рубль', code: 'RUB', sign: '₽' }, // Russian Ruble
        { name: '人民币', code: 'CNY', sign: '¥' }, // Chinese Yuan
        { name: '대한민국 원', code: 'KRW', sign: '₩' }, // South Korean Won
        { name: 'भारतीय रुपया', code: 'INR', sign: '₹' }, // Indian Rupee
        { name: 'บาทไทย', code: 'THB', sign: '฿' }, // Thai Baht
        { name: 'Svenska Kronor', code: 'SEK', sign: 'kr' }, // Swedish Krona
        { name: 'Polski Złoty', code: 'PLN', sign: 'zł' }, // Polish Zloty
        { name: 'שקל ישראלי חדש', code: 'ILS', sign: '₪' }, // Israeli Shekel
        { name: 'Danske Kroner', code: 'DKK', sign: 'kr' }, // Danish Krone
        { name: 'Norske Kroner', code: 'NOK', sign: 'kr' }, // Norwegian Krone
        { name: 'Magyar Forint', code: 'HUF', sign: 'Ft' }, // Hungarian Forint
        { name: 'Česká Koruna', code: 'CZK', sign: 'Kč' }, // Czech Koruna
        { name: 'Українська гривня', code: 'UAH', sign: '₴' }, // Ukrainian Hryvnia
        { name: 'Leu românesc', code: 'RON', sign: 'lei' }, // Romanian Leu
        { name: 'Rupiah Indonesia', code: 'IDR', sign: 'Rp' }, // Indonesian Rupiah
        { name: 'Đồng Việt Nam', code: 'VND', sign: '₫' }, // Vietnamese Dong
        { name: 'ریال ایران', code: 'IRR', sign: '﷼' }, // Iranian Rial
        { name: 'বাংলাদেশী টাকা', code: 'BDT', sign: '৳' }, // Bangladeshi Taka
        { name: 'پاکستانی روپیہ', code: 'PKR', sign: '₨' }, // Pakistani Rupee
        { name: 'Ringgit Malaysia', code: 'MYR', sign: 'RM' }, // Malaysian Ringgit
        { name: 'Piso ng Pilipinas', code: 'PHP', sign: '₱' }, // Philippine Peso
        { name: 'Hrvatska Kuna', code: 'HRK', sign: 'kn' }, // Croatian Kuna
        { name: 'Српски динар', code: 'RSD', sign: 'дин' }, // Serbian Dinar
        { name: 'Konvertibilna marka', code: 'BAM', sign: 'KM' }, // Bosnia and Herzegovina Convertible Mark
        { name: 'Македонски денар', code: 'MKD', sign: 'ден' }, // Macedonian Denar
        { name: 'Lek Shqiptar', code: 'ALL', sign: 'L' }, // Albanian Lek
        { name: 'Български лев', code: 'BGN', sign: 'лв' }, // Bulgarian Lev
        { name: 'Íslensk króna', code: 'ISK', sign: 'kr' }, // Icelandic Krona
        { name: 'ქართული ლარი', code: 'GEL', sign: '₾' }, // Georgian Lari
        { name: 'Հայկական դրամ', code: 'AMD', sign: '֏' }, // Armenian Dram
        { name: 'Azərbaycan Manatı', code: 'AZN', sign: '₼' }, // Azerbaijani Manat
        { name: 'Қазақстан теңгесі', code: 'KZT', sign: '₸' }, // Kazakhstani Tenge
        { name: 'Oʻzbekiston soʻmi', code: 'UZS', sign: 'сўм' }, // Uzbekistani Som
        { name: 'Кыргыз сом', code: 'KGS', sign: 'с' }, // Kyrgyzstani Som
        { name: 'नेपाली रुपैंयाँ', code: 'NPR', sign: 'रू' }, // Nepalese Rupee
        { name: 'ශ්‍රී ලංකා රුපියල', code: 'LKR', sign: 'රු' }, // Sri Lankan Rupee
        { name: 'Shilingi ya Tanzania', code: 'TZS', sign: 'TSh' }, // Tanzanian Shilling
        { name: 'የኢትዮጵያ ብር', code: 'ETB', sign: 'Br' }, // Ethiopian Birr
        { name: 'Naira', code: 'NGN', sign: '₦' }, // Nigerian Naira
        { name: 'Lesotho Loti', code: 'LSL', sign: 'L' }, // Lesotho Loti
        { name: 'Rand', code: 'ZAR', sign: 'R' }, // South African Rand
        { name: 'Ugandan Shilling', code: 'UGX', sign: 'USh' }, // Ugandan Shilling
        { name: 'Беларускі рубель', code: 'BYN', sign: 'Br' }, // Belarusian Ruble
        { name: 'Монгол төгрөг', code: 'MNT', sign: '₮' }, // Mongolian Tögrög
        { name: 'Australian Dollar', code: 'AUD', sign: '$' },
        { name: 'Canadian Dollar', code: 'CAD', sign: '$' },
        { name: 'Swiss Franc', code: 'CHF', sign: 'CHF' },
        { name: 'Singapore Dollar', code: 'SGD', sign: '$' },
        { name: 'New Zealand Dollar', code: 'NZD', sign: '$' },
        { name: 'Hong Kong Dollar', code: 'HKD', sign: '$' },
        { name: 'Real Brasileiro', code: 'BRL', sign: 'R$' }, // Brazilian Real
        { name: 'Peso Mexicano', code: 'MXN', sign: '$' }, // Mexican Peso
        { name: 'ދިވެހިރުފިޔާ', code: 'MVR', sign: 'Rf' }, // Maldivian Rufiyaa
        { name: 'دينار', code: 'KWD', sign: 'دينار' }, // Kuwaiti Dinar
        { name: 'جنيه مصري', code: 'EGP', sign: '£' }, // Egyptian Pound
        { name: 'ليرة', code: 'LBP', sign: 'ليرة' }, // Lebanese Pound
        { name: 'درهم مغربي', code: 'MAD', sign: 'DH' }, // Moroccan Dirham
        { name: 'Peso Argentino', code: 'ARS', sign: '$' }, // Argentine Peso
        { name: 'Peso Chileno', code: 'CLP', sign: '$' }, // Chilean Peso
        { name: 'Peso Colombiano', code: 'COP', sign: '$' }, // Colombian Peso
        { name: 'Sol Peruano', code: 'PEN', sign: 'S/.' }, // Peruvian Sol
        { name: 'Peso Uruguayo', code: 'UYU', sign: '$' }, // Uruguayan Peso
        { name: 'Guaraní Paraguayo', code: 'PYG', sign: '₲' }, // Paraguayan Guarani
        { name: 'Boliviano', code: 'BOB', sign: 'Bs.' }, // Bolivian Boliviano
        { name: 'Bolívar Soberano', code: 'VES', sign: 'Bs.S' }, // Venezuelan Bolívar
        { name: 'Colón Costarricense', code: 'CRC', sign: '₡' }, // Costa Rican Colón
        { name: 'Peso Cubano', code: 'CUP', sign: '$' }, // Cuban Peso
        { name: 'Peso Dominicano', code: 'DOP', sign: 'RD$' }, // Dominican Peso
        { name: 'Quetzal Guatemalteco', code: 'GTQ', sign: 'Q' }, // Guatemalan Quetzal
        { name: 'Lempira Hondureño', code: 'HNL', sign: 'L' }, // Honduran Lempira
        { name: 'Córdoba Nicaragüense', code: 'NIO', sign: 'C$' }, // Nicaraguan Córdoba
        { name: 'Balboa Panameño', code: 'PAB', sign: 'B/.' }, // Panamanian Balboa
        { name: 'Trinidad and Tobago Dollar', code: 'TTD', sign: '$' },
        { name: 'Jamaican Dollar', code: 'JMD', sign: '$' },
        { name: 'Gourde', code: 'HTG', sign: 'G' }, // Haitian Gourde
        { name: 'Cedi', code: 'GHS', sign: '₵' }, // Ghanaian Cedi
        { name: 'Franc CFA', code: 'XAF', sign: 'CFA' }, // Cameroonian Franc
        { name: 'Shilingi ya Kenya', code: 'KES', sign: 'KSh' }, // Kenyan Shilling
        { name: 'Pula', code: 'BWP', sign: 'P' }, // Botswanan Pula
        { name: 'Namibian Dollar', code: 'NAD', sign: '$' },
        { name: 'Kwacha', code: 'ZMW', sign: 'ZK' }, // Zambian Kwacha
        { name: 'Kwanza', code: 'AOA', sign: 'Kz' }, // Angolan Kwanza
        { name: 'Metical', code: 'MZN', sign: 'MT' }, // Mozambican Metical
        { name: 'Dalasi', code: 'GMD', sign: 'D' }, // Gambian Dalasi
        { name: 'Franc Guinéen', code: 'GNF', sign: 'FG' }, // Guinean Franc
        { name: 'Leone', code: 'SLL', sign: 'Le' }, // Sierra Leonean Leone
        { name: 'Liberian Dollar', code: 'LRD', sign: '$' },
        { name: 'Franc CFA', code: 'XOF', sign: 'CFA' }, // West African CFA franc
        { name: 'Ouguiya', code: 'MRU', sign: 'UM' }, // Mauritanian Ouguiya
        { name: 'Ariary', code: 'MGA', sign: 'Ar' }, // Malagasy Ariary
        { name: 'Franc Rwandais', code: 'RWF', sign: 'RF' }, // Rwandan Franc
        { name: 'Franc Burundais', code: 'BIF', sign: 'FBu' }, // Burundian Franc
        { name: 'Franc Congolais', code: 'CDF', sign: 'FC' }, // Congolese Franc
        { name: 'Franc Djibouti', code: 'DJF', sign: 'Fdj' }, // Djiboutian Franc
        { name: 'Shilingi ya Somalia', code: 'SOS', sign: 'S' }, // Somali Shilling
        { name: 'Rupee', code: 'SCR', sign: '₨' }, // Seychellois Rupee
        { name: 'Franc Comorien', code: 'KMF', sign: 'CF' }, // Comorian Franc
        { name: 'Nakfa', code: 'ERN', sign: 'Nfk' }, // Eritrean Nakfa
        { name: 'Rupee', code: 'MUR', sign: '₨' }, // Mauritian Rupee
    ];

    const primaryCurrency = allCurrencies.find(lang => lang.sign === currency);
    if (!primaryCurrency) {
        return allCurrencies; // Return all languages if the input language is not found
    }

    const otherCurrencies = allCurrencies.filter(lang => lang.name !== currency);
    return [primaryCurrency, ...otherCurrencies];
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

export async function generateNumericEventId() {
    const timestamp = Date.now().toString(); // Current timestamp
    const randomNum = Math.floor(Math.random() * 100000).toString(); // Random 5-digit number
    return timestamp + randomNum;
}