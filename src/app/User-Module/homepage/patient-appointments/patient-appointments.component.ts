import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonapisService } from 'src/app/services/commonapis.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl,PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AdminservicesService } from 'src/app/services/adminservices.service';

declare var easy_background: any;
@Component({
  selector: 'app-patient-appointments',
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.css']
})
export class PatientAppointmentsComponent {
totalData: any;
UpdateAppointmentDetails(_t160: any) {
  throw new Error('Method not implemented.');
}

DeleteAppointment(arg0: any) {
throw new Error('Method not implemented.');
}
getAppointmentStatusClass(arg0: any): string|string[]|Set<string>|{ [klass: string]: any; } {
throw new Error('Method not implemented.');
}

  displayedColumns = ['doctorName', 'patientID', 'doctorID', 'appointmentDate', 'appointmentTime']
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('closeModalBtn') CloseButton: any;

  showRecords: boolean = false;
  pageSizes = [5, 10, 20, 30, 50, 100];
  currentpageIndex = 1;
  currentpageSize = 5;
  filterValue: string = '';
  sortColumnName!: string;
  sortOrder!: string;
  appointmentListOfPatient:any;
  mobileNumber:any;
  doctors:any;

  mobileForm: FormGroup = new FormGroup({
    mobileNumber: new FormControl('', Validators.required),
  });

  constructor(private adminService: AdminservicesService,public _MatPaginatorIntl: MatPaginatorIntl,private notification: NotificationService, private commonService: CommonapisService,private ngxLoader: NgxUiLoaderService) { }

  formSubmission(): void {
    if (this.mobileForm.valid) {
       this.mobileNumber = this.mobileForm.value.mobileNumber;
      this.searchAppointmentWithLoader(this.mobileNumber);
    }else {
      this.notification.error("Enter your Mobile Number Correctly")
    }
  }




  // Call the service method passing the mobile number
  searchAppointmentByMobile(mobile:any){

      this.commonService.searchAppointmentByMobileNo(mobile,this.currentpageIndex, this.currentpageSize, this.filterValue, this.sortColumnName, this.sortOrder).subscribe({
        next: (res: any) => {
          if (!res.data || res.data.length === 0) {
            this.ngxLoader.stop();
            this.notification.noRecord(res.message);
            this.showRecords = false;
          }
          else{
            this.ngxLoader.stop();
            this.showRecords = res.data!=null?true:false;
            this.appointmentListOfPatient = res;
            this.dataSource = new MatTableDataSource(this.appointmentListOfPatient.data);
            this.mobileForm.reset();
          }
        }
      });
  }

  searchAppointmentWithLoader(mobile:any){
    this.ngxLoader.start();
    this.searchAppointmentByMobile(mobile);

  }

  ngOnInit(){
   this._MatPaginatorIntl.itemsPerPageLabel = 'Records Per Page:';

  }
  ngAfterViewInit(): void {
    // Call easy_background function to create background slideshow
    easy_background("#home", {
      slide: [
        "assets/images/bg/02.jpg",
        "assets/images/bg/03.jpg",
        "assets/images/bg/04.jpg",
      ],
      delay: [3000, 3000, 3000],
    });
  }

 //For Handling Pagination
 handlePagination(event: any) {
  this.currentpageIndex = event.pageIndex + 1;
  this.currentpageSize = event.pageSize;
  this.searchAppointmentByMobile(this.mobileNumber);
}

 //For Sorting the Appointments
 sortAppointments(event: any) {
  this.sortColumnName = event.active;
  this.sortOrder = event.direction;
  this.searchAppointmentByMobile(this.mobileNumber);
 }
   //For Converting the Time in a Proper Format
   formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    const formattedHour = parseInt(hour) > 12 ? parseInt(hour) - 12 : hour;
    const period = parseInt(hour) >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  }

  displaySearchAgain(){
    this.showRecords = false;
    this.ngxLoader.start();
    this.appointmentListOfPatient="";
    setTimeout(() => {
      this.ngxLoader.stop();
    }, 1000);
  }
}
