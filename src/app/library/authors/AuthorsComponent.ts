import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { LibraryService } from '../LibraryService';
import { NgForm, FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { IAuthor } from '../LibraryInterface';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-authors',
    templateUrl: './AuthorsComponent.html',
    styleUrls: ['./AuthorsComponent.css'],
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
export class AuthorsComponent implements OnInit {
  private libraryService = inject(LibraryService);
  private confirmationService = inject(ConfirmationService);
  @ViewChild('form') form!: NgForm;
  visibleError = false;
  errorMessage = '';
  authors: IAuthor[] = [];
  visibleConfirm = false;
  showCustomConfirm = false;
  customConfirmMessage = '';
  private authorToDelete: IAuthor | null = null;

  author: IAuthor = {
    idAuthor: 0,
    nameAuthor: '',
  };

  ngOnInit(): void {
    this.getAuthors();
  }

  getAuthors() {
    this.libraryService.getAuthors().subscribe({
      next: (data) => {
        this.visibleError = false;
        this.authors = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  save() {
    if (this.author.idAuthor === 0) {
      this.libraryService.addAuthor(this.author).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.form.reset();
          this.getAuthors();
        },
        error: (err) => {
          console.log(err);
          this.visibleError = true;
          this.controlError(err);
        },
      });
    } else {
      this.libraryService.updateAuthor(this.author).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.cancelEdition();
          this.form.reset();
          this.getAuthors();
        },
        error: (err) => {
          this.visibleError = true;
          this.controlError(err);
        },
      });
    }
  }

  edit(author: IAuthor) {
    this.author = { ...author };
  }

  cancelEdition() {
    this.author = {
      idAuthor: 0,
      nameAuthor: '',
    };
  }

  confirmDelete(author: IAuthor) {
    this.customConfirmMessage = `Delete the author "${author.nameAuthor}"?`;
    this.authorToDelete = author;
    this.showCustomConfirm = true;
  }

  onCustomConfirmAccept() {
    if (this.authorToDelete) {
      this.deleteAuthor(this.authorToDelete.idAuthor!);
      this.authorToDelete = null;
    }
    this.showCustomConfirm = false;
  }
  deleteAuthor(id: number) {
    this.libraryService.deleteAuthor(id).subscribe({
      next: (data) => {
        this.visibleError = false;
        this.form.reset({
          name: '',
        });
        this.getAuthors();
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
