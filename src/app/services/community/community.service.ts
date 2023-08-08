import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {NgxPermissionsService} from "ngx-permissions";
import {Observable} from "rxjs";
import {Pageable} from "../../interfaces/shared/pageable";
import {CommunityObjectItem} from "../../interfaces/community/community-object-item";
import {environment} from "../../../environments/environment";
import {PaginationRequest} from "../../interfaces/shared/pagination-request";
import {CreateCommunity} from "../../interfaces/community/create-community";
import {JoinedCommunityResponse} from 'src/app/interfaces/community/joined-community-response';
import {MembersDetail} from "../../interfaces/community/members-detail";
import {PermissionsList} from "../../interfaces/community/permissions-list";

const baseUrl = `${environment.baseUrl}/api/community`

@Injectable({
  providedIn: 'root'
})
export class CommunityService implements OnInit {

  constructor(private http: HttpClient, private permissionsService: NgxPermissionsService) {
  }

  public createCommunity(createCommunity: CreateCommunity) {
    return this.http.post<CommunityObjectItem>(`${baseUrl}/create`, createCommunity);
  }

  ngOnInit() {
    console.log(this.permissionsService.getPermissions());
  }

  getSubscribed(pagination: PaginationRequest): Observable<Pageable<CommunityObjectItem>> {
    let params = new HttpParams();
    Object.keys(pagination).forEach((key) => {
      params = params.set(key, <string>pagination[key])
    })
    return this.http.get<Pageable<CommunityObjectItem>>(`${baseUrl}/subscribed/list`, {params});
  }

  getPublics(pagination: PaginationRequest): Observable<Pageable<CommunityObjectItem>> {
    let params = new HttpParams();
    Object.keys(pagination).forEach((key) => {
      params = params.set(key, <string>pagination[key])
    })
    return this.http.get<Pageable<CommunityObjectItem>>(`${baseUrl}/public/list`, {params});
  }

  getNearMe(pagination: PaginationRequest, distance: number = 10): Observable<Pageable<CommunityObjectItem>> {
    let params = new HttpParams();
    Object.keys(pagination).forEach((key) => {
      params = params.set(key, <string>pagination[key])
    })
    params = params.set('distance', String(distance));
    return this.http.get<Pageable<CommunityObjectItem>>(`${baseUrl}/public/list/nearme`, {params});
  }

  findByAccessLink(accessLink: string) {
    return this.http.get<CommunityObjectItem>(`${baseUrl}/${accessLink}`);
  }

  joinCommunity(communityId: number) {
    return this.http.post<JoinedCommunityResponse>(`${baseUrl}/join/${communityId}`, {});
  }

  getMembers(pagination: PaginationRequest, communityId: number): Observable<Pageable<MembersDetail>> {
    let params = new HttpParams();
    Object.keys(pagination).forEach((key) => {
      params = params.set(key, <string>pagination[key])
    })
    return this.http.get<Pageable<MembersDetail>>(`${baseUrl}/${communityId}/members`, {params});
  }

  changePermissions(communityId: number, memberId: number, permissions: PermissionsList) {
    return this.http.put<PermissionsList>(`${baseUrl}/${communityId}/change/member/${memberId}`, permissions);
  }
}
