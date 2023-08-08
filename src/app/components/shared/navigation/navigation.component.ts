import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {ToastrService} from "ngx-toastr";

export interface NavbarItem {
  title: string,
  routerLink: string,
  roles?: string[],
  loggedIn: boolean
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navbarList: NavbarItem[] = [
    {
      title: 'Dashboard',
      roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR'],
      routerLink: '/dashboard',
      loggedIn: true,
    },
    {
      title: 'Sfoglia',
      roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR'],
      routerLink: '/community/search',
      loggedIn: true,
    },
    {
      title: 'Home',
      routerLink: '/home',
      loggedIn: false
    },
    {
      title: 'Login',
      routerLink: '/auth/login',
      loggedIn: false
    },
    {
      title: 'Registrati',
      routerLink: '/auth/signup',
      loggedIn: false
    }
  ]
  user: any;

  constructor(private router: Router, private authService: AuthService, private toaster: ToastrService) {

  }

  async ngOnInit(): Promise<void> {
    this.authService.getCurrentUser().subscribe((user) => {
      console.log(user)
      this.user = user;
    }, error => {
      console.log(error)
    });
  }


  isCurrent(navPath: string): boolean {
    return navPath.trim() === this.router.url.trim();
  }

  logOut() {
    this.authService.logOut();
    this.toaster.success('Successful logout', 'Logout')
  }
}
