import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdminservicesService } from 'src/app/services/adminservices.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CommonapisService } from 'src/app/services/commonapis.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DoctorServicesService } from 'src/app/services/doctor-services.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/shared.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css']
})
export class DoctorAppointmentsComponent {
  displayedColumns = ['serialNumber', 'patientName', 'patientID', 'doctorID', 'appointmentID', 'appointmentDate', 'appointmentTime', 'appointmentStatus', 'appointmentNotes', 'Actions']
  dataSource!: MatTableDataSource<any>;
  @Input() Id1: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('closeModalBtn') CloseButton: any;

  pageSizes = [5, 10, 20, 30, 50, 100];
  currentpageIndex = 1;
  currentpageSize = 5;
  filterValue: string = '';
  sortColumnName!: string;
  sortOrder!: string;
  globalobj: any;
  patients: any;
  doctors: any;
  timeSlots: any;
  value: any;
  loginId: any;
  doctorId: any;
  date: Date;


  onEditButton: boolean = false;
  doctorProfile: any;
  errorMessage: any;
  formData: any;
  data: any;
  dataList: any;
  totalData: any;
  classForm: FormGroup;

  appointmentForm: FormGroup = new FormGroup({
    patientID: new FormControl(0, Validators.required),
    doctorID: new FormControl(0, Validators.required),
    appointmentTime: new FormControl('', Validators.required),
    appointmentStatus: new FormControl(0, Validators.required),
    appointmentNotes: new FormControl('', Validators.required),
    appointmentStatusNotes: new FormControl('', Validators.required),
    appointmentDate: new FormControl('', Validators.required),
  });

  constructor( private route:ActivatedRoute,private adminService: AdminservicesService, private notification: NotificationService, private commonService: CommonapisService, private doctorService: DoctorServicesService, private ngxLoader: NgxUiLoaderService, private sharedService: SharedService) {

  }

  GetDoctorId() {
    // this.loginId = this.route.parent.snapshot.params["id"]
    // this.doctorService.getDoctorProfileByLoginId(this.loginId).subscribe((res:any)=>{
    //   this.doctorProfile= res.data[0];
      // this.sharedService.doctorProfile=this.doctorProfile;
      this.doctorId = this.sharedService.getId();
      this.getDoctorAppointmentsByDoctorId(this.doctorId);
  };



