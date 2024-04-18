import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonapisService } from 'src/app/services/commonapis.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private service: CommonapisService, private noti: NotificationService, private router: Router, private auth: AuthService) { }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  //Submitting the Login Details
  loginFormSubmit() {
    if (this.loginForm.valid) {
      this.auth.signIn(this.loginForm.value).subscribe({
        next: (res: any) => {
          if (res.statusCode === 200) {
            // Save token to local storage
            localStorage.setItem('access_token', res.data.token);
            // Navigate based on role
            const role = this.auth.getDashboardRoute();
            if (role === '1') {
              this.router.navigateByUrl('/admin');
            } else if (role === '2') {
              const id = res.data.loginID;
              this.router.navigate(['/doctor-dashboard/', id]); // Pass id as a segment of the route
            } else if (role === '3') {
              const id = res.data.loginID;
              this.router.navigate(['/patient/', id]); // Pass id as a segment of the route
            }
          } else {
            this.noti.error(res.message);
            this.loginForm.reset();
          }
        },
        error: (error: any) => {
          this.noti.error(error.message);
        }
      });
    }
  }


}
