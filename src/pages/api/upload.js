import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), '/uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('Saving file to:', uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      console.log('Saving file as:', file.originalname);
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/tab-separated-values') {
      return cb(new Error('Only .tsv files are allowed'), false);
    }
    cb(null, true);
  },
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error('Error occurred:', error.message);
    res.status(501).json({ error: `Sorry, something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
  console.log('File uploaded successfully');
  res.status(200).json({ data: 'File uploaded successfully' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
