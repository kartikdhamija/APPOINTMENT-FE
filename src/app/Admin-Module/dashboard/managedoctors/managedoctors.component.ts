import { Component, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdminservicesService } from 'src/app/services/adminservices.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CommonapisService } from 'src/app/services/commonapis.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-managedoctors',
  templateUrl: './managedoctors.component.html',
  styleUrls: ['./managedoctors.component.css']
})
export class ManagedoctorsComponent {
  //dateofbirth,address
  displayedColumns = ['serialNumber', 'image', 'firstName', 'lastName', 'timeShift', 'email', 'phone', 'city', 'specialty', 'qualifications', 'experienceYears', 'isActive', 'doctorID', 'Actions'];
  dataSource!: MatTableDataSource<any>;

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
  savedImage: any;
  onEditButton: boolean = false;
  errorMessage: any;
  formData: any;
  data: any;
  dataList: any;
  totalData: any;
  categoryList: any;
  countries: any;
  states: any;
  cities: any;


  shiftOptions: { label: string, value: string }[] = [
    { label: '07:00 AM - 03:00 PM', value: '07:00-15:00' },
    { label: '03:00 PM - 11:00 PM', value: '15:00-23:00' },
    { label: '11:00 PM - 07:00 AM', value: '23:00-07:00' }
  ];


  doctorForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    categoriesID: new FormControl(null, Validators.required),
    lastName: new FormControl('', Validators.required),
    gender: new FormControl(null, Validators.required),
    dateofBirth: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    specialty: new FormControl('', Validators.required),
    qualifications: new FormControl('', Validators.required),
    experienceYears: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    shift: new FormControl('', Validators.required),
    shiftStart: new FormControl('', Validators.required),
    shiftEnd: new FormControl('', Validators.required),
  });
  constructor(private adminService: AdminservicesService, private notification: NotificationService, public commonservice: CommonapisService, private ngxLoader: NgxUiLoaderService) { }

  //Get Doctors List to Display
  getAllDoctorsList() {
    this.ngxLoader.start();
    this.adminService.DisplayDoctors(this.currentpageIndex, this.currentpageSize, this.filterValue, this.sortColumnName, this.sortOrder).subscribe({
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
    this.ngxLoader.stop();
  }

  timeShift() {
    const selectedShift = this.doctorForm.get('shift').value.split('-');
    const shiftStart = selectedShift[0].trim();
    const shiftEnd = selectedShift[1].trim();

    const shiftStartTime = this.convertToTimeSpan(shiftStart);
    const shiftEndTime = this.convertToTimeSpan(shiftEnd);

    this.doctorForm.patchValue({
      shiftStart: shiftStartTime,
      shiftEnd: shiftEndTime
    });
  }

  ngOnInit(): void {
    this.displayDoctorCategoriesList();
    this.getAllDoctorsList();
    this.countries = this.commonservice.getCountries();
  }

  countrySelected(name: any) {
    // this.doctorForm.get('state').reset();
    // this.doctorForm.get('city').reset();
    this.states = this.commonservice.getStatesByCountry(name);
    this.cities = [];
  }

  stateSelected(name: any) {
    // this.doctorForm.get('city').reset();
    this.cities = this.commonservice.getCitiesByState(this.doctorForm.get('country').value, name.value);
  }

  speciality(categoryId: number) {
    const selectedCategory = this.categoryList.find(category => category.categoriesID == categoryId);
    if (selectedCategory) {
      this.doctorForm.patchValue({
        specialty: selectedCategory.categoriesName
      });
    }
  }

  //get Doctor Categories List
  displayDoctorCategoriesList() {
    return this.adminService.DisplayCategories().subscribe({
      next: (res: any) => {
        this.categoryList = res.data;
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }

  //For Handling Pagination
  handlePagination(event: any) {
    this.currentpageIndex = event.pageIndex + 1;
    this.currentpageSize = event.pageSize;
    this.getAllDoctorsList();
  }

  //To Add New Doctor
  addNewDoctor(data: any) {
    this.ngxLoader.start();
    this.adminService.addNewDoctor(data).subscribe({
      next: (res: any) => {
        if (res.status) {
          const message =  `Your Username is  :  ${res.data}`;
          this.ngxLoader.stop();
          this.notification.confirmation(res.message,message);
          setTimeout(() => {
            this.getAllDoctorsList();
            this.CloseButton.nativeElement.click();
          }, 2000);
        } else {
          this.ngxLoader.stop();
          this.notification.error(res.message);
        }
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }


  //To updateDoctorDetails
  updateDoctorDetails(id: any, data: any) {
    this.adminService.updateDoctor(id, data).subscribe({
      next: (res: any) => {
        this.notification.showSuccessNotification(res.message);
        setTimeout(() => {
          this.getAllDoctorsList();
          this.CloseButton.nativeElement.click();
          this.onEditButton = false;
        }, 2000);
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }

  //Converting the ImageUrl
  getImageUrl(base64Image: string): string {
    const imageURL = `data:image/jpeg;base64,${base64Image}`;
    return imageURL;
  }

  onDoctorFormSubmission(): void {
    if (this.doctorForm.valid) {
      if (this.savedImage != null)
        this.doctorForm.value['imageFile'] = this.savedImage;
      if (!this.onEditButton) {
        this.formData = this.dataForm();
        this.addNewDoctor(this.formData);
      } else {
        this.doctorForm.value['doctorID'] = this.globalobj.doctorID;
        this.formData = this.dataForm();
        this.updateDoctorDetails(this.globalobj.doctorID, this.formData);
      }
    } else {
      this.markFormFieldsAsTouched();
    }
  }

  //Marking the Required fields of Form
  markFormFieldsAsTouched() {
    Object.keys(this.doctorForm.controls).forEach(controlName => {
      this.doctorForm.get(controlName)?.markAsTouched();
    });
  }

  //Deleting the Doctor Profile
  deleteDoctorProfile(id: any) {
    this.adminService.DeleteDoctor(id).subscribe({
      next: (res: any) => {
        this.notification.showSuccessNotification(res.message);
        setTimeout(() => {
          this.getAllDoctorsList();
        }, 2000);
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }

  //For Passing the Details to Api as Objects and Keys
  dataForm() {
    const formData = new FormData();
    formData.append('firstName', this.doctorForm.get('firstName')!.value);
    formData.append('categoriesID', this.doctorForm.get('categoriesID')!.value);
    formData.append('lastName', this.doctorForm.get('lastName')!.value);
    formData.append('gender', this.doctorForm.get('gender')!.value);
    formData.append('dateofBirth', this.doctorForm.get('dateofBirth')!.value);
    formData.append('email', this.doctorForm.get('email')!.value);
    formData.append('phone', this.doctorForm.get('phone')!.value);
    formData.append('address', this.doctorForm.get('address')!.value);
    formData.append('city', this.doctorForm.get('city')!.value);
    formData.append('state', this.doctorForm.get('state')!.value);
    formData.append('zipCode', this.doctorForm.get('zipCode')!.value);
    formData.append('country', this.doctorForm.get('country')!.value);
    formData.append('specialty', this.doctorForm.get('specialty')!.value);
    formData.append('qualifications', this.doctorForm.get('qualifications')!.value);
    formData.append('experienceYears', this.doctorForm.get('experienceYears')!.value);
    formData.append('shiftStart', this.doctorForm.get('shiftStart')!.value);
    formData.append('shiftEnd', this.doctorForm.get('shiftEnd')!.value);
    if (!this.onEditButton) {
      formData.append('password', this.doctorForm.get('password')!.value);
    }
    if (this.savedImage) {
      formData.append('imageFile', this.savedImage);
      this.savedImage = "";
    }

    return formData;
  }


  // dataForm() {
  //   console.log(this.formData);
  //    var formData = new FormData();
  //   Object.keys(this.doctorForm.value).forEach(key => {
  //     formData.append(key, this.doctorForm.value[key]);
  //   })
  //   console.log(formData);
  // }

  // Updating the Doctor Profile
  updateDoctorProfile(data: any) {
    this.doctorForm.removeControl('password');
    this.onEditButton = true;
    this.globalobj = data;
    const dateOfBirth = data.dateofBirth.slice(0, 10);
    const shiftStartTime = data.shiftStart.slice(0, 5);
    const shiftEndTime = data.shiftEnd.slice(0, 5);
    const selectedShiftOption = this.shiftOptions.find(option => option.value === `${shiftStartTime}-${shiftEndTime}`);

    this.doctorForm.patchValue({
      ...data,
      shift: selectedShiftOption ? selectedShiftOption.value : null
    });

    this.doctorRegion();
    // this.stateSelected(this.doctorForm.get('state'));
  }

  doctorRegion() {
    this.states = this.commonservice.getStatesByCountry(this.doctorForm.get('country').value);
    this.cities = this.commonservice.getCitiesByState(this.doctorForm.get('country').value, this.doctorForm.get('state').value);
  }

  //openDoctorForm as a Popup
  openDoctorForm() {
    if (!this.onEditButton) {
      this.doctorForm.reset();
    }
  }

  //closeDoctorForm as a Popup
  closeDoctorForm() {
    this.onEditButton = false;
  }
  //For Sorting the DoctorsList
  sortDoctorsList(event: any) {
    this.sortColumnName = event.active;
    this.sortOrder = event.direction;
    this.getAllDoctorsList();
  }

  //For Image Selection on Updation and Submission
  onFileSelected(event: any) {
    this.savedImage = event.target.files[0];
  }

  //For Filtering the Doctor List
  filterDoctorsList(filterValue: any) {
    this.filterValue = filterValue.target.value;
    this.getAllDoctorsList();
  }

  public convertToTimeSpan(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const timeSpan = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    return timeSpan;
  }

}
