import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/Environment';
import { ILogin, ILoginResponse } from '../library/interfaces/LoginInterfaces';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  urlAPI: string;

  constructor(private http: HttpClient) {
    this.urlAPI = environment.urlAPI;
  }

  login(credentials: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.urlAPI}auth/login`, credentials);
  }

}
