import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from '@fusers/ui/header';


@Component({
  imports: [RouterModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
