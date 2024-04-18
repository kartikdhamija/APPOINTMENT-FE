import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as countrycitystatejson from 'countrycitystatejson';
import { map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonapisService {
  private apiUrl = environment.Apiurl;
  private countryData = countrycitystatejson;

  constructor(private http: HttpClient,private auth:AuthService) {}

  getCountries() {
    return this.countryData.getCountries();
  }

  getStatesByCountry(countryShotName: string) {
    return this.countryData.getStatesByShort(countryShotName);
  }

  getCitiesByState(country: string, state: string) {
    return this.countryData.getCities(country, state);

  }

  getDoctorBasedOnSearch(text:string){
    return this.http.get(`${this.apiUrl}/DoctorProfiles/GetFilteredDoctorProfiles?search=${text}`);
  }

  formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    const formattedHour = parseInt(hour) > 12 ? parseInt(hour) - 12 : hour;
    const period = parseInt(hour) >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  }

  private getHeaders() {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${this.auth.getToken()}`);
  }

  DoctorProfile(id:any){
    return this.http.get<any>(`${this.apiUrl}/DoctorProfiles/${id}`);
  }

  DisplayDoctors(pageNumber: number, pageSize: number, filterValue?: string, sortColumnName?: string, sortOrder: string = "desc"): Observable<any> {
    const headers = this.getHeaders();
    let url = `${this.apiUrl}/DoctorProfiles/HomepageDoctors?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filterValue) {
      url += `&filterValue=${filterValue}`;
    }
    if (sortColumnName && sortOrder) {
      url += `&sortColumnName=${sortColumnName}&sortOrder=${sortOrder}`;
    }
    return this.http.get<any>(url, {headers} );
  }

  CheckAvailability(id: any, date: any,updation:boolean) {
    const isoDate = new Date(date).toISOString();
    return this.http.get(`${this.apiUrl}/PatientDoctorAppointment/CheckAvialability/${id}/${isoDate}/${updation}`, {});
  }

  BookAppointment(data:any){
    return this.http.post(`${this.apiUrl}/PatientDoctorAppointment`,data);
  }

  UpdateAppointment(id:any,data:any){
    return this.http.put(`${this.apiUrl}/PatientDoctorAppointment/${id}`,data);
  }

  PatientProfileByLoginId(id:any){
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/PatientProfiles/GetPatientProfileByLoginId/${id}`, {headers} );
  }

  searchAppointmentByMobileNo(mobileno:any,pageNumber: number, pageSize: number, filterValue?: string, sortColumnName: string = 'FeesPaidDate', sortOrder: string = "desc"){
     let url = `${this.apiUrl}/PatientDoctorAppointment/SearchAppointmentWithMobileNumber/${mobileno}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

     if (filterValue) {
       url += `&filterValue=${filterValue}`;
     }
     if (sortColumnName && sortOrder) {
       url += `&sortColumnName=${sortColumnName}&sortOrder=${sortOrder}`;
     }
     return this.http.get<any>(url);

    }

    getPatientDetailsByMobileNumber(phone:any){
      return this.http.get(`${this.apiUrl}/PatientProfiles/GetPatientProfileByMobileNumber/${phone}`)
    }

}
