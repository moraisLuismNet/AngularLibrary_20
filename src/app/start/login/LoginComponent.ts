import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppService } from 'src/app/services/AppService';
import { AuthGuardService } from 'src/app/guards/AuthGuardService';
import { ILogin } from 'src/app/library/interfaces/LoginInterfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './LoginComponent.html',
    styleUrls: ['./LoginComponent.css'],
    providers: [MessageService],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        ToastModule,
        NgOptimizedImage
    ]
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private appService = inject(AppService);
  private messageService = inject(MessageService);
  private authGuard = inject(AuthGuardService);

  infoLogin: ILogin = {
    email: '',
    password: '',
  };

  ngOnInit() {
    if (this.authGuard.isLoggedIn()) {
      this.router.navigateByUrl('library/publishingHouses');
    }
  }

  login() {
    this.appService.login(this.infoLogin).subscribe({
      next: (data) => {
        sessionStorage.setItem('user', JSON.stringify(data));
        this.router.navigateByUrl('library/publishingHouses');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Wrong credentials',
        });
      },
    });
  }
}
