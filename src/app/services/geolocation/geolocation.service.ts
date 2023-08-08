import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {NgxPermissionsService} from "ngx-permissions";
import {PaginationRequest} from "../../interfaces/shared/pagination-request";
import {Observable} from "rxjs";
import {Pageable} from "../../interfaces/shared/pageable";
import {Comment} from "../../interfaces/community/comment";

const baseUrl = `https://nominatim.openstreetmap.org`

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor(private http: HttpClient, private permissionsService: NgxPermissionsService) {
  }

  ngOnInit() {
    console.log(this.permissionsService.getPermissions());
  }

  lookup(osm_ids: string = "", type: string = ""): Observable<any> {
    let params = new HttpParams();
    params = params.set("osm_ids", "W" + osm_ids);
    params = params.set("format", "json");
    console.log(params)
    return this.http.get<any>(`${baseUrl}/lookup`, {params});
  }
}
