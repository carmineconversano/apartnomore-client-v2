import {Component, OnInit} from '@angular/core';
import {MembersDetail} from "../../../../../interfaces/community/members-detail";
import {CommunityObjectItem} from "../../../../../interfaces/community/community-object-item";
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {NoticesBoardsService} from "../../../../../services/notices-boards/notices-boards.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NoticeBoard} from "../../../../../interfaces/community/notice-board";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent implements OnInit {

  member!: MembersDetail;
  community!: CommunityObjectItem;
  createBoardForm!: FormGroup;

  constructor(public modalRef: MdbModalRef<CreateBoardComponent>, private noticesBoardsService: NoticesBoardsService,
              private formBuilder: FormBuilder, private toaster: ToastrService) {
  }

  get name(): FormControl {
    return this.createBoardForm.get('name') as FormControl;
  }

  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage)
  }

  ngOnInit(): void {
    this.createBoardForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]]
    })
  }

  createForm() {
    this.noticesBoardsService.createNoticeBoard(this.createBoardForm.value as NoticeBoard, this.community.id).subscribe((noticeBoard) => {
      this.toaster.success('Bacheca creata con successo', 'Creata!');
      this.close();
    }, error => {
      console.error(error);
      this.toaster.error('Bacheca NON creata', 'Errore!');
    })
  }
}
