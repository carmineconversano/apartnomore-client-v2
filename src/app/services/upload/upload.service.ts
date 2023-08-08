import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Upload} from "../../interfaces/shared/upload";

const baseUrl = `${environment.baseUrl}/api/upload`


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private httpClient: HttpClient) {
  }

  uploadImage(image: File): Observable<Upload> {
    const formData = new FormData();
    formData.append('file', image);

    return this.httpClient.post<Upload>(`${baseUrl}`, formData);
  }
}
