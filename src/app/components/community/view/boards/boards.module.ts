import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateBoardComponent} from "./create-board/create-board.component";
import {ShowBoardsComponent} from "./show-boards/show-boards.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ReactiveFormsModule} from "@angular/forms";
import { MdbFormsModule} from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import {ShowNoticesComponent} from './show-notices/show-notices.component';
import {CreateNoticeComponent} from './create-notice/create-notice.component';
import {boardsRouting} from "./boards.routing";
import {NgxPermissionsModule} from "ngx-permissions";
import {CreateCommentComponent} from './create-comment/create-comment.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {ViewModule} from "../view.module";


@NgModule({
  declarations: [CreateBoardComponent, ShowBoardsComponent, ShowNoticesComponent, CreateNoticeComponent, CreateCommentComponent],
  imports: [
    boardsRouting,
    InfiniteScrollModule,
    CommonModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    MdbFormsModule,
    MdbValidationModule,
    NgxPermissionsModule,
    ViewModule,
  ]
})
export class BoardsModule {
}
