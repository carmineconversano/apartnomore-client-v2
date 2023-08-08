import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {NavigationComponent} from "./navigation/navigation.component";
import {RouterModule} from "@angular/router";
import {SharedPipesModule} from "../../pipes/shared-pipes/shared-pipes.module";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {HomepageComponent} from './homepage/homepage.component';
import {VgCoreModule} from "@videogular/ngx-videogular/core";
import {VgControlsModule} from "@videogular/ngx-videogular/controls";
import {VgOverlayPlayModule} from "@videogular/ngx-videogular/overlay-play";
import {VgBufferingModule} from "@videogular/ngx-videogular/buffering";
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    PageNotFoundComponent,
    NavigationComponent,
    HomepageComponent
  ],
  exports: [
    NavigationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedPipesModule,
    MdbCollapseModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    MdbDropdownModule,
    ToastrModule.forRoot({
      positionClass :'toast-bottom-right'
    })
  ]
})
export class SharedModule {
}
