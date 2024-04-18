import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminservicesService {
  private apiUrl = environment.Apiurl;

  constructor(private http: HttpClient,private auth:AuthService) {}

  private getHeaders() {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${this.auth.getToken()}`);
  }

  addNewDoctor(obj: any) {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/DoctorProfiles`, obj, { headers });
  }

  DisplayCategories(){
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/DoctorProfiles/Categories`, {headers} );
  }

  DisplayDoctors(pageNumber: number, pageSize: number, filterValue?: string, sortColumnName: string = 'FeesPaidDate', sortOrder: string = "desc"){
    const headers = this.getHeaders();
    let url = `${this.apiUrl}/DoctorProfiles?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filterValue) {
      url += `&filterValue=${filterValue}`;
    }
    if (sortColumnName && sortOrder) {
      url += `&sortColumnName=${sortColumnName}&sortOrder=${sortOrder}`;
    }
    return this.http.get<any>(url, {headers} );
  }

  DeleteDoctor(id:any){
    const headers = this.getHeaders();
    return this.http.delete(this.apiUrl+"/DoctorProfiles/"+id, {headers});
  }

  updateDoctor(id:any,obj:any){
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/DoctorProfiles/${id}`,obj,{headers});
  }

  AddPatient(obj: any) {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/PatientProfiles`, obj, { headers });
  }

  DisplayPatients(pageNumber: number, pageSize: number, filterValue?: string, sortColumnName: string = 'FeesPaidDate', sortOrder: string = "desc"){
    const headers = this.getHeaders();
    let url = `${this.apiUrl}/PatientProfiles?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filterValue) {
      url += `&filterValue=${filterValue}`;
    }
    if (sortColumnName && sortOrder) {
      url += `&sortColumnName=${sortColumnName}&sortOrder=${sortOrder}`;
    }
    return this.http.get<any>(url, {headers} );
  }

  DeletePatient(id:any){
    const headers = this.getHeaders();
    return this.http.delete(this.apiUrl+"/PatientProfiles/"+id, {headers});
  }

  updatePatient(id:any,obj:any){
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/PatientProfiles/${id}`,obj,{headers});
  }

  DisplayAppointments(pageNumber: number, pageSize: number, filterValue?: string, sortColumnName: string = 'FeesPaidDate', sortOrder: string = "desc"){
    const headers = this.getHeaders();
    let url = `${this.apiUrl}/PatientDoctorAppointment?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filterValue) {
      url += `&filterValue=${filterValue}`;
    }
    if (sortColumnName && sortOrder) {
      url += `&sortColumnName=${sortColumnName}&sortOrder=${sortOrder}`;
    }
    return this.http.get<any>(url, {headers} );
  }

  DeleteAppointment(id:any){
    const headers = this.getHeaders();
    return this.http.delete(this.apiUrl+"/PatientDoctorAppointment/"+id, {headers});
  }

}

