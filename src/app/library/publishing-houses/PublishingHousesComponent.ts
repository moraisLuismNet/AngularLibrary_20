import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { LibraryService } from '../LibraryService';
import { NgForm, FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { IPublishingHouse } from '../LibraryInterface';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-publishing-houses',
    templateUrl: './PublishingHousesComponent.html',
    styleUrls: ['./PublishingHousesComponent.css'],
    providers: [ConfirmationService],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ConfirmDialogModule,
        InputTextModule,
        ButtonModule,
        TableModule,
        DialogModule,
    ]
})
export class PublishingHousesComponent implements OnInit {
  private libraryService = inject(LibraryService);
  private confirmationService = inject(ConfirmationService);
  @ViewChild('form') form!: NgForm;
  visibleError = false;
  errorMessage = '';
  publishingHouses: IPublishingHouse[] = [];
  visibleConfirm = false;
  showCustomConfirm = false;
  customConfirmMessage = '';
  private publishingHouseToDelete: IPublishingHouse | null = null;

  publishingHouse: IPublishingHouse = {
    idPublishingHouse: 0,
    namePublishingHouse: '',
  };

  ngOnInit(): void {
    this.getPublishingHouses();
  }

  getPublishingHouses() {
    this.libraryService.getPublishingHouses().subscribe({
      next: (data) => {
        this.visibleError = false;
        this.publishingHouses = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  save() {
    if (this.publishingHouse.idPublishingHouse === 0) {
      this.libraryService.addPublishingHouse(this.publishingHouse).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.form.reset();
          this.getPublishingHouses();
        },
        error: (err) => {
          console.log(err);
          this.visibleError = true;
          this.controlError(err);
        },
      });
    } else {
      this.libraryService
        .updatePublishingHouse(this.publishingHouse)
        .subscribe({
          next: (data) => {
            this.visibleError = false;
            this.cancelEdition();
            this.form.reset();
            this.getPublishingHouses();
          },
          error: (err) => {
            this.visibleError = true;
            this.controlError(err);
          },
        });
    }
  }

  edit(publishingHouse: IPublishingHouse) {
    this.publishingHouse = { ...publishingHouse };
  }

  cancelEdition() {
    this.publishingHouse = {
      idPublishingHouse: 0,
      namePublishingHouse: '',
    };
  }

  confirmDelete(publishingHouse: IPublishingHouse) {
    this.customConfirmMessage = `Delete the publishing house "${publishingHouse.namePublishingHouse}"?`;
    this.publishingHouseToDelete = publishingHouse;
    this.showCustomConfirm = true;
  }

  onCustomConfirmAccept() {
    if (this.publishingHouseToDelete) {
      this.deletePublishingHouse(
        this.publishingHouseToDelete.idPublishingHouse!
      );
      this.publishingHouseToDelete = null;
    }
    this.showCustomConfirm = false;
  }

  deletePublishingHouse(id: number) {
    this.libraryService.deletePublishingHouse(id).subscribe({
      next: (data) => {
        this.visibleError = false;
        this.form.reset({
          name: '',
        });
        this.getPublishingHouses();
      },
      error: (err) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  controlError(err: any) {
    if (err.error && typeof err.error === 'object' && err.error.message) {
      this.errorMessage = err.error.message;
    } else if (typeof err.error === 'string') {
      // If `err.error` is a string, it is assumed to be the error message
      this.errorMessage = err.error;
    } else {
      // Handles the case where no useful error message is received
      this.errorMessage = 'An unexpected error has occurred';
    }
  }
}
