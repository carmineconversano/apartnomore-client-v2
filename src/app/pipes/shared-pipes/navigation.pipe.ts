import {Pipe, PipeTransform} from '@angular/core';
import {NavbarItem} from "../../components/shared/navigation/navigation.component";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";

@Pipe({
  name: 'navigation',
  pure: false
})
export class NavigationPipe implements PipeTransform {

  constructor(private router: Router, private authService: AuthService) {
  }

  transform(items: NavbarItem[]): any {
    const isLogged = this.authService.isAuthenticated();
    if (!items) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter((item: NavbarItem) => {
      return item.loggedIn === isLogged;
    });
  }

}
