import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './User-Module/homepage/homepage.component';
import { LoginComponent } from './auth/login/login.component';
import { BookDoctorComponent } from './User-Module/homepage/book-doctor/book-doctor.component';
import { DashboardComponent } from './Admin-Module/dashboard/dashboard.component';
import { ManagedoctorsComponent } from './Admin-Module/dashboard/managedoctors/managedoctors.component';
import { ManagepatientsComponent } from './Admin-Module/dashboard/managepatients/managepatients.component';
import { ManageappointmentsComponent } from './Admin-Module/dashboard/manageappointments/manageappointments.component';
import { AuthGuard } from './services/authguard.guard';
import { PatientDashboardComponent } from './User-Module/patient-dashboard/patient-dashboard.component';
import { PatientAppointmentsComponent } from './User-Module/homepage/patient-appointments/patient-appointments.component';
import { DoctorDashboardComponent } from './User-Module/homepage/doctor-dashboard/doctor-dashboard.component';
import { BookAppointmentsComponent } from './User-Module/homepage/book-appointments/book-appointments.component';
//import { VisualDashboardComponent } from './User-Module/homepage/doctor-dashboard/visual-dashboard/VisualDashboardComponent';
import { DoctorAppointmentsComponent } from './User-Module/homepage/doctor-dashboard/doctor-appointments/doctor-appointments.component';
import { VisualDashboardComponent } from './User-Module/homepage/doctor-dashboard/visual-dashboard/visual-dashboard.component';

const routes: Routes = [
  {path: "home", component: HomepageComponent},
  {path:"book/:id",component:BookDoctorComponent},
  { path: "", pathMatch: "full", redirectTo: "/home" },
  { path: "login", component: LoginComponent },
  {path:"patient-appointments",component:PatientAppointmentsComponent},
  {
    path:'doctor-dashboard/:id',
    component:DoctorDashboardComponent,
    children:[
      {path: "", pathMatch: "full", redirectTo: "dashboard" },
      { path: "dashboard", component: VisualDashboardComponent},
      { path: "appointments", component: DoctorAppointmentsComponent},
    ],
    canActivate: [AuthGuard]
  },

  {path:'book-appointment',component:BookAppointmentsComponent},
  {
    path:'patient/:id',
    component:PatientDashboardComponent,
    children:[
      {path: "", pathMatch: "full", redirectTo: "patient-appointments" },
    ]
  },
  {
    path: "admin",
    component: DashboardComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "manage-doctors" },
      { path: "dashboard", component: DashboardComponent, },
      { path: "manage-doctors", component: ManagedoctorsComponent },
      { path: "manage-patients", component: ManagepatientsComponent },
      { path: "manage-appointments", component: ManageappointmentsComponent },
    ],
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "/home" },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { HomepageComponent } from './User-Module/homepage/homepage.component';
// import { LoginComponent } from './auth/login/login.component';
// import { BookDoctorComponent } from './User-Module/homepage/book-doctor/book-doctor.component';
// import { DashboardComponent } from './Admin-Module/dashboard/dashboard.component';
// import { ManagedoctorsComponent } from './Admin-Module/dashboard/managedoctors/managedoctors.component';
// import { ManagepatientsComponent } from './Admin-Module/dashboard/managepatients/managepatients.component';
// import { ManageappointmentsComponent } from './Admin-Module/dashboard/manageappointments/manageappointments.component';
// import { AuthGuard } from './services/authguard.guard';
// import { PatientDashboardComponent } from './User-Module/patient-dashboard/patient-dashboard.component';
// import { PatientAppointmentsComponent } from './User-Module/homepage/patient-appointments/patient-appointments.component';
// import { DoctorDashboardComponent } from './User-Module/homepage/doctor-dashboard/doctor-dashboard.component';
// import { BookAppointmentsComponent } from './User-Module/homepage/book-appointments/book-appointments.component';

// const routes: Routes = [
//   {path: "home", component: HomepageComponent},
//   {path:"book/:id",component:BookDoctorComponent},
//   { path: "", pathMatch: "full", redirectTo: "/home" },
//   { path: "login", component: LoginComponent },
//   {path:"patient-appointments",component:PatientAppointmentsComponent},
//   {path:'doctor-dashboard/:id',component:DoctorDashboardComponent},
//   {path:'book-appointment',component:BookAppointmentsComponent},
//   {
//     path:'patient/:id',
//     component:PatientDashboardComponent,
//     children:[
//       {path: "", pathMatch: "full", redirectTo: "patient-appointments" },
//     ]
//   },
//   {
//     path: "admin",
//     component: DashboardComponent,
//     children: [
//       { path: "", pathMatch: "full", redirectTo: "manage-doctors" },
//       { path: "dashboard", component: DashboardComponent, },
//       { path: "manage-doctors", component: ManagedoctorsComponent },
//       { path: "manage-patients", component: ManagepatientsComponent },
//       { path: "manage-appointments", component: ManageappointmentsComponent },
//     ],
//     canActivate: [AuthGuard]
//   },
//   { path: "**", redirectTo: "/home" },
// ];


// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
