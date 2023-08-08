import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {NgxPermissionsService} from "ngx-permissions";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private permissionService: NgxPermissionsService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log(this.authService.isAuthenticated())
    if (!this.authService.isAuthenticated()) {
      console.log(this.authService.isAuthenticated())
      console.log('You are not authenticated')
      this.router.navigate(['/auth/login']);
      return false
    }
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        const roles = user?.roles.map(role => {
          if (role.hasOwnProperty('name')) {
            return role.name.toString()
          } else {
            return role.toString();
          }
        });
        this.permissionService.loadPermissions(roles || []);
      } else {
        return true;
      }
      return false;
    });

    return true;
  }

}
