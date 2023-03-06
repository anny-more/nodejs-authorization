import dayjs = require('dayjs');
import {LIMIT_FOR_UNLOGED, LIMIT_FOR_LOGED} from '../common/consts';
export const usersStorage: UserService[] = [];
//types
interface UserService {
  id: string;
  googleId: string;
  email: string;
  isLogin: Boolean;
  counter: number;
  ableSlot: Number;
}

class UserService {
  constructor(id: string, googleId: string, email?: string, isLogin?: boolean) {
    this.id = id;
    this.googleId = googleId;
    this.email = email || '';
    this.isLogin = isLogin || false;
    this.counter = 0;
    this.ableSlot = 0;
  }
  get returnLimit() {
    const limit = this.isLogin
      ? LIMIT_FOR_LOGED.count
      : LIMIT_FOR_UNLOGED.count;
    return limit;
  }

  get returnUpdateTime() {
    const limit = this.isLogin ? LIMIT_FOR_LOGED.time : LIMIT_FOR_UNLOGED.time;
    return limit;
  }

  validateDate = () => {
    return new Promise((res, rej) => {
      if (this.ableSlot === 0) {
        const limit = Number(this.returnUpdateTime);
        const start = Date.now();
        const end = dayjs(start).add(limit, 'day').unix();
        this.ableSlot = end;
        res(true);
      }
      const end = this.ableSlot;
      if (end <= Date.now()) {
        this.ableSlot = 0;
        this.validateDate();
        //res(true);
      }
      rej(false);
    });
  };
  updateUploads = async () => {
    const checkLimits = await this.validateDate();
    const maxNumber = this.returnLimit;
    if (!checkLimits && this.counter >= maxNumber) {
      throw Error('unable to convert, limit overload');
    }
    if (checkLimits) {
      this.counter = 0;
    }
    this.counter += 1;
  };
}
export {UserService};
