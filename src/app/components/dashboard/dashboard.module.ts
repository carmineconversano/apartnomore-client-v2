import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainDashboardComponent} from './main-dashboard/main-dashboard.component';
import {CommunityModule} from "../community/community.module";
import {routing} from "./dashboard.routing";

@NgModule({
  imports: [
    routing,
    CommonModule,
    CommunityModule,
  ],
  declarations: [
    MainDashboardComponent
  ],
})
export class DashboardModule {
}
