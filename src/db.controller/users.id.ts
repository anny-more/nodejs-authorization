import {Request, Response} from 'express-serve-static-core';
import {readFileSync, writeFileSync} from 'fs';
import {nanoid} from 'nanoid';
import {join} from 'path';
import {getUserID} from '../auth/get.id';

const LIMIT_COUNT = 20;
const MAX_AGE = 2678400;

interface UserInfo {
  id: string;
  counter: number;
  loadedFiles: String[];
}

export const userDB = (req: Request, res: Response) => {
  let id = getUserID(req);
  let userInfo: UserInfo;
  const db = JSON.parse(
    readFileSync(join(process.cwd(), 'src', 'database', 'users.id.json'), {
      encoding: 'utf8',
    })
  );
  if (!id) {
    id = nanoid();
    res.setHeader('Set-Cookie', 'idConverter=' + id + '; Max-Age=' + MAX_AGE);
    userInfo = {
      id,
      counter: LIMIT_COUNT,
      loadedFiles: [],
    };
    db.users.push(userInfo);
  } else {
    userInfo = db.users.find(
      (item: {id: string | undefined}) => item.id === id
    );
    console.log('from else', userInfo, db);
  }
  console.log(userInfo, db);
  res.send(
    '<a href="/upload">convert JPG to Webp</a>  <a href="/auth/google">Authenticate with Google</a>');
  writeFileSync(
    join(process.cwd(), 'src', 'database', 'users.id.json'),
    JSON.stringify(db)
  );
};
