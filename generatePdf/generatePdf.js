import puppeteer from 'puppeteer';

export async function generatePdf(html) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //await page.setViewport({ width: 1920, height: 1080 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');
    const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        scale: 1,
        landscape: false,
    });

    
    await browser.close();
    return pdf;
}