  //Get All Appointments List for Admin
  getAllAppointmentsList() {
    this.adminService.DisplayAppointments(this.currentpageIndex, this.currentpageSize, this.filterValue, this.sortColumnName, this.sortOrder).subscribe({
      next: (res: any) => {
        this.totalData = res.totalResultedRecords;
        this.dataList = res.data;
        this.dataSource = new MatTableDataSource(this.dataList);
        this.CloseButton.nativeElement.click();
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }

  getDoctorAppointmentsByDoctorId(doctorID: any) {
    this.ngxLoader.start();
    // this.doctorId = profile.doctorID
    this.doctorService.getDoctorAppointmentsWithDoctorId(doctorID, this.currentpageIndex, this.currentpageSize, this.filterValue, this.sortColumnName, this.sortOrder).subscribe({
      next: (res: any) => {
        this.totalData = res.totalResultedRecords;
        this.dataList = res.data;
        this.ngxLoader.stop();
        this.dataSource = new MatTableDataSource(this.dataList);
        this.CloseButton.nativeElement.click();
      },
      error: (error: any) => {
        this.notification.error(error.message);
        this.ngxLoader.stop();
      }
    });
  }


  ngOnInit(): void {
    this.GetDoctorId();
    // this.getDoctorAppointmentsByDoctorId(this.doctorProfile.doctorID);
  }

  //For Handling Pagination
  handlePagination(event: any) {
    this.currentpageIndex = event.pageIndex + 1;
    this.currentpageSize = event.pageSize;
    // this.getAllAppointmentsList();
    this.getDoctorAppointmentsByDoctorId(this.doctorId);
  }

  //Get All Patients List for Form List
  getAllPatientsList() {
    this.adminService.DisplayPatients(this.currentpageIndex, 100, this.filterValue, this.sortColumnName, this.sortOrder).subscribe({
      next: (res: any) => {
        this.patients = res.data;
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }
  //Get All Doctors List for Form List
  getAllDoctorsList() {
    this.adminService.DisplayDoctors(this.currentpageIndex, 100, this.filterValue, this.sortColumnName, this.sortOrder).subscribe({
      next: (res: any) => {
        this.doctors = res.data;
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }

  //When Selecting the Date For Appointment
  onDateChange(): void {
    this.DisplayTimeSlots();
  }

  //For Dislaying the Time Slots on Selected Date
  DisplayTimeSlots() {
    const selectedDate = this.appointmentForm.get('appointmentDate').value;
    this.commonService.CheckAvailability(this.doctorId, selectedDate, this.onEditButton).subscribe({
      next: (res: any) => {
        if (res.status) {
          if (res.data != null && res.data.length > 0) {
            this.timeSlots = res.data;
          } else {
            this.notification.warning(res.message);
          }
        } else {
          this.notification.error(res.message);
        }
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }

  // Submitting/Updating the Appointment Forn
  appointmentFormSubmission(): void {
    this.appointmentForm.patchValue({ doctorID: this.doctorId });
    if (this.appointmentForm.valid) {
      if (!this.onEditButton) {
        const hasAppointmentIdControl = this.appointmentForm.contains('appointmentID');
        if (hasAppointmentIdControl) {
          this.appointmentForm.removeControl('appointmentID');
        }
        this.commonService.BookAppointment(this.appointmentForm.value).subscribe({
          next: (res: any) => {
            if (res.status) {
              this.notification.showSuccessNotification(res.message);
              this.CloseButton.nativeElement.click();
              this.getDoctorAppointmentsByDoctorId(this.doctorId);
            } else {
              this.notification.error(res.message);
            }
          },
          error: (error: any) => {
            this.notification.error(error.message);
          }
        });
      } else {
        const id = this.appointmentForm.get('appointmentID').value;
        this.commonService.UpdateAppointment(id, this.appointmentForm.value).subscribe({
          next: (res: any) => {
            if (res.status) {
              this.notification.showSuccessNotification(res.message);
              this.CloseButton.nativeElement.click();
              this.getDoctorAppointmentsByDoctorId(this.doctorId);
            } else {
              this.notification.error(res.message);
            }
          },
          error: (error: any) => {
            this.notification.error(error.message);
          }
        });
      }
    } else {
      this.markFormFieldsAsTouched();
    }
  }

  //Marking the Required fields of Form
  markFormFieldsAsTouched() {
    Object.keys(this.appointmentForm.controls).forEach(controlName => {
      this.appointmentForm.get(controlName)?.markAsTouched();
    });
  }

  //Deleting the Appointment
  DeleteAppointment(id: any) {
    this.adminService.DeleteAppointment(id).subscribe({
      next: (res: any) => {
        this.notification.showSuccessNotification(res.message);
        this.getDoctorAppointmentsByDoctorId(this.doctorId);
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }

  //For Passing the Details to Api as Objects and Keys
  dataForm() {
    this.formData = new FormData();
    Object.keys(this.classForm.value).forEach(key => {
      this.formData.append(key, this.classForm.value[key]);
    })
  }

  //Updating the Appointment
  UpdateAppointmentDetails(data: any) {
    if (this.patients === undefined) {
      this.getAllPatientsList();
      this.getAllDoctorsList();
    }
    const hasAppointmentIdControl = this.appointmentForm.contains('appointmentID');
    this.onEditButton = true;
    if (hasAppointmentIdControl) {
      this.appointmentForm.get('appointmentID').setValue(data.appointmentID);
    } else {
      this.appointmentForm.addControl('appointmentID', new FormControl(data.appointmentID));
    }
    this.appointmentForm.patchValue({
      patientID: data.patientID,
      doctorID: data.doctorID,
      appointmentDate: this.formatDate(data.appointmentDate),
      appointmentTime: data.appointmentTime,
      appointmentStatus: data.appointmentStatus,
      appointmentStatusNotes: data.appointmentStatusNotes,
      appointmentNotes: data.appointmentNotes
    });
    // Call DisplayTimeSlots after patching the appointmentDate and doctorID
    this.DisplayTimeSlots();
  }


  //For Formatting the Date to Patch in the field
  formatDate(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  //openAppointmentForm as a Popup
  openAppointmentForm() {
    this.appointmentForm.reset();
    // this.getAllDoctorsList();
    this.getAllPatientsList();
    if (!this.onEditButton) {
      this.appointmentForm.reset();
    }
  }

  //closeAppointmentForm as a Popup
  closeAppointmentForm() {
    this.onEditButton = false;
    this.timeSlots = [];
  }

  //For Sorting the Appointments
  sortAppointments(event: any) {
    this.sortColumnName = event.active;
    this.sortOrder = event.direction;
    this.getDoctorAppointmentsByDoctorId(this.doctorId);
    // this.getAllAppointmentsList();
  }

  //Add text Filter Value
  filterByValue(filterValue: any) {
    const newValue = filterValue.target.value.trim();

    // Extract date portion if present
    const datePart = this.extractDatePart(this.filterValue);

    // Update filterValue
    if (datePart) {
      this.filterValue = `${newValue},${datePart}`;
    } else {
      this.filterValue = newValue;
    }

    this.getDoctorAppointmentsByDoctorId(this.doctorId);
  }

  //For Extracting the Date Part
  extractDatePart(value: string): string | null {
    const indexOfComma = value.indexOf(',');
    return indexOfComma !== -1 ? value.substring(indexOfComma + 1).trim() : null;
  }


  //Add Date Filter Value
  filterByDate(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    const formattedDate = selectedDate ? this.formatDate(selectedDate) : '';

    if (!selectedDate && !this.filterValue) {
      // If both event.value and this.filterValue are undefined, set this.filterValue to an empty string
      this.filterValue = '';
    } else if (!selectedDate && this.filterValue) {
      // If event.value is undefined but this.filterValue already has a value, remove the text after the comma
      const indexOfComma = this.filterValue.indexOf(',');
      if (indexOfComma !== -1) {
        this.filterValue = this.filterValue.substring(0, indexOfComma);
      }
    } else {
      if (this.filterValue) {
        const indexOfComma = this.filterValue.indexOf(',');
        if (indexOfComma !== -1) {
          // Replace the text after the first comma with the formatted date
          this.filterValue = this.filterValue.substring(0, indexOfComma + 1) + formattedDate;
        } else {
          // If no comma found, append comma and formatted date
          this.filterValue += ',' + formattedDate;
        }
      } else {
        // If no existing filter value, set filter value to the formatted date
        this.filterValue = ',' + formattedDate;
      }
    }

    this.getDoctorAppointmentsByDoctorId(this.doctorId);
  }


  //For Getting the Appointment Status
  getAppointmentStatusClass(status: string): string {
    switch (status) {
      case 'Scheduled':
        return 'scheduled';
      case 'Cancelled':
        return 'cancelled';
      case 'Completed':
        return 'completed';
      default:
        return '';
    }
  }

  //For Converting the Time in a Proper Format
  formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    const formattedHour = parseInt(hour) > 12 ? parseInt(hour) - 12 : hour;
    const period = parseInt(hour) >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  }


  clearDate(event) {
    event.stopPropagation();
    this.date = null;
    this.filterByDate(event);
  }

}
