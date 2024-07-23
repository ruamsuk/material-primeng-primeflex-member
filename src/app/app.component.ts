import { Component, inject, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  auth: AuthService = inject(AuthService);

  ngOnInit() {
    /**  user is logged in or not */
    this.auth.user$.subscribe((user: any) => {
      if (user) {
        this.auth.currentUserSig.set({
          email: user.email,
          displayName: user.displayName, password: ''
        });
      } else {
        this.auth.currentUserSig.set(null);
      }
      // console.log(this.auth.currentUserSig());
    });
  }
}
