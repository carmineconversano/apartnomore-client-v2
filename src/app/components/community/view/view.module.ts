import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {viewRouting} from "./view.routing";
import {MembersComponent} from './members/members.component';
import {CalendarsComponent} from './calendars/calendars.component';
import {ClipboardModule} from "ngx-clipboard";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {EditMemberComponent} from './edit-member/edit-member.component';
import {NgxPermissionsModule} from "ngx-permissions";
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CommunityInfoComponent } from './community-info/community-info.component';


@NgModule({
  declarations: [
    MembersComponent,
    CalendarsComponent,
    EditMemberComponent,
    CommunityInfoComponent,
  ],
  exports: [
    CommunityInfoComponent
  ],
  imports: [
    viewRouting,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClipboardModule,
    NgxDatatableModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxPermissionsModule,
    MdbCheckboxModule,
    MdbValidationModule,
    MdbFormsModule,
    MdbTooltipModule,
  ]
})
export class ViewModule {
}
