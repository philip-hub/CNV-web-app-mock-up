import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), '/uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.tsv') {
      return cb(new Error('Only .tsv files are allowed'), false);
    }
    cb(null, true);
  },
});

const uploadMiddleware = upload.single('file');

// Helper function to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// API Route Handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res, uploadMiddleware);
      res.status(200).json({ data: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error occurred:', error.message);
      res.status(500).json({ error: `Sorry, something went wrong! ${error.message}` });
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
