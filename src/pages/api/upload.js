import { promises as fs } from 'fs';
import path from 'path';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file' });
      }

      const filePath = path.join(process.cwd(), 'uploads', req.file.filename);

      res.status(200).json({ filePath });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
