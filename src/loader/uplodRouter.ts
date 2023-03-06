import { Router } from "express";
import { usersStorage } from "../service/user.service";

const uploadRouter = Router();
uploadRouter.get('/upload',
  (req, res) => {
    console.log(req.user);
    //const user = usersStorage.find(item => item.email === email);
    console.log('uploadRoter say "hi!');
    res.json({message: 'ok'});
  }
  //uploadJpeg
);

export {uploadRouter};
