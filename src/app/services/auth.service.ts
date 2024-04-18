import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.Apiurl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();


  setUserData(userData: any) {
    this.userDataSubject.next(userData);
  }

  constructor(private http: HttpClient, public router: Router,private sharedservice:SharedService) { }

  signIn(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login`, user)
      .pipe(
        map(res => {
          if (res && res.data && res.data.token) {
            localStorage.setItem('access_token', res.data.token);
            // Check if token is expired
            if (this.isTokenExpired()) {
              this.logout(); // Token expired, logout user
              throw new Error("Token expired");
            }
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    return !!this.getToken(); // Check if token exists
  }

  logout() {
    localStorage.removeItem('access_token');
    this.sharedservice.removeId();
    this.router.navigate([""]);
  }

  // Add a method to check if the token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true; // Token doesn't exist
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(tokenData.exp * 1000);
    return expirationDate <= new Date();
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  getDashboardRoute(): any {
    const token = localStorage.getItem('access_token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Parse the token payload
      const role = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return role;
    }
  }
}


