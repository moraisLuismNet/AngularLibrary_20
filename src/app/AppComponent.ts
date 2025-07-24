import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './AppComponent.html',
    styleUrls: ['./AppComponent.css'],
    standalone: true,
    imports: [RouterModule]
})
export class AppComponent {
  title = 'AngularLibrary';
}

