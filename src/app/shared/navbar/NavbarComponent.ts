import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthGuardService } from 'src/app/guards/AuthGuardService';

@Component({
    selector: 'app-navbar',
    templateUrl: './NavbarComponent.html',
    styleUrls: ['./NavbarComponent.css'],
    standalone: true,
    imports: [RouterLink]
})
export class NavbarComponent {
  private authGuard = inject(AuthGuardService);
  private router = inject(Router);
  userName = '';

  ngOnInit(): void {
    this.userName = this.authGuard.getUser();
  }

  closeSession() {
    sessionStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}
