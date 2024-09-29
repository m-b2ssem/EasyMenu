/*
creation of the database 

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  company_name VARCHAR(50) NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE menus (
  menu_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  menu_name VARCHAR(100) NOT NULL,
  menu_language VARCHAR(50) NOT NULL,
  qr_code BYTEA,
  menu_logo BYTEA,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designs (
  design_id SERIAL PRIMARY KEY,
  menu_id INT REFERENCES menus(menu_id) ON DELETE CASCADE,
  category_orientation VARCHAR(50) NOT NULL CHECK (category_orientation IN ('horizontal', 'vertical')),
  background_color VARCHAR(100) NOT NULL, -- Assuming the color is stored in hex format (e.g., #FFFFFF)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  menu_id INT REFERENCES menus(menu_id) ON DELETE CASCADE,
  category_name VARCHAR(100) NOT NULL,
  priority INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE items (
  item_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
  item_name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image BYTEA,
  priority INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  item_status BOOLEAN 
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_menus_user_id ON menus(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_items_user_id ON items(user_id);


// many to one

CREATE TABLE subscription_plans (
  plan_id SERIAL PRIMARY KEY,
  plan_name VARCHAR(100) NOT NULL,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  subscription_id VARCHAR(50) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_days INT NOT NULL, -- Duration of the subscription in days
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  payment_status VARCHAR(50), -- e.g., 'Paid', 'Pending', 'Failed'
  status VARCHAR(50), -- e.g., 'Active', 'Expired', 'Cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);


CREATE TABLE payment_sessions (
  session_id SERIAL PRIMARY KEY,
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  subscription_id INT REFERENCES subscription_plans(plan_id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL, -- e.g., 'Pending', 'Completed', 'Expired', 'Cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


i need also a culonm for the qrc
also the menu langauge 
*/

/*


-- Assuming your main items table is named 'items' and PostgreSQL is used

-- Create a new table for item translations
CREATE TABLE item_translations (
    translation_id SERIAL PRIMARY KEY,        -- Primary key for the translations table
    item_id INTEGER NOT NULL,                 -- Foreign key linked to the items table
    language_code CHAR(2) NOT NULL,           -- ISO language code, e.g., 'en', 'de'
    translated_name VARCHAR(100) NOT NULL,    -- Translated name of the item
    translated_description TEXT,              -- Translated description of the item
    CONSTRAINT fk_item
        FOREIGN KEY(item_id) 
        REFERENCES items(item_id) 
        ON DELETE CASCADE
);

-- Index to improve join performance
CREATE INDEX idx_item_id ON item_translations(item_id);

-- Index to improve retrieval performance by language
CREATE INDEX idx_language_code ON item_translations(language_code);

///



-- Create a new table for category translations
CREATE TABLE category_translations (
    translation_id SERIAL PRIMARY KEY,        -- Primary key for the translations table
    category_id INTEGER NOT NULL,             -- Foreign key linked to the categories table
    language_code CHAR(2) NOT NULL,           -- ISO language code, e.g., 'en', 'de'
    translated_name VARCHAR(100) NOT NULL,    -- Translated name of the category
    CONSTRAINT fk_category
        FOREIGN KEY(category_id) 
        REFERENCES categories(category_id) 
        ON DELETE CASCADE
);

-- Index to improve join performance on category_id
CREATE INDEX idx_category_translations_category_id ON category_translations(category_id);

-- Index to improve retrieval performance by language
CREATE INDEX idx_category_translations_language_code ON category_translations(language_code);

/////

*/



