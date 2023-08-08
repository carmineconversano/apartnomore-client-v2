import {User} from "../user/user";

export interface Notice {
  id?: number;
  title: string;
  description: string;
  userWriter: User;
}
