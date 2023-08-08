import {Component, OnInit} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {MembersDetail} from "../../../../interfaces/community/members-detail";
import {NgxPermissionsService} from "ngx-permissions";
import {EPermission} from "../../../../enum/EPermission";
import {CommunityService} from "../../../../services/community/community.service";
import {UserService} from "../../../../services/users/user.service";
import {CommunityObjectItem} from "../../../../interfaces/community/community-object-item";
import {PermissionsList} from "../../../../interfaces/community/permissions-list";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss']
})
export class EditMemberComponent implements OnInit {

  member!: MembersDetail;
  community!: CommunityObjectItem;
  permissionList = [
    {
      checked: false,
      description: "Permesso di scrivere commenti, post ed eventi",
      value: EPermission.USE_WRITE
    },
    {
      checked: false,
      description: "Permesso di leggere commenti, post ed eventi",
      value: EPermission.USE_READ
    },
    {
      checked: false,
      description: "Permesso di creare bacheche e calendari",
      value: EPermission.USE_CREATE
    },
    {
      checked: false,
      description: "Permesso di eliminare commenti, post ed eventi",
      value: EPermission.USE_DELETE
    },
    {
      checked: false,
      description: "Permesso di cambiare autorizzazioni utenti",
      value: EPermission.USE_MOD
    },
    {
      checked: false,
      description: "Permesso di cambiare informazioni di community",
      value: EPermission.USE_CHANGESETTINGS
    }
  ];

  constructor(public modalRef: MdbModalRef<EditMemberComponent>, private permissionsService: NgxPermissionsService, private usersService: UserService, private communityService: CommunityService,
              private toaster: ToastrService) {
    console.log(modalRef)
    console.log(this.permissionsService.getPermissions())
  }

  updatePermissions() {
    const permissions: PermissionsList = {
      permissionSet: []
    }
    for (const perm of this.permissionList) {
      if (perm.checked) {
        permissions.permissionSet.push(perm.value)
      }
    }
    this.communityService.changePermissions(this.community.id, this.member.id, permissions).subscribe((permissions) => {
      this.toaster.success('Permessi cambiati con successo', 'Ottimo!');
      this.close();
    }, error => {
      this.toaster.error('Permessi invariati', 'Errore!');
      this.close();
    });
  }


  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage)
  }

  ngOnInit(): void {
    this.usersService.getPermissionsByCommunity(this.community.id, this.member.id).subscribe((permissions) => {
      for (const perm of permissions.permissionSet) {
        this.permissionList = this.permissionList.map((value => {
          if (value.value === perm) {
            value.checked = true;
          }
          return value;
        }))
      }
      console.log(this.permissionList);
    })
  }

}
