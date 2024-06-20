import QRCode from 'qrcode';

export async function checkIfUserExist(db, email) {
     const result = await db.query("SELECT email FROM users WHERE email = $1",
        [email]);
    if (result.rows.length > 0) {
        return true;
    } else {
        return false;
    }
}

export async function insertUser(db, campanyName, email, hash) {
    const result = await db.query("INSERT INTO users (company_name, email, password) VALUES($1, $2, $3) RETURNING *",
        [campanyName, email, hash]);
    return result;
}


export async function selectUser(db, email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1",
        [email]);
    return result;
}

export async function selectUserById(db, id) {
    const result = await db.query("SELECT * FROM users WHERE id = $1",
        [id]);
    return result;
}

export async function insertMenu(db, user_id, campanyName) {
    const toQrcode = 'https://www.easymenu.systems/menu/' + user_id + '/' + campanyName.replace(/\s+/g, '');;
    const menuLangauhe = 'English';
    try {
        // Generate the QR code as a data URL
        const qrCodeDataUrl = await QRCode.toDataURL(toQrcode);
        
        // Remove the data URL prefix and convert the remaining base64 string to a buffer
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
        const qrCodeBuffer = Buffer.from(base64Data, 'base64');
        
        // Insert the data into the database
        const result = await db.query(
          "INSERT INTO menus (user_id, menu_name, menu_langauge, qrcode) VALUES($1, $2, $3, $4) RETURNING *",
          [user_id, campanyName, menuLangauhe, qrCodeBuffer]
        );
        return result;
    } catch (err) {
        console.error('Error generating or inserting QR code:', err);
        throw err;
    }
}


export async function insertDesign(db, menu_id) {
    const background_color = '#8e3c02c7';
    const category_orientation = 'horizontal';
    try {
        const result = await db.query(
            "INSERT INTO designs (menu_id, category_orientation, background_color) VALUES($1, $2, $3) RETURNING *",
            [menu_id, category_orientation, background_color]
          );
    } catch (error) {
        console.error('error inserting the design', error);
        throw error;
    }
}


export async function getMenuById(db, id) {
    const result = await db.query("SELECT * FROM menus WHERE user_id = $1",
        [id]);
    if (result.rows.length > 0) {
        return result.rows[0];
    } else {
        return false;
    }
}


