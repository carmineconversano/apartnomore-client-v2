import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {NgxPermissionsService} from "ngx-permissions";
import {PaginationRequest} from "../../interfaces/shared/pagination-request";
import {Observable} from "rxjs";
import {Pageable} from "../../interfaces/shared/pageable";
import {Comment} from "../../interfaces/community/comment";

const baseUrl = `${environment.baseUrl}/api/comments`

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(private http: HttpClient, private permissionsService: NgxPermissionsService) {
  }

  ngOnInit() {
    console.log(this.permissionsService.getPermissions());
  }

  getComments(pagination: PaginationRequest, noticeId: number | string): Observable<Pageable<Comment>> {
    let params = new HttpParams();
    Object.keys(pagination).forEach((key) => {
      params = params.set(key, <string>pagination[key])
    })
    return this.http.get<Pageable<Comment>>(`${baseUrl}/${noticeId}`, {params});
  }

  addComment(comment: Comment, noticeId: string | number) {
    return this.http.post<Comment>(`${baseUrl}/${noticeId}/create`, comment);
  }
}

