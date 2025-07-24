import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginResponse } from '../library/interfaces/LoginInterfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private router: Router) {}

  isLoggedIn() {
    const user = sessionStorage.getItem('user');
    if (user) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

  getUser(): string {
    const infoUser = sessionStorage.getItem('user');
    if (infoUser) {
      const userInfo: ILoginResponse = JSON.parse(infoUser);
      return userInfo.email;
    }
    return '';
  }

  getToken(): string {
    const infoUser = sessionStorage.getItem('user');
    if (infoUser) {
      const userInfo: ILoginResponse = JSON.parse(infoUser);
      return userInfo.token;
    }
    return '';
  }
}
