import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationPipe} from './navigation.pipe';


@NgModule({
  declarations: [
    NavigationPipe
  ],
  exports: [
    NavigationPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedPipesModule {
}
