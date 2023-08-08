import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateComponent} from "./create/create.component";
import {SubscribedComponent} from "./subscribed/subscribed.component";
import {SearchComponent} from "./search/search.component";

const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent,
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'subscribed',
    children: [
      {
        path: '',
        component: SubscribedComponent,
        pathMatch: 'full'
      },
      {
        path: 'view',
        loadChildren: () => import('./view/view.module').then(m => m.ViewModule),
      }
    ]
  }
];

export const communityRouting: ModuleWithProviders<any> = RouterModule.forChild(routes);
