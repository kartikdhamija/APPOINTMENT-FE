import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(private router: Router) {}

  isAdminRoute(): boolean {
    // Get the current route URL
    const currentRoute = this.router.url;

    // Check if the route contains 'admin' in its path
    return currentRoute.includes('/admin');
  }
}
