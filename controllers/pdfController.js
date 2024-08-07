import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { getCategoriesWithItems} from '../models/menuModel.js'
import { generatePdf } from '../services/generatePdf.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPdfMenu = async (req, res) => {

  try {
    const htmlContent = fs.readFileSync(path.join(__dirname, '../public/pages/menu-template.html'), 'utf8');
    const imagePath = path.join(__dirname, '../public/assets/images/template-background.png');
    const image = fs.readFileSync(imagePath);
    const base64Image = image.toString('base64');
    const mimeType = 'image/png'; // Adjust if your image is of a different type
    const base64ImageSrc = `data:${mimeType};base64,${base64Image}`;
    let updatedHtmlContent = htmlContent.replace('template-background.png', base64ImageSrc);

    const menuId = parseInt(req.params.menuId); // Assuming menuId is passed as a parameter
    console.log(menuId);
    const menu = await getCategoriesWithItems(menuId);
    console.log(menu);
    const categories = '<div class="section"><h2>[category]</h2></div>';
    const itemH = '<div class="item"><div class="item-name">[item-name]</div><div class="item-price">[item-dis]</div></div>';
    let menuHtml = '';
    let countItems = 0;

    if (menu) {
      for (const category of menu) {
        let categoryHtml = categories.replace('[category]', category.category_name);
        let itemsHtml = '';
        for (const item of category.items) {
          let itemHtml = itemH;
          itemHtml = itemHtml.replace('[item-name]', item.item_name);
          itemHtml = itemHtml.replace('[item-dis]', item.description);
          itemsHtml += itemHtml;
          countItems++;
          if (countItems === 14) {
            itemsHtml += '<div style="break-after:page"></div>';
            countItems = 0;
          }
        }
        categoryHtml += itemsHtml;
        menuHtml += categoryHtml;
      }
    }
    updatedHtmlContent = updatedHtmlContent.replace('[menu]', menuHtml);
    const pdf = await generatePdf(updatedHtmlContent);

    res.setHeader('Content-Disposition', 'attachment; filename=menu.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating the PDF');
  }
};
