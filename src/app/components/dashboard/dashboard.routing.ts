import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MainDashboardComponent} from "./main-dashboard/main-dashboard.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MainDashboardComponent,
  }];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);
