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
  selector: 'app-managepatients',
  templateUrl: './managepatients.component.html',
  styleUrls: ['./managepatients.component.css']
})
export class ManagepatientsComponent {
  // Define displayed columns for the table
  displayedColumns = ['serialNumber', 'image', 'firstName', 'lastName', 'gender', 'dateofBirth', 'email', 'phone', 'address', 'city', 'patientID', 'Actions'];

  // Initialize dataSource for MatTable
  dataSource!: MatTableDataSource<any>;

  // ViewChild for pagination and sorting
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('closeModalBtn') CloseButton: any;

  // Pagination variables
  pageSizes = [5, 10, 20, 30, 50, 100];
  currentpageIndex = 1;
  currentpageSize = 5;
  filterValue: string = '';
  sortColumnName!: string;
  sortOrder!: string;

  // Global variables
  globalobj: any;
  savedImage: any;
  onEditButton: boolean = false;

  // Form variables
  errorMessage: any;
  formData: any;
  data: any;
  dataList: any;
  totalData: any;
  categoryList: any;
  countries:any;
  states:any;
  cities:any;
  loadingData: boolean = true;


  // Define patientForm FormGroup
  patientForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
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
  });
  constructor(private adminservice: AdminservicesService, private notification: NotificationService,private commonservice: CommonapisService,private ngxLoader: NgxUiLoaderService) { }

  // Method to fetch All patients List
  getAllPatientsList() {
    this.ngxLoader.start();
    this.adminservice.DisplayPatients(this.currentpageIndex, this.currentpageSize, this.filterValue, this.sortColumnName, this.sortOrder).subscribe({
      next: (res: any) => {
        this.totalData = res.totalResultedRecords;
        this.dataList = res.data;
        this.dataSource = new MatTableDataSource(this.dataList);
        this.ngxLoader.stop();
        this.CloseButton.nativeElement.click();
        this.loadingData = false;
      },
      error: (error: any) => {
        this.notification.error(error.message);
        this.ngxLoader.stop();
      }
    });
  }

  // Fetch getAllPatientsList' on component initialization
  ngOnInit(): void {
    this.getAllPatientsList();
    this.countries=this.commonservice.getCountries();
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

  // DisplayCategories() {
  //   return this.adminservice.DisplayCategories().subscribe({
  //     next: (res: any) => {
  //       this.categoryList = res.data;
  //     },
  //     error: (error: any) => {
  //       this.notification.error(error.message);
  //     }
  //   });
  // }


  //Handle Pagination on Patient List
  handlePagination(event: any) {
    this.currentpageIndex = event.pageIndex + 1;
    this.currentpageSize = event.pageSize;
    this.getAllPatientsList();
  }

  //For Adding New Patient
  addNewPatient(data: any) {
    this.adminservice.AddPatient(data).subscribe({
      next: (res: any) => {
        this.notification.showSuccessNotification(res.message);
        setTimeout(() => {
          this.getAllPatientsList();
          this.CloseButton.nativeElement.click();
        }, 2000);
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }

  //Update the Specific Patient Details
  updatePatientDetails(id: any, data: any) {
    this.adminservice.updatePatient(id, data).subscribe({
      next: (res: any) => {
        this.notification.showSuccessNotification(res.message);
        setTimeout(() => {
          this.getAllPatientsList();
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

  //Submitting/Updating the Patient Form
  PatientFormSubmission(): void {
    if (this.patientForm.valid) {
      if (this.savedImage != null)
        this.patientForm.value['imageFile'] = this.savedImage;
      if (!this.onEditButton) {
        this.formData = this.dataForm();
        this.addNewPatient(this.formData);
      } else {
        this.patientForm.value['doctorID'] = this.globalobj.patientID;
        this.formData = this.dataForm();
        this.updatePatientDetails(this.globalobj.patientID, this.formData);
      }
    } else {
      this.markFormFieldsAsTouched();
    }
  }

//Marking the Required fields of Form
  markFormFieldsAsTouched() {
    Object.keys(this.patientForm.controls).forEach(controlName => {
      this.patientForm.get(controlName)?.markAsTouched();
    });
  }

 //Deleting the Patient Profile
  deletePatient(id: any) {
    this.adminservice.DeletePatient(id).subscribe({
      next: (res: any) => {
        this.notification.showSuccessNotification(res.message);
        setTimeout(() => {
          this.getAllPatientsList();
        }, 2000);
      },
      error: (error: any) => {
        this.notification.error(error.message);
      }
    });
  }

//For Passing the Details to Api as Objects and Keys
  dataForm() {
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
 // Updating the Patient Profile
  updatePatient(data: any) {
    this.onEditButton = true;
    this.globalobj = data;
    const dateOfBirth = data.dateofBirth.slice(0, 10);
    this.patientForm.patchValue(data);
    this.patientRegion();
  }

  patientRegion(){
    this.states=this.commonservice.getStatesByCountry(this.patientForm.get('country').value);
    this.cities=this.commonservice.getCitiesByState(this.patientForm.get('country').value,this.patientForm.get('state').value);
  }

//openPatientFormModal as a Popup
  openPatientFormModal() {
    if (!this.onEditButton) {
      this.patientForm.reset();
    }
  }

//ClosePatientFormModal as a Popup
  ClosePatientFormModal() {
    this.onEditButton = false;
  }

  //For Sorting the PtientList
  sortData(event: any) {
    this.sortColumnName = event.active;
    this.sortOrder = event.direction;
    this.getAllPatientsList();
  }

//For Image Selection on Updation and Submission
  onFileSelected(event: any) {
    this.savedImage = event.target.files[0];
  }

  //For Filtering the Patient List
  filterPatientsList(filterValue: any) {
    this.filterValue = filterValue.target.value;
    this.getAllPatientsList();
  }

}
