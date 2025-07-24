import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { LibraryService } from '../LibraryService';
import { ConfirmationService } from 'primeng/api';
import { NgForm, FormsModule } from '@angular/forms';
import { IAuthor, IBook, IPublishingHouse } from '../LibraryInterface';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-books',
    templateUrl: './BooksComponent.html',
    styleUrls: ['./BooksComponent.css'],
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
export class BooksComponent implements OnInit {
  private libraryService = inject(LibraryService);
  private confirmationService = inject(ConfirmationService);

  @ViewChild('form') form!: NgForm;
  @ViewChild('fileInput') fileInput!: ElementRef;
  visibleError = false;
  errorMessage = '';
  books: IBook[] = [];
  authors: IAuthor[] = [];
  publishingHouses: IPublishingHouse[] = [];
  visibleConfirm = false;
  urlImage = '';
  visiblePhoto = false;
  photo = '';
  showCustomConfirm = false;
  customConfirmMessage = '';
  private bookToDelete: IBook | null = null;

  book: IBook = {
    isbn: 0,
    title: '',
    pages: 0,
    price: 0,
    photo: null,
    photoCover: null,
    discontinued: false,
    authorId: null,
    publishingHouseId: null,
  };
  ngOnInit(): void {
    this.getAuthors();
    this.getPublishinHouses();
    this.getBooks();
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

  getPublishinHouses() {
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

  getBooks() {
    this.libraryService.getBooks().subscribe({
      next: (data) => {
        this.visibleError = false;
        this.books = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  onChange(event: any) {
    const file = event.target.files;

    if (file && file.length > 0) {
      this.book.photo = file[0];
      this.book.photoName = file[0].name; // Save file name
    }
  }

  onAcept() {
    // After processing the selected file, delete its contents from the input
    this.fileInput.nativeElement.value = '';
  }

  showImage(book: IBook) {
    if (this.visiblePhoto && this.book === book) {
      // If the image is already visible and the same book was selected, hide the dialog
      this.visiblePhoto = false;
    } else {
      // If it is a new book or the dialog is hidden, show the image
      this.book = book;
      this.photo = book.photoCover!;
      this.visiblePhoto = true;
    }
  }
  save() {
    if (this.book.isbn === 0) {
      this.libraryService.addBook(this.book).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.form.reset();
          this.getBooks();
        },
        error: (err) => {
          console.log(err);
          this.visibleError = true;
          this.controlError(err);
        },
      });
    } else {
      this.libraryService.updateBook(this.book).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.cancelEdition();
          this.form.reset();
          this.getBooks();
        },
        error: (err) => {
          this.visibleError = true;
          this.controlError(err);
        },
      });
    }
  }

  confirmDelete(book: IBook) {
    this.customConfirmMessage = `Delete the book "${book.title}"?`;
    this.bookToDelete = book;
    this.showCustomConfirm = true;
  }

  onCustomConfirmAccept() {
    if (this.bookToDelete) {
      this.deleteBook(this.bookToDelete.isbn);
      this.bookToDelete = null;
    }
    this.showCustomConfirm = false;
  }

  deleteBook(id: number) {
    this.libraryService.deleteBook(id).subscribe({
      next: (data: IBook) => {
        this.visibleError = false;
        this.getBooks();
      },
      error: (err: any) => {
        this.visibleError = true;
        this.controlError(err);
      },
    });
  }

  edit(book: IBook) {
    const publishingHouseFind = this.publishingHouses.find(
      (c) => c.namePublishingHouse === book.namePublishingHouse
    );
    const authorFind = this.authors.find(
      (c) => c.nameAuthor === book.nameAuthor
    );
    this.book = { ...book };
    this.book.publishingHouseId =
      publishingHouseFind?.idPublishingHouse ?? null;
    this.book.authorId = authorFind?.idAuthor ?? null;
    this.book.photoName = book.photoCover
      ? this.extractNameImage(book.photoCover)
      : ''; // Extract name if it has image
  }

  extractNameImage(url: string): string {
    return url.split('/').pop() || ''; // Extract image name from URL
  }

  cancelEdition() {
    this.book = {
      isbn: 0,
      title: '',
      pages: 0,
      price: 0,
      discontinued: false,
      authorId: 0,
      publishingHouseId: 0,
      photo: null,
      photoCover: null,
    };
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
