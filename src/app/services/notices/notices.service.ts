import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {NgxPermissionsService} from "ngx-permissions";
import {PaginationRequest} from "../../interfaces/shared/pagination-request";
import {Observable} from "rxjs";
import {Pageable} from "../../interfaces/shared/pageable";
import {environment} from "../../../environments/environment";
import {Notice} from "../../interfaces/community/notice";

const baseUrl = `${environment.baseUrl}/api/notices`

@Injectable({
  providedIn: 'root'
})
export class NoticesService {
  constructor(private http: HttpClient, private permissionsService: NgxPermissionsService) {
  }

  public createNotice(notice: Notice, boardId: number | string) {
    return this.http.post<Notice>(`${baseUrl}/${boardId}/create`, notice);
  }

  ngOnInit() {
    console.log(this.permissionsService.getPermissions());
  }

  getNotices(pagination: PaginationRequest, boardId: number | string): Observable<Pageable<Notice>> {
    let params = new HttpParams();
    Object.keys(pagination).forEach((key) => {
      params = params.set(key, <string>pagination[key])
    })
    return this.http.get<Pageable<Notice>>(`${baseUrl}/${boardId}`, {params});
  }

  addComment(comment: Comment, noticeId: string | number) {
    return this.http.post<Notice>(`${baseUrl}/${noticeId}/create`, comment);
  }
}
