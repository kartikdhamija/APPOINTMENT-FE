import { Component, ElementRef, Input, OnInit,ViewChild, OnDestroy } from '@angular/core';
import { ModalPopupService } from 'src/app/services/modal-popup.service';

@Component({
  selector: 'app-view-profile-modal',
  templateUrl: './view-profile-modal.component.html',
  styleUrls: ['./view-profile-modal.component.css']
})
export class ViewProfileModalComponent {
  @ViewChild('closeModalBtn') CloseButton: any;
  @Input() DoctorDetails: any;
  @ViewChild('basicModal') basicModal: ElementRef;

  getImageUrl(base64Image: string): string {
    const imageURL = `data:image/jpeg;base64,${base64Image}`;
    return imageURL;
  }

  formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    const formattedHour = parseInt(hour) > 12 ? parseInt(hour) - 12 : hour;
    const period = parseInt(hour) >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  }

  closePopup() {
    this.CloseButton.nativeElement.click();
  }
}
