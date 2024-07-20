import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, HomeComponent],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'material-primeng-plimeflex-member';
  public auth: AuthService = inject(AuthService);
}
