import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import {ToastrService} from "ngx-toastr";
import {CreateBoardComponent} from "../create-board/create-board.component";
import {NoticesService} from "../../../../../services/notices/notices.service";
import {Notice} from "../../../../../interfaces/community/notice";

@Component({
  selector: 'app-create-notice',
  templateUrl: './create-notice.component.html',
  styleUrls: ['./create-notice.component.scss']
})
export class CreateNoticeComponent implements OnInit {
  boardId!: string | number;
  createNoticeForm!: FormGroup;

  constructor(public modalRef: MdbModalRef<CreateBoardComponent>, private noticesService: NoticesService,
              private formBuilder: FormBuilder, private toaster: ToastrService) {
  }

  get title(): FormControl {
    return this.createNoticeForm.get('title') as FormControl;
  }

  get description(): FormControl {
    return this.createNoticeForm.get('description') as FormControl;
  }

  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage)
  }

  ngOnInit(): void {
    this.createNoticeForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(30000)]],
    })
  }

  createForm() {
    this.noticesService.createNotice(this.createNoticeForm.value as Notice, this.boardId).subscribe((notice) => {
      this.toaster.success('Notizia creata con successo', 'Creata!');
      this.close();
    }, error => {
      console.error(error);
      this.toaster.error('Notizia NON creata', 'Errore!');
    })
  }

}
