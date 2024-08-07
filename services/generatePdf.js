import puppeteer from 'puppeteer';

export const generatePdf = async (html) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
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
};