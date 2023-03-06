import {Request} from 'express';
import multer, {FileFilterCallback} from 'multer';
import { Profile } from 'passport';
import { basename, extname } from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, 'storage-multer');
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      basename(file.originalname, extname(file.originalname)) +
        '.' +
        Date.now() +
        extname(file.originalname)
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (req.user) {
    cb(null, true);
  }
  if (
    req.user === undefined &&
    (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')
  ) {
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

export const upload = multer(MulterConfig).array('file', 3);
