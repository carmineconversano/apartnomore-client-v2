import {Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';

import {NgxPermissionsService} from "ngx-permissions";
import {AuthService} from "./services/auth/auth.service";
import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'apartnomore-client';
  // Instead of holding a boolean value for whether the spinner
  // should show or not, we store a reference to the spinner element,
  // see template snippet below this script
  @ViewChild('spinnerElement')
  spinnerElement!: ElementRef

  @ViewChild('mainElement')
  mainElement!: ElementRef

  constructor(private permissionsService: NgxPermissionsService, private authService: AuthService, private router: Router,
              private ngZone: NgZone,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe((user) => {
        const roles = user?.roles.map(role => {
          if (role.hasOwnProperty('name')) {
            return role.name.toString()
          } else {
            return role.toString();
          }
        });
        this.permissionsService.loadPermissions(roles || []);
      })
    }
    this.router.events.subscribe(this._navigationInterceptor.bind(this))
  }

  // Shows and hides the loading spinner during RouterEvent changes
  private _navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      // We wanna run this function outside of Angular's zone to
      // bypass change detection
      this.ngZone.runOutsideAngular(() => {
        // For simplicity we are going to turn opacity on / off
        // you could add/remove a class for more advanced styling
        // and enter/leave animation of the spinner
        this.renderer.setStyle(
          this.spinnerElement.nativeElement,
          'opacity',
          '1'
        )
        this.renderer.setStyle(
          this.spinnerElement.nativeElement,
          'height',
          '100vh'
        )
        this.renderer.setStyle(
          this.mainElement.nativeElement,
          'opacity',
          '1'
        )
      })
    }
    if (event instanceof NavigationEnd) {
      this._hideSpinner()
    }
    // Set loading state to false in both of the below events to
    // hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this._hideSpinner()
    }
    if (event instanceof NavigationError) {
      this._hideSpinner()
    }
  }

  private _hideSpinner(): void {
    // We wanna run this function outside of Angular's zone to
    // bypass change detection,
    this.ngZone.runOutsideAngular(() => {
      // For simplicity we are going to turn opacity on / off
      // you could add/remove a class for more advanced styling
      // and enter/leave animation of the spinner
      this.renderer.setStyle(
        this.spinnerElement.nativeElement,
        'opacity',
        '0'
      )
      this.renderer.setStyle(
        this.spinnerElement.nativeElement,
        'height',
        '0'
      )
      this.renderer.setStyle(
        this.mainElement.nativeElement,
        'opacity',
        '0'
      )
    })
  }
}
