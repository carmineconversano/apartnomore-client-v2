import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {NgxPermissionsService} from "ngx-permissions";
import {CommunityObjectItem} from "../interfaces/community/community-object-item";
import {PermissionsList} from "../interfaces/community/permissions-list";
import {CommunityService} from "../services/community/community.service";
import {UserService} from "../services/users/user.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class CommunityGuard implements CanActivate {
  private accessLink!: string;

  constructor(private authService: AuthService, private router: Router, private permissionService: NgxPermissionsService,
              private communityService: CommunityService, private userService: UserService, private toaster: ToastrService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const param = route.paramMap.get("accesslink")
    if (param) {
      this.accessLink = param;
    } else {
      this.router.navigate(['/community/subscribed']).then(r => r);
      return false;
    }

    return new Observable<boolean>((obs) => {
      this.communityService.findByAccessLink(this.accessLink).subscribe((community: CommunityObjectItem) => {
        this.userService.getPermissionsByCommunity(community.id).subscribe((permissions: PermissionsList) => {
          this.authService.getCurrentUser().subscribe((user) => {
            const roles = user?.roles.map(role => {
              if (role.hasOwnProperty('name')) {
                return role.name.toString()
              } else {
                return role.toString();
              }
            });
            this.permissionService.loadPermissions(permissions.permissionSet.concat(roles || []));
            if (permissions.permissionSet.length <= 0) {
              this.toaster.warning('Non hai i permessi necessari a visualizzare questa pagina', 'Permessi mancanti!')
              this.router.navigate(['/community/subscribed/view', this.accessLink]).then(r => r);
              obs.next(false);
              obs.complete();
            } else {
              obs.next(true);
              obs.complete();
            }
          })
        })
      }, () => {
        this.toaster.error('C\'è stato un problema tecnico, contatta l\'amministratore', 'Errore tecnico');
        this.router.navigate(['/community/subscribed/view', this.accessLink]).then(r => r);
        obs.next(false);
        obs.complete();
      })
    });


  }

}
