import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app/AppComponent';
import { LoginComponent } from './app/start/login/LoginComponent';
import { NotFoundComponent } from './app/start/not-found/NotFoundComponent';
import { LibraryComponent } from './app/library/LibraryComponent';
import { PublishingHousesComponent } from './app/library/publishing-houses/PublishingHousesComponent';
import { AuthorsComponent } from './app/library/authors/AuthorsComponent';
import { BooksComponent } from './app/library/books/BooksComponent';


const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'library',
    component: LibraryComponent,
    children: [
      { path: '', redirectTo: 'publishingHouses', pathMatch: 'full' },
      { path: 'publishingHouses', component: PublishingHousesComponent },
      { path: 'authors', component: AuthorsComponent },
      { path: 'books', component: BooksComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