// {
//   "userId": "101",
//   "menuId": "96",
//   "categories": [
//       {
//           "name": "example 1",
//           "items": [
//               {
//                   "name": "Hamburger Classic",
//                   "price": 12.90,
//                   "description": "Ca. 150g frisches Rindfleisch, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
//                   "image_url": "https://example.com/hamburger",
//                 },
//               {
//                   "name": "Cheeseburger",
//                   "price": 13.40,
//                   "description": "Ca. 150g frisches Rindfleisch, Käse, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
//                   "image_url": "https://example.com/cheeseburger",
//                 },
//           ]
//       },
//       "name": "example 2",
//           "items": [
//               {
//                   "name": "Hamburger Classic",
//                   "price": 12.90,
//                   "description": "Ca. 150g frisches Rindfleisch, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
//                   "image_url": "https://example.com/hamburger",
//                 },
//               {
//                   "name": "Cheeseburger",
//                   "price": 13.40,
//                   "description": "Ca. 150g frisches Rindfleisch, Käse, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
//                   "image_url": "https://example.com/cheeseburger",
//                 },
//           ]
//       }
//   ]
// }


{
  "userId": "101",
  "menuId": "96",
  "categories": [
    {
      "name": "Vorspeisen",
      "items": [
        {
          "name": "Cacik - Tzatziki",
          "price": 5.90,
          "description": "Knoblauch-Joghurt mit Gurken"
        },
        {
          "name": "Hummus",
          "price": 6.50,
          "description": "Kichererbsenpüree mit Sesampaste"
        },
        {
          "name": "Haydari",
          "price": 6.50,
          "description": "Passierter Joghurt mit Knoblauch"
        },
        {
          "name": "Sigara Böregi",
          "price": 7.50,
          "description": "Blätterteigröllchen mit Kuhkäse, Petersilie und Joghurt"
        }
      ]
    },
    {
      "name": "Suppen",
      "items": [
        {
          "name": "Rote Linsensuppe",
          "price": 5.90,
          "description": ""
        }
      ]
    },
    {
      "name": "Salate",
      "items": [
        {
          "name": "Grüner Salat",
          "price": 7.50,
          "description": "Mit gewürfelten Gurken garniert und Zwiebelringen"
        },
        {
          "name": "Hirtensalat",
          "price": 7.90,
          "description": "Mit Gurke, Zwiebeln, Oliven und Petersilie"
        },
        {
          "name": "Thunfisch Salat",
          "price": 9.50,
          "description": "Mit Saisonsalat und Thunfisch"
        },
        {
          "name": "Gemischter Salat",
          "price": 9.90,
          "description": "Mit Rotkraut, Mais, Karotten, Tomaten, Gurken, Paprika und Petersilie"
        }
      ]
    },
    {
      "name": "Grillgerichte",
      "items": [
        {
          "name": "Lammspieß",
          "price": 16.99,
          "description": "Mit Salat und Reis"
        },
        {
          "name": "Gemischter Lamm- und Hühnerspieß",
          "price": 16.50,
          "description": "Mit Salat und Reis"
        },
        {
          "name": "Adana - Lammhackfleischspieß",
          "price": 15.99,
          "description": "Leicht scharf, mit Salat und Reis"
        },
        {
          "name": "Beyti - Adana gerollt im Tortilla",
          "price": 15.90,
          "description": "Mit Tomaten, Joghurtsauce und Reis"
        },
        {
          "name": "Hühnerspieß",
          "price": 14.50,
          "description": "Mit Salat und Reis"
        },
        {
          "name": "Hühnerflügel",
          "price": 13.50,
          "description": "Mit Salat und Reis"
        },
        {
          "name": "Faschiertes Laibchen vom Kalb und Rind",
          "price": 13.50,
          "description": "Mit Salat und Reis"
        },
        {
          "name": "Cevapcici",
          "price": 13.90,
          "description": "Mit Salat und Reis"
        }
      ]
    },
    {
      "name": "Vegetarisches",
      "items": [
        {
          "name": "Gemischter Grillteller (vegetarisch)",
          "price": 10.99,
          "description": "Paprika, Melanzani, Zucchini, Salat, Pommes frites"
        }
      ]
    },
    {
      "name": "Sandwich - Wrap",
      "items": [
        {
          "name": "Köfte Dürüm",
          "price": 8.90,
          "description": "Mit gebackenem Kalbshackfleisch, Salat, Zwiebeln und Tomaten"
        },
        {
          "name": "Adana Dürüm",
          "price": 8.90,
          "description": "Mit Lammhackfleisch vom Spieß, Salat, Zwiebeln und Tomaten"
        },
        {
          "name": "Falafel Dürüm",
          "price": 7.90,
          "description": "Frittierte Bällchen aus Kichererbsen"
        },
        {
          "name": "Dürüm (vegetarisch)",
          "price": 7.90,
          "description": "Mit Kuhkäse, grünem Salat, Tomaten und Joghurtsauce"
        },
        {
          "name": "Tavuk Sis Dürüm",
          "price": 8.90,
          "description": "Gerollter Wrap mit Hühnerspieß, Salat, Zwiebeln und Tomaten"
        }
      ]
    },
    {
      "name": "Pide Spezialitäten",
      "items": [
        {
          "name": "Lahmacun",
          "price": 6.90,
          "description": "Mit Lamm-Hackfleisch, dazu Salat"
        },
        {
          "name": "Kusbasi Pide",
          "price": 9.90,
          "description": "Mit Käse, klein geschnittenem Lammfleisch und Gemüse"
        },
        {
          "name": "Kiymali Pide",
          "price": 9.90,
          "description": "Mit faschiertem Fleisch"
        },
        {
          "name": "Peynirli Pide",
          "price": 9.50,
          "description": "Mit Käse"
        }
      ]
    }
  ]
}



