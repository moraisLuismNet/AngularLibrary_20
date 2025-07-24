import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthGuardService } from '../guards/AuthGuardService';
import { environment } from 'src/environments/Environment';
import { IAuthor, IPublishingHouse, IBook } from './LibraryInterface';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  urlAPI = environment.urlAPI;
  constructor(private http: HttpClient, private authGuard: AuthGuardService) {}

  getPublishingHouses(): Observable<IPublishingHouse[]> {
    const headers = this.getHeaders();
    return this.http.get<IPublishingHouse[]>(`${this.urlAPI}publishingHouses/withTotalBooks`, {
      headers,
    });
  }

  addPublishingHouse(publishingHouse: IPublishingHouse): Observable<IPublishingHouse> {
    const headers = this.getHeaders();
    return this.http.post<IPublishingHouse>(`${this.urlAPI}publishingHouses`, publishingHouse, {
      headers,
    });
  }

  updatePublishingHouse(PublishingHouse: IPublishingHouse): Observable<IPublishingHouse> {
    const headers = this.getHeaders();
    return this.http.put<IPublishingHouse>(
      `${this.urlAPI}publishingHouses/${PublishingHouse.idPublishingHouse}`,
      PublishingHouse,
      {
        headers,
      }
    );
  }

  deletePublishingHouse(id: number): Observable<IPublishingHouse> {
    const headers = this.getHeaders();
    return this.http.delete<IPublishingHouse>(`${this.urlAPI}publishingHouses/${id}`, {
      headers,
    });
  }

  getAuthors(): Observable<IAuthor[]> {
    const headers = this.getHeaders();
    return this.http.get<IAuthor[]>(`${this.urlAPI}authors/withTotalBooks`, {
      headers,
    });
  }

  addAuthor(author: IAuthor): Observable<IAuthor> {
    const headers = this.getHeaders();
    return this.http.post<IAuthor>(`${this.urlAPI}authors`, author, {
      headers,
    });
  }

  updateAuthor(Author: IAuthor): Observable<IAuthor> {
    const headers = this.getHeaders();
    return this.http.put<IAuthor>(
      `${this.urlAPI}authors/${Author.idAuthor}`,
      Author,
      {
        headers,
      }
    );
  }

  deleteAuthor(id: number): Observable<IAuthor> {
    const headers = this.getHeaders();
    return this.http.delete<IAuthor>(`${this.urlAPI}authors/${id}`, {
      headers,
    });
  }

  getBooks(): Observable<IBook[]> {
    const headers = this.getHeaders();
    return this.http.get<IBook[]>(`${this.urlAPI}books`, { headers });
  }

  addBook(book: IBook): Observable<IBook> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('pages', book.pages.toString());
    formData.append('price', book.price.toString());
    formData.append('authorId', book.authorId?.toString()!);
    formData.append('publishingHouseId', book.publishingHouseId?.toString()!);
    formData.append('discontinued', book.discontinued ? 'true' : 'false');
    formData.append('photo', book.photo!);

    return this.http.post<IBook>(`${this.urlAPI}books`, formData, {
      headers,
    });
  }

  deleteBook(id: number): Observable<IBook> {
    const headers = this.getHeaders();
    return this.http.delete<IBook>(`${this.urlAPI}books/${id}`, {
      headers,
    });
  }

  updateBook(book: IBook): Observable<IBook> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('idBook', book.isbn.toString());
    formData.append('title', book.title);
    formData.append('pages', book.pages.toString());
    formData.append('price', book.price.toString());
    formData.append('authorId', book.authorId?.toString()!);
    formData.append('publishingHouseId', book.publishingHouseId?.toString()!);
    formData.append('discontinued', book.discontinued ? 'true' : 'false');
    if (book.photo) {
      formData.append('photo', book.photo);
    }

    return this.http.put<IBook>(`${this.urlAPI}books/${book.isbn}`, formData, { headers: this.getHeaders() });
  }

  getHeaders(): HttpHeaders {
    const token = this.authGuard.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return headers;
  }
}
