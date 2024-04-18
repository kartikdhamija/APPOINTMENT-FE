import { Component, ViewChild } from '@angular/core';
import { reviews, departments, doctors } from '../../../data'; // Importing data
import { CommonapisService } from 'src/app/services/commonapis.service'; // Importing CommonapisService
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Observable, map, startWith } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
// Declaring global variables
declare var easy_background: any;
declare var tns: any;

declare var Tobii: any;
declare var feather: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  @ViewChild('closeModalBtn') CloseButton: any;

  reviews = reviews; // Initializing reviews
  departments = departments; // Initializing departments
  doctors: any; // Initializing doctors
  DoctorDetails: any = false;
  filteredDoctors: any;
  control = new FormControl('');
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  SearchForm = new FormGroup({
    nameControl: new FormControl('')
  });

  constructor(private route: Router, private ngxLoader: NgxUiLoaderService, public commonservice: CommonapisService) {
    this.SearchForm.get('nameControl')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
    ).subscribe((value?: any) => {
      this.commonservice.getDoctorBasedOnSearch(value).subscribe({
        next: (res: any) => {
          this.filteredDoctors = res.data;
        },
        error: (error: any) => {
          // console.error('Error fetching doctors:', error);
          this.filteredDoctors = [];
        }
      });
    });
  }

  ngOnInit() {
    this.createBackToTopButton(); // Call method to create back-to-top button
    this.displayHomePageDoctorsList(); // Call method to display list of doctors on homepage
  }


  // Method to display list of doctors on homepage
  displayHomePageDoctorsList() {
    this.commonservice.DisplayDoctors(1, 4).subscribe({
      next: (res: any) => {
        this.doctors = res.data;
      }
    });
  }

  // Lifecycle hook called after Angular initializes the component's views
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

    // Initialize slider using tns library
    var slider = tns({
      container: ".client-review-slider",
      items: 1,
      controls: false,
      mouseDrag: true,
      loop: true,
      rewind: true,
      autoplay: true,
      autoplayButtonOutput: false,
      autoplayTimeout: 3000,
      navPosition: "bottom",
      speed: 400,
      gutter: 16,
    });

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
  }

  // Method to create back-to-top button
  createBackToTopButton() {
    var backButton = document.createElement("a");
    backButton.href = "#";
    backButton.id = "back-to-top";
    backButton.className = "back-to-top fs-5 rounded-pill text-center bg-primary justify-content-center align-items-center";

    var icon = document.createElement("i");
    icon.setAttribute("data-feather", "arrow-up");
    icon.className = "fea icon-sm";

    backButton.appendChild(icon);

    document.body.appendChild(backButton);

    // Detect scrolling to toggle display of back-to-top button
    window.onscroll = function () {
      scrollFunction();
    };

    function scrollFunction() {
      if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        backButton.style.display = "block";
      } else {
        backButton.style.display = "none";
      }
    }

    // Scroll to top when back-to-top button is clicked
    backButton.onclick = function (event) {
      event.preventDefault(); // Prevent default anchor behavior
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
  }



  // Fetch doctor's profile by ID
  GetDoctorProfile(id: any) {
    this.ngxLoader.start();
    this.commonservice.DoctorProfile(id).subscribe({
      next: (res: any) => {
        this.DoctorDetails = res.data[0];
        console.log(this.DoctorDetails);
        this.ngxLoader.stop();
      }
    });
  }

  formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    const formattedHour = parseInt(hour) > 12 ? parseInt(hour) - 12 : hour;
    const period = parseInt(hour) >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  }

  getImageUrl(base64Image: string): string {
    const imageURL = `data:image/jpeg;base64,${base64Image}`;
    return imageURL;
  }

  closePopup() {
    this.CloseButton.nativeElement.click();
  }
}
