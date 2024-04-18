import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isAdminRoute: boolean = false;
  isPatientRoute: boolean = false;
  isDoctorRoute: boolean = false;
  @Input() Profile:any;

  constructor(private router: Router, private authorizationService: AuthService) {
    this.checkRoutes();
  }

  checkRoutes(): void {
    const currentRoute = this.router.url;
    this.isAdminRoute = currentRoute.includes('/admin');
   // this.isPatientRoute = currentRoute.includes('/patient');
    this.isDoctorRoute = currentRoute.includes('/doctor');
  }

  LoginUser(): void {
    this.router.navigateByUrl('login');
  }

  navigateTo(route: string): void {
    if (this.isAdminRoute) {
      this.router.navigate(['/admin/' + route]);
    } else {
      this.router.navigate(['/' + route]);
    }
  }

  logout(): void {
    this.authorizationService.logout();
  }

  getImageUrl(base64Image: string): string {

    const imageURL = `data:image/jpeg;base64,${base64Image}`;
    return imageURL;
  }
}
