import {Notice} from "./notice";
import {User} from "../user/user";

export interface Comment {
  id?: number;
  text: string;
  user?: User;
  notice?: Notice;
  created?: string;
}
