import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShowBoardsComponent} from "./show-boards/show-boards.component";
import {ShowNoticesComponent} from "./show-notices/show-notices.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ShowBoardsComponent,
  }, {
    path: ':boardId',
    children: [
      {
        path: 'notices',
        component: ShowNoticesComponent
      }
    ]
  }
];

export const boardsRouting: ModuleWithProviders<any> = RouterModule.forChild(routes);
