import {Component, OnInit} from '@angular/core';
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {CommunityObjectItem} from "../../../../../interfaces/community/community-object-item";
import {environment} from "../../../../../../environments/environment";
import {PaginationRequest} from "../../../../../interfaces/shared/pagination-request";
import {CommunityService} from "../../../../../services/community/community.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Pageable} from "../../../../../interfaces/shared/pageable";
import {ColumnMode} from '@swimlane/ngx-datatable';
import {NoticesService} from "../../../../../services/notices/notices.service";
import {Notice} from "../../../../../interfaces/community/notice";
import {CreateNoticeComponent} from "../create-notice/create-notice.component";
import {CreateCommentComponent} from "../create-comment/create-comment.component";

@Component({
  selector: 'app-show-notices',
  templateUrl: './show-notices.component.html',
  styleUrls: ['./show-notices.component.scss']
})
export class ShowNoticesComponent implements OnInit {
  modalRef!: MdbModalRef<any>;
  community!: CommunityObjectItem;
  notices: Notice[] = [];
  localBaseUrl = environment.localBaseUrl;
  pageSize = 10;
  page: PaginationRequest = {
    _start: "0",
    _end: this.pageSize.toString()
  };
  ColumnMode = ColumnMode;
  totalElements: number = 0;
  private accessLink!: string;
  private boardId!: string;

  constructor(private communityService: CommunityService, private route: ActivatedRoute, private router: Router,
              private toaster: ToastrService, private modalService: MdbModalService, private noticesService: NoticesService) {
  }

  ngOnInit(): void {
    const accesslink = this.route.snapshot.paramMap.get("accesslink");
    if (accesslink) {
      this.accessLink = accesslink;
    } else {
      this.router.navigate(['../../../']).then(r => r);
    }

    const boardId = this.route.snapshot.paramMap.get("boardId");
    if (boardId) {
      this.boardId = boardId;
    } else {
      this.router.navigate(['../../']).then(r => r);
    }


    this.communityService.findByAccessLink(this.accessLink).subscribe((community: CommunityObjectItem) => {
      this.community = community;
      this.getNotices();
    })
  }

  createComment(noticeId: string | number) {
    this.modalRef = this.modalService.open(CreateCommentComponent, {
      data: {
        noticeId: noticeId
      }
    })
    this.modalRef.onClose.subscribe((message: any) => {
      this.getNotices();
    });
  }

  createNotice() {
    this.modalRef = this.modalService.open(CreateNoticeComponent, {
      data: {
        boardId: this.boardId
      }
    })
    this.modalRef.onClose.subscribe((message: any) => {
      this.getNotices();
    });
  }

  setPage(pageInfo: any) {
    console.log(pageInfo)
    this.page._start = ((pageInfo.offset) * this.pageSize).toString();
    this.page._end = ((pageInfo.offset + 1) * this.pageSize).toString();
    this.getNotices();
  }

  private getNotices() {
    this.noticesService.getNotices({
      _start: this.page._start,
      _end: this.page._end
    }, this.boardId).subscribe((noticeList: Pageable<Notice>) => {
      this.notices = noticeList.content;
      this.totalElements = noticeList.totalElements;
    })
  }

}
