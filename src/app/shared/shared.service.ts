import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  doctorProfile: any;
  doctorId: any;
  constructor() { }

  public saveId(id: string): void {
    // localStorage.setItem('doctorID', id);
    this.doctorId = id;
  }

  public getId(): string {
    return this.doctorId;
  }

  public removeId() {
    localStorage.removeItem('doctorID');
  }
}
