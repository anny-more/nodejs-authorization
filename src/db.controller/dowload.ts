import {Request, Response} from 'express';
import {getUserID} from '../auth/get.id';

export const download = (req: Request, res: Response) => {
  //hear will be smth...
  const id = getUserID(req);
  const pathTo = '';

  res.download(pathTo, err => {
    if (err) {
      res.send({error: err, msg: 'Problem downloading the file'});
    }
  });
};
