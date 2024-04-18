import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxUiLoaderConfig, NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  config: NgxUiLoaderConfig;
  constructor(private ngxUiLoaderService: NgxUiLoaderService) {
    this.config = this.ngxUiLoaderService.getDefaultConfig();
  }

  showSuccessNotification(message: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  error(message: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  warning(message: string): void {
    Swal.fire({
      text: message,
      icon: "warning",
    });
  }


  noRecord(message: string): void {
    Swal.fire({
      position: 'top-end',
      icon: "warning",
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  confirmation(title:any,message:any):void{
    Swal.fire({
      title: title,
      text: message,
      icon: "success"
    });
  }
}
