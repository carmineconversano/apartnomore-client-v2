import {Role} from "../auth/role";
import {Address} from "./address";

export interface User {
  username: string;
  email: string;
  roles: Role[];
  id: number;
  address?: Address;
}
