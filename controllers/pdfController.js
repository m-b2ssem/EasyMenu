import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { getCategoriesWithItems } from "../models/menuModel.js";
import { generatePdf, mergePdfs, sortMenu } from "../services/generatePdf.js";
import { ok } from "assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPdfMenu = async (req, res) => {
  try {
    const htmlContent = fs.readFileSync(
      path.join(__dirname, "../public/pages/menu-template.html"),
      "utf8"
    );
    const imagePath = path.join(
      __dirname,
      "../public/assets/images/template-background.png"
    );

    const image = fs.readFileSync(imagePath);
    const base64Image = image.toString("base64");
    const mimeType = "image/png"; // Adjust if your image is of a different type
    const base64ImageSrc = `data:${mimeType};base64,${base64Image}`;
    const menuId = parseInt(req.params.menuId); // Assuming menuId is passed as a parameter
    const menu = await getCategoriesWithItems(menuId);

    const htmlContwntWithImage = htmlContent.replace(
      "template-background.png",
      base64ImageSrc
    );

    const menuList =  sortMenu(menu);
    const pdfBuffers = await generatePdf(menuList, htmlContwntWithImage);


    const finalPdfBuffer = await mergePdfs(pdfBuffers);
    fs.writeFileSync(path.join(__dirname, "menu.pdf"), finalPdfBuffer);











    /*for (const categoryList of categoryWithItems) {
      let updatedHtmlContent = HtmlContwntWithImage;
      let menuHtml = "";
      menuHtml = categories.replace("[category]", categoryList[0]);
      let itemHtml = itemH;
      const items = categoryList.slice(1);
      for (const categoryItem of items) {
        itemHtml = itemH.replace("[item-name]", categoryItem.item_name);
        itemHtml = itemHtml.replace("[item-description]", categoryItem.description);
        itemHtml = itemHtml.replace("[item-price]", categoryItem.price);
        menuHtml += itemHtml;
      }
      updatedHtmlContent = updatedHtmlContent.replace("[menu]", menuHtml);
      const butter = await generatePdf(updatedHtmlContent);
      pdfBuffers.push(butter);
    }

    const finalPdfBuffer = await mergePdfs(pdfBuffers);
    fs.writeFileSync(path.join(__dirname, "menu.pdf"), finalPdfBuffer);

    res.setHeader("Content-Disposition", "attachment; filename=menu.pdf");
    res.setHeader("Content-Type", "application/pdf");*/
    res.send("ok");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the PDF");
  }
};
