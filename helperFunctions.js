export function createLangaugeList(langauge) {
    const langauges = [];

    if (langauge === 'English') {
        langauges.push({ name: 'English'});
        langauges.push({ name: 'عربي'});
        langauges.push({ name: 'Deutsch'});
        langauges.push({ name: 'Türkçe'});
        langauges.push({ name: 'Español'});
    } else if (langauge === 'Arabic') {
        langauges.push({ name: 'عربي'});
        langauges.push({ name: 'English'});
        langauges.push({ name: 'Deutsch'});
        langauges.push({ name: 'Türkçe'});
        langauges.push({ name: 'Español'});
    } else if (langauge === 'Deutsch') {
        langauges.push({ name: 'Deutsch'});
        langauges.push({ name: 'English'});
        langauges.push({ name:  'عربي'});
        langauges.push({ name: 'Español'});
        langauges.push({ name: 'Türkçe'});
    }
    else if (langauge === 'Türkçe') {
        langauges.push({ name: 'Türkçe'});
        langauges.push({ name:  'عربي'});
        langauges.push({ name: 'Español'});
        langauges.push({ name: 'Deutsch'});
        langauges.push({ name: 'English'});
    }
    else if (langauge === 'Español') {
        langauges.push({ name: 'Español'});
        langauges.push({ name: 'English'});
        langauges.push({ name: 'عربي'});
        langauges.push({ name: 'Deutsch'});
        langauges.push({ name: 'Türkçe'});
    }
    return langauges;
}