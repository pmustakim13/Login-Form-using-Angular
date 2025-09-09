import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <--- CORRECTED

bootstrapApplication(AppComponent, appConfig) // <--- CORRECTED
  .catch((err) => console.error(err));