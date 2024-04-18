import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './User-Module/header/header.component';
import { FooterComponent } from './User-Module/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './Admin-Module/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ManagedoctorsComponent } from './Admin-Module/dashboard/managedoctors/managedoctors.component';
import { ManagepatientsComponent } from './Admin-Module/dashboard/managepatients/managepatients.component';
import { ManageappointmentsComponent } from './Admin-Module/dashboard/manageappointments/manageappointments.component';
import { HomepageComponent } from './User-Module/homepage/homepage.component';
import { HttpClientModule,HTTP_INTERCEPTORS  } from '@angular/common/http';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BookDoctorComponent } from './User-Module/homepage/book-doctor/book-doctor.component';
import { CapitalizePipe } from './shared/pipes/capitalize.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule
} from 'ngx-ui-loader';
import { PatientDashboardComponent } from './User-Module/patient-dashboard/patient-dashboard.component';
import { PatientAppointmentsComponent } from './User-Module/homepage/patient-appointments/patient-appointments.component';
import { DoctorDashboardComponent } from './User-Module/homepage/doctor-dashboard/doctor-dashboard.component';
import { DoctorsProfileComponent } from './shared/components/doctors-profile/doctors-profile.component';
import { BookAppointmentsComponent } from './User-Module/homepage/book-appointments/book-appointments.component';
import { ViewProfileModalComponent } from './shared/components/view-profile-modal/view-profile-modal.component';
import { NoRecordsComponent } from './shared/components/no-records/no-records.component';
import { AuthInterceptor } from './services/auth.interceptor';
//import { VisualDashboardComponent } from './User-Module/homepage/doctor-dashboard/visual-dashboard/VisualDashboardComponent';
import { DoctorAppointmentsComponent } from './User-Module/homepage/doctor-dashboard/doctor-appointments/doctor-appointments.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "red",
  "bgsOpacity": 0.1,
  "bgsPosition": "bottom-right",
  "bgsSize": 20,
  "bgsType": "ball-spin-clockwise",
  "blur": 5,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#396cf0",
  "fgsPosition": "center-center",
  "fgsSize": 40,
  "fgsType": "ball-spin-clockwise",
  "gap": 10,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.8)",
  "pbColor": "red",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": false,
  "text": "",
  "textColor": "#FFFFFF",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 400
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    LoginComponent,
    DashboardComponent,
    ManagedoctorsComponent,
    ManagepatientsComponent,
    ManageappointmentsComponent,
    BookDoctorComponent,
    CapitalizePipe,
    PatientDashboardComponent,
    PatientAppointmentsComponent,
    DoctorDashboardComponent,
    DoctorsProfileComponent,
    BookAppointmentsComponent,
    ViewProfileModalComponent,
    NoRecordsComponent,
    DoctorAppointmentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    HttpClientModule,
    MatCheckboxModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

