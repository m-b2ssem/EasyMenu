import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import { Template } from 'ejs';

export const generateOnePdfPage = async (html) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
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

export const mergePdfs = async (pdfBuffers) => {
  const mergedPdf = await PDFDocument.create();
  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }
  return await mergedPdf.save();
};

export const sortMenu = (menu) => {
  const result = [];
  let currentBatch = [];
  let currentBatchSize = 0;

  for (const category of menu) {
      for (const item of category.items) {
          currentBatch.push({ Category_name: category.category_name, Category_items: [item] });
          currentBatchSize++;

          if (currentBatchSize === 11) {
              result.push(currentBatch);
              currentBatch = [];
              currentBatchSize = 0;
          }
      }
  }

  if (currentBatchSize > 0) {
      result.push(currentBatch);
  }

  // Merge items with the same category name in each batch
  return result.map(batch => {
      const mergedBatch = [];
      const categoryMap = {};

      for (const entry of batch) {
          if (!categoryMap[entry.Category_name]) {
              categoryMap[entry.Category_name] = { Category_name: entry.Category_name, Category_items: [] };
              mergedBatch.push(categoryMap[entry.Category_name]);
          }
          categoryMap[entry.Category_name].Category_items.push(...entry.Category_items);
      }

      return mergedBatch;
  });
}

export const generatePdf = async (menuList, template) =>{
  const pdfBuffers = [];
  const categoriesHtml = '<div class="section"><h2>[category]</h2></div>';
  const itemH ='<div class="item"><div><div class="item-name">[item-name]</div><div class="item-description">[item-description]</div></div><div class="item-price">[item-price]</div></div>';


  for (const categories of menuList){
    let updatedHtmlContent = template;
    let itemHtml = "";
    let buffer = null;
    let menuHtml = "";
    if (categories.length === 1)
    {
        const replacedCategory = categoriesHtml.replace("[category]", categories[0].Category_name);
        menuHtml = menuHtml + replacedCategory;
        for (const categoryItem of categories[0].Category_items) {
          itemHtml = itemH.replace("[item-name]", categoryItem.item_name);
          itemHtml = itemHtml.replace("[item-description]", categoryItem.description);
          itemHtml = itemHtml.replace("[item-price]", categoryItem.price);
          menuHtml += itemHtml;
        }
      updatedHtmlContent = updatedHtmlContent.replace("[menu]", menuHtml);
      buffer= await generateOnePdfPage(updatedHtmlContent);
    } else if (categories.length === 2)
    {
      for (const category of categories){
        const replacedCategory = categoriesHtml.replace("[category]", category.Category_name);
        menuHtml = menuHtml + replacedCategory;
        for (const categoryItem of category.Category_items) {
          itemHtml = itemH.replace("[item-name]", categoryItem.item_name);
          itemHtml = itemHtml.replace("[item-description]", categoryItem.description);
          itemHtml = itemHtml.replace("[item-price]", categoryItem.price);
          menuHtml += itemHtml;
        }
      }
      updatedHtmlContent = updatedHtmlContent.replace("[menu]", menuHtml);
      buffer = await generateOnePdfPage(updatedHtmlContent);
    } else if (categories.length === 3)
    {
      for (const category of categories){
        const replacedCategory = categoriesHtml.replace("[category]", category.Category_name);
        menuHtml = menuHtml + replacedCategory;
        for (const categoryItem of category.Category_items) {
          itemHtml = itemH.replace("[item-name]", categoryItem.item_name);
          itemHtml = itemHtml.replace("[item-description]", categoryItem.description);
          itemHtml = itemHtml.replace("[item-price]", categoryItem.price);
          menuHtml += itemHtml;
        }
      }
      updatedHtmlContent = updatedHtmlContent.replace("[menu]", menuHtml);
      buffer = await generateOnePdfPage(updatedHtmlContent);
    }else if (categories.length === 4)
    {
      for (const category of categories){
        const replacedCategory = categoriesHtml.replace("[category]", category.Category_name);
        menuHtml = menuHtml + replacedCategory;
        console.log(replacedCategory);
        for (const categoryItem of category.Category_items) {
          itemHtml = itemH.replace("[item-name]", categoryItem.item_name);
          itemHtml = itemHtml.replace("[item-description]", categoryItem.description);
          itemHtml = itemHtml.replace("[item-price]", categoryItem.price);
          menuHtml += itemHtml;
        }
      }
      updatedHtmlContent = updatedHtmlContent.replace("[menu]", menuHtml);
      buffer = await generateOnePdfPage(updatedHtmlContent);
    }
    pdfBuffers.push(buffer);
  }
  return  pdfBuffers;
}