/*
https://www.montecapanne.at/online-bestellen
this is the url to a menu, I want you to go there and create menu a json and list all the caregories and item with a struct like this, dont forget to add the image utl if it exist


{
  "userId": "101",
  "menuId": "96",
  "categories": [
      {
          "name": "example 1",
          "items": [
              {
                  "name": "Hamburger Classic",
                  "price": 12.90,
                  "description": "Ca. 150g frisches Rindfleisch, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
                  "image_url": "https://example.com/hamburger",
                },
              {
                  "name": "Cheeseburger",
                  "price": 13.40,
                  "description": "Ca. 150g frisches Rindfleisch, Käse, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
                  "image_url": "https://example.com/cheeseburger",
                },
          ]
      },
      "name": "example 2",
          "items": [
              {
                  "name": "Hamburger Classic",
                  "price": 12.90,
                  "description": "Ca. 150g frisches Rindfleisch, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
                  "image_url": "https://example.com/hamburger",
                },
              {
                  "name": "Cheeseburger",
                  "price": 13.40,
                  "description": "Ca. 150g frisches Rindfleisch, Käse, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
                  "image_url": "https://example.com/cheeseburger",
                },
          ]
      }
  ]
}


this is the the text of the menu  menu, I want you to anaylaze it there and create menu a json and list all the caregories and item with a struct like this example 

{
  "userId": "101",
  "menuId": "96",
  "categories": [
      {
          "name": "example 1",
          "items": [
              {
                  "name": "Hamburger Classic",
                  "price": 12.90,
                  "description": "Ca. 150g frisches Rindfleisch, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
                },
              {
                  "name": "Cheeseburger",
                  "price": 13.40,
                  "description": "Ca. 150g frisches Rindfleisch, Käse, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
                },
          ]
      },
      "name": "example 2",
          "items": [
              {
                  "name": "Hamburger Classic",
                  "price": 12.90,
                  "description": "Ca. 150g frisches Rindfleisch, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
                },
              {
                  "name": "Cheeseburger",
                  "price": 13.40,
                  "description": "Ca. 150g frisches Rindfleisch, Käse, Essiggurken, Tomaten, Zwiebeln, Petersilie, Moment-Soße, Pommes frites",
                },
          ]
      }
  ]
}

*/