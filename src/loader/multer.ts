import {Request} from 'express';
import multer, {FileFilterCallback} from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, 'new-folder');
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('you can load only jpeg'));
  }
};

const MulterConfig: multer.Options = {
  storage,
  fileFilter,
  limits: {fileSize: 1048576 * 50},
};

export const upload = multer(MulterConfig).single('file');
