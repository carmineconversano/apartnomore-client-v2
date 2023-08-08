import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import {ToastrService} from "ngx-toastr";
import {Comment} from "../../../../../interfaces/community/comment";
import {CommentsService} from "../../../../../services/comments/comments.service";
import {Pageable} from "../../../../../interfaces/shared/pageable";

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent implements OnInit {
  noticeId!: string | number;
  createCommentForm!: FormGroup;
  throttle = 0;
  distance = 2;
  page = 1;
  comments: Comment[] = [];

  constructor(public modalRef: MdbModalRef<CreateCommentComponent>, private commentsService: CommentsService,
              private formBuilder: FormBuilder, private toaster: ToastrService) {
  }

  get text(): FormControl {
    return this.createCommentForm.get('text') as FormControl;
  }

  getComments(_start: string | number = 0, _end: string | number = 20) {
    this.commentsService.getComments({
      _start: _start,
      _end: _end,
    }, this.noticeId).subscribe((commentList: Pageable<Comment>) => {
      const ids = new Set(this.comments.map(d => d.id));
      this.comments = [...this.comments, ...commentList.content.filter(d => !ids.has(d.id))];
    })
  }

  onScroll(): void {
    console.log('scroll')
    this.getComments(this.page * 20, ++this.page * 20);
  }

  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage)
  }

  ngOnInit(): void {
    this.getComments();
    this.createCommentForm = this.formBuilder.group({
      text: ['', [Validators.required, Validators.maxLength(30000)]],
    })
  }

  createForm() {
    this.commentsService.addComment(this.createCommentForm.value as Comment, this.noticeId).subscribe((comment: Comment) => {
      this.toaster.success('Commento aggiunto con successo', 'Aggiunto!');
      this.getComments();
      this.createCommentForm.reset();
    }, error => {
      console.error(error);
      this.toaster.error('Commento NON creato', 'Errore!');
    })
  }

}
