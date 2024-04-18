import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonapisService } from 'src/app/services/commonapis.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NotificationService } from 'src/app/services/notification.service';
import { AdminservicesService } from 'src/app/services/adminservices.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-book-doctor',
  templateUrl: './book-doctor.component.html',
  styleUrls: ['./book-doctor.component.css']
})
export class BookDoctorComponent {
  savedImage: any;
  detailsSubmitted: any = 'newPatientForm';
  formData: any;
  DoctorId: string;
  PatientId: any;
  DoctorDetails: any = false;
  availableTimeSlots: any;
  showDynamicFields: any = false;
  timeZones: { name: string, slots: string[] }[] = [];
  selectedCardIndex: number = -1;
  selectedCardIndices: number[] = [-1, -1, -1]; // Initialize selected card indices for each section
  previouslySelectedIndex: number = -1;
  countries: any;
  states: any;
  cities: any;

  // Patient Details Form
  patientForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    gender: new FormControl(null, Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
  });

  //Appointmet Details Form
  appointmentForm: FormGroup = new FormGroup({
    patientID: new FormControl(0, Validators.required),
    doctorID: new FormControl(0, Validators.required),
    appointmentTime: new FormControl('', Validators.required),
    appointmentStatus: new FormControl(0, Validators.required),
    appointmentNotes: new FormControl('', Validators.required),
    appointmentDate: new FormControl('', Validators.required),
  });

  oldPatientForm: FormGroup = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
  })


  constructor(private cdr: ChangeDetectorRef, public dialog: MatDialog, private adminservice: AdminservicesService, private route: ActivatedRoute,
    private commonservice: CommonapisService, private ngxLoader: NgxUiLoaderService, public notification: NotificationService) { }


  ngOnInit(): void {
    this.GetDoctorId();
    this.GetDoctorProfile(this.DoctorId);
    this.countries = this.commonservice.getCountries();
  }

  countrySelected(name: any) {
    this.patientForm.get('state').reset();
    this.patientForm.get('city').reset();
    this.states = this.commonservice.getStatesByCountry(name);
    this.cities = [];
  }

  stateSelected(name: any) {
    this.patientForm.get('city').reset();
    this.cities = this.commonservice.getCitiesByState(this.patientForm.get('country').value, name.value);
  }

  PatientForm(form: any) {
    this.detailsSubmitted = form == 'oldPatient' ? 'oldPatientForm' : 'newPatientForm';
  }

  // Get doctor ID from route parameters
  GetDoctorId() {
    this.route.params.subscribe(params => {
      this.DoctorId = params['id'];
    });
  }

  // Fetch doctor's profile by ID
  GetDoctorProfile(id: any) {
    this.ngxLoader.start();
    this.commonservice.DoctorProfile(id).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.DoctorDetails = res.data[0];
          console.log(this.DoctorDetails);
          this.ngxLoader.stop();
        } else {
          this.notification.error(res.message);
        }
      }
    });
  }

  getImageUrl(base64Image: string): string {
    const imageURL = `data:image/jpeg;base64,${base64Image}`;
    return imageURL;
  }

  // Handle form submission
  formSubmission(formDetails: any) {
    if (formDetails == 'patientDetails') {
      if (this.patientForm.valid) {
        this.ngxLoader.start();
        if (this.savedImage != null)
          this.patientForm.value['imageFile'] = this.savedImage;
        this.formData = this.dataForm();
        this.AddNewPatient(this.formData);
      }
      else {
        this.markFormFieldsAsTouched();
      }
    } else if (formDetails == 'appointmentDetails') {
      this.patchValuesinForm();
      this.commonservice.BookAppointment(this.appointmentForm.value).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.notification.showSuccessNotification(res.message);
            this.selectedCardIndices = [-1, -1, -1];
            this.detailsSubmitted = 'appointmentForm';
            // this.detailsSubmitted = false;
            this.displaySlots();
            setTimeout(() => {
            }, 2000);
          } else {
            this.notification.error(res.message);
          }
        },
        error: (error: any) => {
          this.notification.error(error.message);
        }
      });
    } else {
      if (this.oldPatientForm.valid) {
        this.ngxLoader.start();
        this.getOldPatient(this.oldPatientForm.get('phone').value);
      } else {
        this.markFormFieldsAsTouched();
      }
    }
  }

  getOldPatient(phone: any) {
    this.commonservice.getPatientDetailsByMobileNumber(phone).subscribe({
      next: (res: any) => {
        if (res.data != null) {
          this.appointmentForm.patchValue({ patientID: res.data.patientID });
          this.detailsSubmitted = 'appointmentForm';
          setTimeout(() => {
            this.ngxLoader.stop();
          }, 2000);
        } else {
          this.ngxLoader.stop();
          this.notification.error(res.message);
        }
      },
      error: (error: any) => {
        this.ngxLoader.stop();
        this.notification.error(error.message);
      }
    });
  }

  // Adding New patient
  AddNewPatient(data: any) {
    this.adminservice.AddPatient(data).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.appointmentForm.patchValue({ patientID: res.data.patientID });
          this.notification.showSuccessNotification(res.message);
          this.detailsSubmitted = 'appointmentForm';
          this.ngxLoader.stop();
        } else {
          this.ngxLoader.stop();
          this.notification.error(res.message);
        }
      },
      error: (error: any) => {
        let errorMessage = 'An error occurred while adding the patient.';
        if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.notification.error(errorMessage);
        this.ngxLoader.stop();
      }
    });
  }


  // Patch values for appointment form
  patchValuesinForm() {
    this.appointmentForm.patchValue({ PatientId: this.PatientId, doctorID: this.DoctorId });
  }

  // Handle file selection
  onFileSelected(event: any) {
    this.savedImage = event.target.files[0];
  }

  //Marking the Required fields of Form
  markFormFieldsAsTouched() {
    Object.keys(this.patientForm.controls).forEach(controlName => {
      this.patientForm.get(controlName)?.markAsTouched();
    });
  }

  //When Selecting the Date For Appointment
  onDateChange(): void {
    this.displaySlots();
    this.selectedCardIndices = [-1, -1, -1]; // Reset selected card indices
  }

  //Displaying the Available Slots
  displaySlots() {
    const selectedDate = this.appointmentForm.get('appointmentDate').value;
    this.commonservice.CheckAvailability(this.DoctorId, selectedDate, false).subscribe({
      next: (res: any) => {
        if (res.status) {
          if (res.data != null && res.data.length > 0) {
            this.availableTimeSlots = res.data.filter(time => time.timePassed == false);;
            this.showDynamicFields = true;
            this.cdr.detectChanges(); // Trigger change detection
          } else {
            this.availableTimeSlots = [];
            this.showDynamicFields = false;
            this.notification.warning(res.message);
          }
        } else {
          this.notification.error(res.message);
          this.showDynamicFields = false;
        }
      },
      error: (error: any) => {
        this.notification.error(error.message);
        this.showDynamicFields = false;
      }
    });
  }

  // Checking if a time slot is booked
  isTimeBooked(timeSlot: any): boolean {
    return timeSlot.isBooked;
  }


  //For Passing the Details to Api as Objects and Keys
  dataForm() {
    console.log(this.formData);
    var formData = new FormData();
    Object.keys(this.patientForm.value).forEach(key => {
      if (key == 'imageFile') {
        formData.append('imageFile', this.savedImage);
        this.savedImage = "";
      }
      else {
        formData.append(key, this.patientForm.value[key]);
      }
    })
    return formData;
  }

  //For Converting the Time in a Proper Format
  formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    const formattedHour = parseInt(hour) > 12 ? parseInt(hour) - 12 : hour;
    const period = parseInt(hour) >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  }

  //Grouping the Slots Based on the Time Zone of 'Morning', 'Afternoon', 'Evening'
  groupTimeSlotsByTimeZone(): void {
    const timeZones = ['Morning', 'Afternoon', 'Evening'];
    for (const timeZone of timeZones) {
      const slots = this.availableTimeSlots.filter(time => this.getTimeZone(time) === timeZone);
      if (slots.length > 0) {
        this.timeZones.push({ name: timeZone, slots });
      }
    }
  }

  //For Getting the Time Zone-> 'Morning', 'Afternoon', 'Evening'
  getTimeZone(time: string): string {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) {
      return 'Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Afternoon';
    } else {
      return 'Evening';
    }
  }

  // Selecting the Available Time Slots
  selectTimeSlot(time: any): void {
    this.appointmentForm.patchValue({ appointmentTime: time.time });
  }

  // Checking if a time slot is selected
  isSelectedTime(time: any): boolean {
    if (!time.isBooked)
      return this.appointmentForm.get('appointmentTime').value === time.time;
    else
      return false;
  }

  isAlreadyBooked(time: any) {
    return time.isBooked;
  }
  //For Displaying the Available Time
  // displayTime(time: string): void {
  //   this.appointmentForm.patchValue({appointmentTime:time,doctorId:this.DoctorId});
  //   console.log(this.appointmentForm);
  // }

}
