import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgxPermissionsService} from "ngx-permissions";
import {AuthService} from "../../../../services/auth/auth.service";
import {UserService} from "../../../../services/users/user.service";
import {PermissionsList} from "../../../../interfaces/community/permissions-list";
import {User} from "../../../../interfaces/user/user";
import {CommunityService} from "../../../../services/community/community.service";
import {CommunityObjectItem} from "../../../../interfaces/community/community-object-item";
import {environment} from "../../../../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-view-general',
  templateUrl: './view-general.component.html',
  styleUrls: ['./view-general.component.scss']
})
export class ViewGeneralComponent implements OnInit {
  community!: CommunityObjectItem;
  imagePathDefault: string = 'assets/cover.jpg';
  basePathImage = environment.baseUrlImage;
  private accessLink: string = '';

  constructor(private route: ActivatedRoute, private router: Router,
              private permissionsService: NgxPermissionsService, private authService: AuthService,
              private userService: UserService, private communityService: CommunityService,
              private toaster: ToastrService) {
  }

  async ngOnInit(): Promise<void> {
    const param = this.route.snapshot.paramMap.get("accesslink")
    if (param) {
      this.accessLink = param
    } else {
      this.router.navigate(['../../']).then(r => r);
    }

    this.communityService.findByAccessLink(this.accessLink).subscribe((community: CommunityObjectItem) => {
      this.community = community;
      this.userService.getPermissionsByCommunity(community.id).subscribe((permissions: PermissionsList) => {
        this.authService.getCurrentUser().subscribe((user: User | null) => {
          const roles = user?.roles.map(role => {
            if (role.hasOwnProperty('name')) {
              return role.name.toString()
            } else {
              return role.toString();
            }
          });
          this.permissionsService.loadPermissions(permissions.permissionSet.concat(roles || []));
        })
      })
    }, () => {
      this.router.navigate(['../../']).then(r => r);
    })
  }


  joinCommunity(community: CommunityObjectItem) {
    this.communityService.joinCommunity(community.id).subscribe((response) => {
      this.toaster.success('Iscritto correttamente alla community', 'Iscritto');
      community.subscribed = true;
      setTimeout(async (): Promise<void> => {
        window.location.reload();
      }, 1000);
    }, error => {
      this.toaster.error('C\'è stato un problema tecnico, contatta l\'amministratore', 'Errore tecnico');
    })
  }
}
