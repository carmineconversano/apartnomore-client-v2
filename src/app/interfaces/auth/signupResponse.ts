import {Role} from "./role";
import {UserProfileResponse} from "./userProfileResponse";
import {AddressResponse} from "./addressResponse";

export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  roles: Role[],
  profile: UserProfileResponse,
  address?: AddressResponse
}
