import {Component, OnInit} from '@angular/core';
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {CommunityService} from "../../../../../services/community/community.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CommunityObjectItem} from "../../../../../interfaces/community/community-object-item";
import {Pageable} from "../../../../../interfaces/shared/pageable";
import {environment} from "../../../../../../environments/environment";
import {PaginationRequest} from "../../../../../interfaces/shared/pagination-request";
import { ColumnMode } from '@swimlane/ngx-datatable';
import {NoticeBoard} from "../../../../../interfaces/community/notice-board";
import {CreateBoardComponent} from "../create-board/create-board.component";
import {NoticesBoardsService} from "../../../../../services/notices-boards/notices-boards.service";

@Component({
  selector: 'app-show-boards',
  templateUrl: './show-boards.component.html',
  styleUrls: ['./show-boards.component.scss']
})
export class ShowBoardsComponent implements OnInit {
  modalRef!: MdbModalRef<any>;
  community!: CommunityObjectItem;
  noticesBoards: NoticeBoard[] = [];
  localBaseUrl = environment.localBaseUrl;
  pageSize = 10;
  page: PaginationRequest = {
    _start: "0",
    _end: this.pageSize.toString()
  };
  ColumnMode = ColumnMode;
  totalElements: number = 0;
  private accessLink!: string;

  constructor(private communityService: CommunityService, private route: ActivatedRoute, private router: Router,
              private toaster: ToastrService, private modalService: MdbModalService, private noticesBoardService: NoticesBoardsService) {
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
      this.getNoticesBoards();
    })
  }

  createBoard() {
    this.modalRef = this.modalService.open(CreateBoardComponent, {
      data: {
        community: this.community
      }
    })
    this.modalRef.onClose.subscribe((message: any) => {
      this.getNoticesBoards();
    });
  }

  setPage(pageInfo: any) {
    console.log(pageInfo)
    this.page._start = ((pageInfo.offset) * this.pageSize).toString();
    this.page._end = ((pageInfo.offset + 1) * this.pageSize).toString();
    this.getNoticesBoards();
  }

  private getNoticesBoards() {
    this.noticesBoardService.getNoticesBoards({
      _start: this.page._start,
      _end: this.page._end
    }, this.community.id).subscribe((communityList: Pageable<NoticeBoard>) => {
      this.noticesBoards = communityList.content;
      this.totalElements = communityList.totalElements;
    })
  }
}
