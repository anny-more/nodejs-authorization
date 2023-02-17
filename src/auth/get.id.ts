import {Request} from 'express';

export const getUserID = (req: Request): string | undefined => {
  const stringFromCokie = req.headers.cookie;
  let id = stringFromCokie
    ?.split('; ')
    .find(el => el.startsWith('idConverter'));
  if (id) {
    id = id.replace('idConverter=', '');
  }
  return id;
};
