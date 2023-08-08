import {Address} from "../user/address";

export interface Signup {
  profile: {
    name: string;
    surname: string;
    avatarUrl: string;
    phoneNumber: string
  },
  username: string,
  password: string,
  email: string,
  address?: Address
}
