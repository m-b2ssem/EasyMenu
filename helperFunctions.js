export function createLangaugeList(language) {
    const allLanguages = [
        { name: 'English' },
        { name: 'عربي' },
        { name: 'Deutsch' },
        { name: 'Türkçe' },
        { name: 'Español' }
    ];

    const primaryLanguage = allLanguages.find(lang => lang.name === language);
    if (!primaryLanguage) {
        return allLanguages; // or return an empty array or throw an error if the input language is not found.
    }

    const otherLanguages = allLanguages.filter(lang => lang.name !== language);
    return [primaryLanguage, ...otherLanguages];
}


export function convertArrayBufferToBase64(buffer) {
    return Buffer.from(buffer).toString('base64');
}
