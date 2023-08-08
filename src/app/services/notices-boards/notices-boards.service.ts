import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {NgxPermissionsService} from "ngx-permissions";
import {PaginationRequest} from "../../interfaces/shared/pagination-request";
import {Observable} from "rxjs";
import {Pageable} from "../../interfaces/shared/pageable";
import {NoticeBoard} from "../../interfaces/community/notice-board";
import {environment} from "../../../environments/environment";

const baseUrl = `${environment.baseUrl}/api/noticeboard`


@Injectable({
  providedIn: 'root'
})
export class NoticesBoardsService {

  constructor(private http: HttpClient, private permissionsService: NgxPermissionsService) {
  }

  public createNoticeBoard(noticeBoard: NoticeBoard, communityId: number) {
    return this.http.post<NoticeBoard>(`${baseUrl}/${communityId}/create`, noticeBoard);
  }

  ngOnInit() {
    console.log(this.permissionsService.getPermissions());
  }

  getNoticesBoards(pagination: PaginationRequest, communityId: number): Observable<Pageable<NoticeBoard>> {
    let params = new HttpParams();
    Object.keys(pagination).forEach((key) => {
      params = params.set(key, <string>pagination[key])
    })
    return this.http.get<Pageable<NoticeBoard>>(`${baseUrl}/${communityId}`, {params});
  }
}
