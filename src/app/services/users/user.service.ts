import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {environment} from "../../../environments/environment";
import {PermissionsList} from "../../interfaces/community/permissions-list";
import {Observable} from "rxjs";
import {User} from "../../interfaces/user/user";

const baseUrl = `${environment.baseUrl}/api/users`

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {
  }

  getMe() {
    const userId = AuthService.getUserId();
    if (userId)
      return this.httpClient.get<User>(`${baseUrl}/me`);
    else {
      throw new Error('Not signed in!');
    }
  }

  getPermissionsByCommunity(communityId: number, userId: number | string = ''): Observable<PermissionsList> {
    return this.httpClient.get<PermissionsList>(`${baseUrl}/permissions/${communityId}/${userId}`);
  }
}
