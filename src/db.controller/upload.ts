import {Request, Response} from 'express';
import {
  readFileSync,
  writeFileSync,
  createReadStream,
  createWriteStream,
} from 'fs';
import {join, basename, extname} from 'path';
import sharp from 'sharp';
import {getUserID} from '../auth/get.id';

const convert = sharp().webp();

export const changeCounter = (req: Request, file: string) => {
  const id = getUserID(req);
  const db = JSON.parse(
    readFileSync(join(process.cwd(), 'src', 'database', 'users.id.json'), {
      encoding: 'utf8',
    })
  );
  const userInfo = db.users.find(
    (item: {id: string | undefined}) => item.id === id
  );
  if (userInfo.counter >= 1) {
    userInfo.counter -= 1;
    userInfo.loadedFiles.push(file);
  } else {
    throw new Error('for upload more images you need to signup');
  }
  writeFileSync(
    join(process.cwd(), 'src', 'database', 'users.id.json'),
    JSON.stringify(db)
  );
  console.log('db = ', db);
};

export const uploadJpeg = (req: Request, res: Response) => {
  const pathFrom = req.file!.path;
  const filename =
    basename(req.file!.originalname, extname(req.file!.originalname)) +
    '-' +
    Date.now() +
    '.webp';
  const pathTo = join(process.cwd(), 'new-folder', filename);
  const src = createReadStream(pathFrom);
  const dest = createWriteStream(pathTo);
  src.pipe(convert).pipe(dest);
  changeCounter(req, filename);
  src.on('end', () => res.status(200).json('compile'));
  src.on('error', () => res.status(200).json('error'));
};
