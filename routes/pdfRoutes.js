import { Router } from 'express';
import { createPdfMenu } from '../controllers/pdfController.js';

const router = Router();

router.get('/generate-pdf/:menuId', createPdfMenu);

export default router;

{
    "categories": [
      {
        "name": "Suppen",
        "items": [
          {"name": "Frittatensuppe", "price": "4,50 €"},
          {"name": "Knoblauch-Rahmsuppe", "price": "4,90 €"},
          {"name": "Tomatensuppe", "price": "4,90 €"}
        ]
      },
      {
        "name": "Salate",
        "items": [
          {"name": "Gemischter Salat (klein)", "price": "4,90 €"},
          {"name": "Gemischter Salat (groß)", "price": "6,40 €"},
          {"name": "Mozzarella Salat", "price": "8,90 €"},
          {"name": "Griechischer Bauernsalat", "price": "9,90 €"},
          {"name": "Caesar Salat", "price": "11,90 €"},
          {"name": "Shrimps Salat", "price": "12,90 €"}
        ]
      },
      {
        "name": "Burger",
        "items": [
          {"name": "Hamburger Classic", "price": "12,90 €"},
          {"name": "Cheeseburger", "price": "13,40 €"},
          {"name": "Cheeseburger Double", "price": "16,40 €"},
          {"name": "BBQ Bacon Burger", "price": "14,90 €"},
          {"name": "BBQ Bacon Burger Double", "price": "17,90 €"},
          {"name": "Mexican Chili Burger", "price": "15,90 €"},
          {"name": "Mississippi Burger", "price": "14,50 €"},
          {"name": "Mix Burger", "price": "16,90 €"},
          {"name": "Chickenburger", "price": "12,90 €"},
          {"name": "Veggie Burger", "price": "13,90 €"},
          {"name": "Steak Burger", "price": "18,90 €"}
        ]
      },
      {
        "name": "Wraps",
        "items": [
          {"name": "Veggie Wrap", "price": "6,40 €"},
          {"name": "Wrap mit gegrillten Hühnerstreifen", "price": "6,40 €"},
          {"name": "Wrap mit gegrillten Shrimps", "price": "7,10 €"}
        ]
      },
      {
        "name": "Vom Grill",
        "items": [
          {"name": "Vegetarischer Teller vom Grill", "price": "10,90 €"},
          {"name": "Gegrilltes Hühnerbrustfilet", "price": "12,90 €"},
          {"name": "Gegrilltes Lachsforellenfilet", "price": "17,90 €"},
          {"name": "Gegrillte Beiriedschnitte", "price": "18,90 €"}
        ]
      },
      {
        "name": "Wiener Klassiker",
        "items": [
          {"name": "Rindsgulasch", "price": "15,90 €"},
          {"name": "Gekochtes Rind-Schulterscherzel", "price": "16,90 €"},
          {"name": "Wiener Schnitzel vom Kalb", "price": "19,90 €"},
          {"name": "Alt Wiener Zwiebelrostbraten", "price": "18,90 €"}
        ]
      },
      {
        "name": "Gebackenes",
        "items": [
          {"name": "Hausgemachte Chicken Nuggets", "price": "10,90 €"},
          {"name": "Wiener Schnitzel vom Huhn", "price": "13,90 €"},
          {"name": "Gebackenes Zanderfilet", "price": "16,90 €"}
        ]
      },
      {
        "name": "Snacks",
        "items": [
          {"name": "Schinken-Käse Toast", "price": "4,90 €"},
          {"name": "Haustoast", "price": "6,90 €"},
          {"name": "Pommes frites", "price": "4,90 €"}
        ]
      },
      {
        "name": "Beilagen",
        "items": [
          {"name": "Pommes frites", "price": "3,50 €"},
          {"name": "Potato Wedges", "price": "3,80 €"},
          {"name": "Bratkartoffeln", "price": "3,50 €"},
          {"name": "Petersilkartoffeln", "price": "3,50 €"},
          {"name": "Blattsalat", "price": "3,40 €"},
          {"name": "Sauce Tartare", "price": "1,20 €"},
          {"name": "Sweet-Chilisauce", "price": "1,20 €"},
          {"name": "Sour Cream", "price": "1,20 €"},
          {"name": "Cocktailsauce", "price": "1,20 €"},
          {"name": "Barbecuesauce", "price": "1,20 €"},
          {"name": "Mayonnaise", "price": "0,50 €"},
          {"name": "Ketchup", "price": "0,50 €"},
          {"name": "Senf", "price": "0,50 €"}
        ]
      },
      {
        "name": "Dessert",
        "items": [
          {"name": "Apfeltorte", "price": "3,50 €"},
          {"name": "Topfentorte", "price": "3,50 €"},
          {"name": "Mohr im Hemd", "price": "4,70 €"}
        ]
      },
      {
        "name": "Alkoholfreie Getränke",
        "items": [
          {"name": "Coca Cola 0,33l", "price": "2,00 €"},
          {"name": "Coca Cola Light 0,33l", "price": "2,00 €"},
          {"name": "Coca Cola Zero 0,33l", "price": "2,00 €"},
          {"name": "Fanta 0,33l", "price": "2,00 €"},
          {"name": "Sprite 0,33l", "price": "2,00 €"},
          {"name": "Almdudler 0,35l", "price": "2,00 €"},
          {"name": "Rauch Eistee Pfirsich 0,33l", "price": "2,00 €"},
          {"name": "Rauch Eistee Zitrone 0,33l", "price": "2,00 €"},
          {"name": "Schweppes Tonic Water 0,2l", "price": "2,90 €"},
          {"name": "Schweppes Bitter Lemon 0,2l", "price": "2,90 €"},
          {"name": "Schweppes Ginger Ale 0,2l", "price": "2,90 €"},
          {"name": "Rauch Erdbeer 0,2l", "price": "2,90 €"},
          {"name": "Rauch Marille 0,2l", "price": "2,90 €"},
          {"name": "Rauch Pfirsich 0,2l", "price": "2,90 €"},
          {"name": "Rauch Johannisbeere 0,2l", "price": "2,90 €"},
          {"name": "Rauch Apfelsaft 0,2l", "price": "2,90 €"},
          {"name": "Rauch Orangensaft 0,2l", "price": "2,90 €"},
          {"name": "Vöslauer still 0,5l", "price": "2,00 €"},
          {"name": "Vöslauer prickelnd 0,5l", "price": "2,00 €"},
          {"name": "Red Bull 0,25l", "price": "3,40 €"},
          {"name": "Stiegl Freibier Alkoholfrei 0,5l", "price": "4,10 €"},
          {"name": "Stiegl Sport Weisse Alkoholfrei 0,5l", "price": "4,20 €"}
        ]
      },
      {
        "name": "Alkoholische Getränke",
        "items": [
          {"name": "Wieselburger 0,5l", "price": "2,80 €"},
          {"name": "Gösser 0,5l", "price": "2,80 €"},
          {"name": "Stiegl 0,5l", "price": "2,80 €"},
          {"name": "Stiegl Paracelsus Bío Zwickl 0,5l", "price": "4,20 €"},
          {"name": "Stiegl Paracelsus Glutenfrei 0,33l", "price": "3,90 €"},
          {"name": "Stiegl Radler Zitrone Naturtrüb 0,5l", "price": "4,10 €"},
          {"name": "StieglHere is a summarized JSON structure of the restaurant menu:
  
  ```json
  {
    "categories": [
      {
        "name": "Suppen",
        "items": [
          {"name": "Frittatensuppe", "price": "4,50 €"},
          {"name": "Knoblauch-Rahmsuppe", "price": "4,90 €"},
          {"name": "Tomatensuppe", "price": "4,90 €"}
        ]
      },
      {
        "name": "Salate",
        "items": [
          {"name": "Gemischter Salat (klein)", "price": "4,90 €"},
          {"name": "Mozzarella Salat", "price": "8,90 €"}
        ]
      },
      {
        "name": "Burger",
        "items": [
          {"name": "Hamburger Classic", "price": "12,90 €"},
          {"name": "BBQ Bacon Burger", "price": "14,90 €"}
        ]
      },
      {
        "name": "Wraps",
        "items": [
          {"name": "Veggie Wrap", "price": "6,40 €"},
          {"name": "Wrap mit gegrillten Shrimps", "price": "7,10 €"}
        ]
      }
    ]
  }
  