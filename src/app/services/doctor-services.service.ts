import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorServicesService {
  private apiUrl = environment.Apiurl;
  constructor(private http: HttpClient,private auth:AuthService) {}

  private getHeaders() {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${this.auth.getToken()}`);
  }

  DoctorAppointmentById(id:any,pageNumber: number, pageSize: number, filterValue?: string, sortColumnName: string = 'FeesPaidDate', sortOrder: string = "desc"): Observable<any> {
    const headers = this.getHeaders();
    let url = `${this.apiUrl}/PatientDoctorAppointment/${id}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filterValue) {
      url += `&filterValue=${filterValue}`;
    }
    if (sortColumnName && sortOrder) {
      url += `&sortColumnName=${sortColumnName}&sortOrder=${sortOrder}`;
    }
    return this.http.get<any>(url, {headers} );
  }

  getDoctorAppointmentsWithDoctorId(doctorId:any,pageNumber: number, pageSize: number, filterValue?: string, sortColumnName: string = 'FeesPaidDate', sortOrder: string = "desc"){
    const headers = this.getHeaders();
    let url = `${this.apiUrl}/PatientDoctorAppointment/GetAppointmentWithDoctorID/${doctorId}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filterValue) {
      url += `&filterValue=${filterValue}`;
    }
    if (sortColumnName && sortOrder) {
      url += `&sortColumnName=${sortColumnName}&sortOrder=${sortOrder}`;
    }
    return this.http.get<any>(url, {headers} );
  }

  getDoctorAppointmentsWithLoginId(loginId:any,pageNumber: number, pageSize: number, filterValue?: string, sortColumnName: string = 'FeesPaidDate', sortOrder: string = "desc"){
    const headers = this.getHeaders();
    let url = `${this.apiUrl}/PatientDoctorAppointment/GetAppointmentByLoginId/${loginId}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filterValue) {
      url += `&filterValue=${filterValue}`;
    }
    if (sortColumnName && sortOrder) {
      url += `&sortColumnName=${sortColumnName}&sortOrder=${sortOrder}`;
    }
    return this.http.get<any>(url, {headers} );
  }

   getDoctorProfileByLoginId(loginId: any){
    const url = `${this.apiUrl}/DoctorProfiles/GetProfileByLoginId/${loginId}`;
    return this.http.get(url);
  }

  getDoctorStatsByDoctorId(doctorID: any){
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/DoctorProfiles/GetDoctorStatsOnLoginId?DoctorID=${doctorID}`;
    return this.http.get(url,{headers});
  }
}
