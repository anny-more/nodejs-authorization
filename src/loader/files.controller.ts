import {createReadStream, createWriteStream, unlink} from 'fs';
// eslint-disable-next-line node/no-unsupported-features/node-builtins
import {pipeline} from 'stream';
import {join, basename, extname} from 'path';
import sharp, { AvailableFormatInfo } from 'sharp';
import { getUserID } from '../service/user.service';
import { Request, Response } from 'express';
import { mainQueue } from './queue';

export const dataStorage: GetData[] = [];

class DataStorage {
  addItem = (
    req: Request,
    res: Response
    /*
    userID: string,
    file: Express.Multer.File,
    info: GetData['info'] | ''
    */
  ) => {
    const id = getUserID(req, res);
    const info = req.body.param;
    const files = req.files as Express.Multer.File[];
    if (files) {
      for (let i = 0; i < req.files!.length; i++) {
        const file = files.pop();
        const item = new GetData(id, file!, info as AvailableFormatInfo);
        dataStorage.push(item);
        mainQueue.addTask(item);
      }
    }
    if (req.file) {
      const item = new GetData(id, req.file, info as AvailableFormatInfo);
      dataStorage.push(item);
      mainQueue.addTask(item);
    }
  };
  deleteItem = (name: string, dataStorage: GetData[]) => {
    const index = dataStorage.findIndex(item => item.filename === name);
    dataStorage.slice(index);
  };
  findItem = () => {};
}
export const storage = new DataStorage();

export class GetData {
  originalname: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  owner: string;
  status: 'upload' | 'wait to convert' | 'ready' | 'error';
  info: sharp.AvailableFormatInfo;
  quality: number;

  constructor(
    userID: string,
    file: Express.Multer.File,
    info?: sharp.AvailableFormatInfo
  ) {
    this.info = info || sharp.format['webp'];
    this.quality = 100;
    this.originalname = file.originalname;
    this.mimetype = file.mimetype;
    this.destination = file.destination;
    this.filename =
      basename(this.originalname, extname(this.originalname)) +
      '.' +
      Date.now() +
      '.' +
      this.info;
    this.path = file.path;
    this.owner = userID;
    this.status = 'upload';
  }

  convert = () => {
    const pathTo = join(process.cwd(), 'new-folder', this.filename);
    console.log('pathTo', pathTo);
    const src = createReadStream(this.path);
    const dest = createWriteStream(pathTo);
    const convert = sharp().toFormat(this.info);
    pipeline(src, convert, dest, err => {
      console.log(err);
    });
    src.on('end', () => {
      this.status = 'ready';
      this.delete();
      //res.status(200).json('compile');
    });
    src.on('error', () => {
      this.status = 'error';
      //res.status(200).json('error');
    });
  };
  delete = async () => {
    await unlink(join(process.cwd(), this.path), err => {
      console.log(err);
    });
    console.log('dataStorage', dataStorage);
  };
}
