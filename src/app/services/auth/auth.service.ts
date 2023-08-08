import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Signup} from "../../interfaces/auth/signup";
import {SignupResponse} from "../../interfaces/auth/signupResponse";
import {LoginForm} from "../../interfaces/auth/loginForm";
import {JwtResponse} from "../../interfaces/auth/jwtResponse";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../../interfaces/user/user";
import {UserService} from "../users/user.service";

const baseUrl = `${environment.baseUrl}/api/auth`
const {ACCESS_TOKEN, USER_ID} = environment;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private id: number | undefined;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private httpClient: HttpClient, private router: Router, private userService: UserService) {
    this.token = '';
  }

  static getAuthorizationToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  static getUserId(): string | null {
    return localStorage.getItem(USER_ID);
  }

  private static tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  signup(signupForm: Signup) {
    return this.httpClient.post<SignupResponse>(`${baseUrl}/signup`, signupForm);
  }

  login(loginForm: LoginForm) {
    return this.httpClient.post<JwtResponse>(`${baseUrl}/login`, loginForm).pipe(tap(async (response) => {
      if (response.accessToken) {
        try {
          this.saveToken(response.tokenType + ' ' + response.accessToken);
          this.saveUserId(response.id);
          this.getCurrentUser();
        } catch (e) {
        }
      }
    }));
  }

  updateUser(user: User | null) {
    console.log('updating')
    this.currentUserSubject.next(user)
  }

  getCurrentUser(): Observable<User | null> {
    if (this.currentUserSubject.getValue()) {
      return this.currentUserSubject.asObservable();
    } else {
      this.userService.getMe().toPromise().then((data: any) => {
        this.updateUser(data)
      }).catch(() => {
        this.updateUser(null);
      })
      return this.currentUserSubject.asObservable();
    }
  }

  public isAuthenticated(): boolean {
    const token = AuthService.getAuthorizationToken();
    if (token) {
      return !AuthService.tokenExpired(token);
    }
    return false
  }

  logOut() {
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(ACCESS_TOKEN);
    this.updateUser(null);
    this.router.navigateByUrl('/auth/login').then(r => r);
  }

  private saveToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN, token);
    this.token = token;
  }

  private saveUserId(id: number): void {
    this.id = id;
    localStorage.setItem(USER_ID, String(id));
  }
}
