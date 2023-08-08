import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewGeneralComponent} from "./view-general/view-general.component";
import {MembersComponent} from "./members/members.component";
import {CommunityGuard} from "../../../guards/community.guard";
import {CalendarsComponent} from "./calendars/calendars.component";


const routes: Routes = [
  {
    path: ':accesslink',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ViewGeneralComponent,
      }, {
        path: 'members',
        component: MembersComponent,
        canActivate: [CommunityGuard]
      }, {
        path: 'boards',
        loadChildren: () => import('./boards/boards.module').then(m => m.BoardsModule),
        canActivate: [CommunityGuard]
      }, {
        path: 'calendars',
        component: CalendarsComponent,
        canActivate: [CommunityGuard]
      }
    ]
  }
];

export const viewRouting: ModuleWithProviders<any> = RouterModule.forChild(routes);
