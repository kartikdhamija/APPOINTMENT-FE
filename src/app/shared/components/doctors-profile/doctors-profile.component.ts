import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AdminservicesService } from 'src/app/services/adminservices.service';
import { CommonapisService } from 'src/app/services/commonapis.service';

declare var easy_background: any;
declare var tns: any;

declare var Tobii: any;
declare var feather: any;

@Component({
  selector: 'app-doctors-profile',
  templateUrl: './doctors-profile.component.html',
  styleUrls: ['./doctors-profile.component.css']
})
export class DoctorsProfileComponent {

@Input() currentpageSize:any;
@ViewChild('classModal') classModal: ElementRef;

pageSizes = [5, 10, 20, 30, 50, 100];
currentpageIndex = 1;
filterValue: string = '';
sortColumnName!: string;
sortOrder!: string;
doctors:any;
DoctorDetails: any;
displayy: any;

  constructor(private adminService: AdminservicesService,public commonservice: CommonapisService,private ngxLoader: NgxUiLoaderService,){}

  // Lifecycle hook called after Angular initializes the component's views
  ngAfterViewInit(): void {
    // Create Tobii instance for image lightbox
    var tobiiInstance = new Tobii();

    // Replace Feather icons with actual SVG icons
    feather.replace();

    // Define topFunction to scroll to the top of the page
    function topFunction() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    // Call topFunction to scroll to the top of the page
    topFunction();
    if (this.classModal) {
      // Access nativeElement safely
      this.classModal.nativeElement.classList.add('show');
      document.body.classList.add('modal-open');
    }
  }

  ngOnInit(){
    this.displayHomePageDoctorsList();
  }

  getImageUrl(base64Image: string): string {
    const imageURL = `data:image/jpeg;base64,${base64Image}`;
    return imageURL;
  }

  GetDoctorProfile(id: any) {
    this.ngxLoader.start();
    this.commonservice.DoctorProfile(id).subscribe({
      next: (res: any) => {
        this.DoctorDetails = res.data[0];
        console.log(this.DoctorDetails);
        this.ngxLoader.stop();
      }
    });
    this.displayy = true;

  }

  displayHomePageDoctorsList() {
    this.commonservice.DisplayDoctors(1, this.currentpageSize).subscribe({
      next: (res: any) => {
        this.doctors = res.data;
      }
    });
  }
}
