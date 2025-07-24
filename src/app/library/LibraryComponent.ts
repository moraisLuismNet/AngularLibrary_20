import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/NavbarComponent';

@Component({
    selector: 'app-library',
    templateUrl: './LibraryComponent.html',
    styles: [],
    standalone: true,
    imports: [RouterOutlet, NavbarComponent]
})
export class LibraryComponent {}
