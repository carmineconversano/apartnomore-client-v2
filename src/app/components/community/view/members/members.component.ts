import {Component, OnInit} from '@angular/core';
import {CommunityService} from "../../../../services/community/community.service";
import {CommunityObjectItem} from "../../../../interfaces/community/community-object-item";
import {ActivatedRoute, Router} from "@angular/router";
import {Pageable} from "../../../../interfaces/shared/pageable";
import {environment} from "../../../../../environments/environment";
import {ToastrService} from "ngx-toastr";
import {PaginationRequest} from "../../../../interfaces/shared/pagination-request";
import {ColumnMode} from '@swimlane/ngx-datatable';
import {MdbModalRef, MdbModalService} from 'mdb-angular-ui-kit/modal';
import {ShowBoardsComponent} from "../boards/show-boards/show-boards.component";
import {EditMemberComponent} from "../edit-member/edit-member.component";
import {MembersDetail} from "../../../../interfaces/community/members-detail";
import {User} from "../../../../interfaces/user/user";
import {AuthService} from "../../../../services/auth/auth.service";


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  modalRef!: MdbModalRef<any>;
  community!: CommunityObjectItem;
  members: MembersDetail[] = [];
  localBaseUrl = environment.localBaseUrl;
  pageSize = 10;
  page: PaginationRequest = {
    _start: "0",
    _end: this.pageSize.toString()
  };
  ColumnMode = ColumnMode;
  totalElements: number = 0;
  basePathImage = environment.baseUrlImage;
  imagePathDefault: string = 'assets/profile_pic.png';
  user!: User | null;
  private accessLink!: string;

  constructor(private communityService: CommunityService, private route: ActivatedRoute, private router: Router,
              private toaster: ToastrService, private modalService: MdbModalService, private authService: AuthService) {
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get("accesslink")
    if (param) {
      this.accessLink = param;
    } else {
      this.router.navigate(['../../']).then(r => r);
    }

    this.communityService.findByAccessLink(this.accessLink).subscribe((community: CommunityObjectItem) => {
      this.community = community;
      this.getMembers();
    })

    this.authService.getCurrentUser().subscribe((user) => {
      console.log(user)
      this.user = user;
    }, error => {
      console.log(error)
    });
  }

  setPage(pageInfo: any) {
    console.log(pageInfo)
    this.page._start = ((pageInfo.offset) * this.pageSize).toString();
    this.page._end = ((pageInfo.offset + 1) * this.pageSize).toString();
    this.getMembers();
  }

  invitePerson($event: any) {
    this.toaster.success('Link copiato negli appunti!', 'Copiato');
  }

  editMember(row: any) {
    this.modalRef = this.modalService.open(EditMemberComponent, {
      data: {
        member: row,
        community: this.community
      }
    })
  }

  onSort($event: any) {
    console.log($event)
  }

  private getMembers() {
    this.communityService.getMembers({
      _start: this.page._start,
      _end: this.page._end
    }, this.community.id).subscribe((communityList: Pageable<MembersDetail>) => {
      this.members = communityList.content;
      this.totalElements = communityList.totalElements;
    })
  }
}
