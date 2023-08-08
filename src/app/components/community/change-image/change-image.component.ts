import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-change-image',
  templateUrl: './change-image.component.html',
  styleUrls: ['./change-image.component.scss']
})
export class ChangeImageComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  //
  // private onSuccess() {
  //   this.selectedFile.pending = false;
  //   this.selectedFile.status = 'ok';
  // }
  //
  // private onError() {
  //   this.selectedFile.pending = false;
  //   this.selectedFile.status = 'fail';
  //   this.selectedFile.src = '';
  // }
  //
  //
  // uploadImage(imageInput: any) {
  //   const file: File = imageInput.files[0];
  //   const reader = new FileReader();
  //
  //   reader.addEventListener('load', (event: any) => {
  //
  //     this.selectedFile = new ImageSnippet(event.target.result, file);
  //     this.selectedFile.pending = true;
  //     this.uploadService.uploadImage(this.selectedFile.file).subscribe(
  //       (res) => {
  //         this.selectedFile.src = res.data || '';
  //         this.createCommunityForm.patchValue({
  //           imageId: res.id
  //         });
  //         this.onSuccess();
  //       },
  //       (err) => {
  //         this.onError();
  //       })
  //   });
  //
  //   reader.readAsDataURL(file);
  // }


}
