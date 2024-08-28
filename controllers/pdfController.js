import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { getCategoriesWithItems, getMenuByMenuId } from "../models/menuModel.js";
import { generatePdf, mergePdfs, sortMenu } from "../services/generatePdf.js";
import { ok } from "assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPdfMenu = async (req, res) => {
  try {
    const menuId = parseInt(req.params.menuId); // Assuming menuId is passed as a parameter
    if (!menuId || await getMenuByMenuId(menuId) === false) {
      return res.status(400).send("Invalid menu ID");
    }
    const menu = await getCategoriesWithItems(menuId);
    if (menu === null) {
      return res.status(404).send("Please check if you have items and if they are active, do the same with categories");
    }
    const htmlContent = fs.readFileSync(
      path.join(__dirname, "../public/pages/menu-template.html"),
      "utf8"
    );
    const imagePath = path.join(
      __dirname,
      "../public/img/template-background.png"
    );

    const image = fs.readFileSync(imagePath);
    const base64Image = image.toString("base64");
    const mimeType = "image/png"; // Adjust if your image is of a different type
    const base64ImageSrc = `data:${mimeType};base64,${base64Image}`;

    const htmlContwntWithImage = htmlContent.replace(
      "template-background.png",
      base64ImageSrc
    );

    const menuList =  sortMenu(menu);
    const pdfBuffers = await generatePdf(menuList, htmlContwntWithImage);


    const finalPdfBuffer = await mergePdfs(pdfBuffers);


    res.setHeader("Content-Disposition", "attachment; filename=menu.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.send(finalPdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the PDF");
  }
};
