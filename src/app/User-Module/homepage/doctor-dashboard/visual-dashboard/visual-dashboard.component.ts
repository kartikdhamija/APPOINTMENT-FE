import { Component, ElementRef, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { DoctorServicesService } from 'src/app/services/doctor-services.service';
import { SharedService } from 'src/app/shared/shared.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-visual-dashboard',
  templateUrl: './visual-dashboard.component.html',
  styleUrls: ['./visual-dashboard.component.css']
})
export class VisualDashboardComponent {
  Stats: any;
  chart: Chart;
  loginId: any;
  doctorID: string;

  constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private sharedService: SharedService, private doctorService: DoctorServicesService) { }
  @ViewChild('chartCanvas') chartCanvas: ElementRef<HTMLCanvasElement>;
  async ngOnInit() {
    await this.GetDoctorId();
  }

  async GetDoctorId() {
    this.doctorID = this.sharedService.getId();
    try {
      const res: any = await this.doctorService.getDoctorStatsByDoctorId(this.doctorID).toPromise();
      this.Stats = res.data;
      this.barChart();
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
      // Handle error if needed
    }
  }

  displayAppointments() {
    this.router.navigate(['../appointments'], { relativeTo: this.route });
  }


  barChart() {
    // this.Stats= this.sharedService.doctorProfile;
    const canvas = this.chartCanvas.nativeElement;
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ["Scheduled", "Cancelled", "Completed"], // Use short labels for better readability
        datasets: [{
          label: "",
          data: [
            this.Stats?.currentlyScheduledAppointments,
            this.Stats?.totalCancelledAppointments,
            this.Stats?.totalCompletedAppointments
          ],
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 206, 86, 0.2)"
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)"
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              boxWidth: 0
            }
          }
        },
        layout: {
          padding: {
            top: 10 // Adjust the top padding as needed
          }
        },
        scales: {
          x: {
            // grid: {
            //   display: false // Hide x-axis gridlines
            // }
          },
          y: {
            beginAtZero: true,
            ticks: {
              // forces step size to be 50 units
              stepSize: 1
            }
            // grid: {
            //   display: false // Hide y-axis gridlines
            // }
          }
        }
      }
    });
    // this.cdr.detectChanges();
  }
}













// Check if Stats is null and log an error message for debugging
// if (!this.Stats) {
//   console.error('Stats data is null in VisualDashboardComponent. Is it passed correctly from the parent component?');
//   return; // Prevent further execution if Stats is null
// }

// // Access Stats.stats only if it's not null
// const appointmentStats = this.Stats?.stats;
// if (!appointmentStats) {
//   console.error('Stats.stats is null. Check the structure of your data or if it has been loaded yet.');
//   return; // Return if appointmentStats is null
// }

// Proceed with chart creation using appointmentStats
