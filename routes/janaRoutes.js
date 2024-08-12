import { Router } from 'express';
import { sendEmailJana } from '../services/sendEmail.js';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';



const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// jana section

router.get('/jana', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/jana/jana.html'));
});
  
const storage_jana = multer();
router.post('/jana', storage_jana.single('manuscript_file'), async (req, res) => {
    const file = req.file;
    const body = req.body;
  
    if (body.service === '4' && !body.ISBN){
      return res.json({success: false, message: 'Prosím, vyplňte pole s ISBN.'})
    }
    console.log(file);
    if (!file.originalname.includes('.docx')){
      return res.json({success: false, message: 'Prosím, dokument nahrávajte iba vo formáte MS Word.'})
    }
  
    const bodyString = JSON.stringify(body, null, 2);
  
    await sendEmailJana(bodyString, file);
    res.json({ success: true,  message: 'Váš formulár bol úspešne vyplnený.' });
});

export default router;