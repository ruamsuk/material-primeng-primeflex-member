import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService, Credential } from '../../services/auth.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Router, RouterLink } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { NgIf } from '@angular/common';

interface LogInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    Button,
    ToastModule,
    RouterLink,
    PasswordModule,
    NgIf
  ],
  template: `
    <p-toast/>
    <div class="flex justify-content-center align-items-center h-full">
      <form [formGroup]="form" (ngSubmit)="login()">
        <p-card header="Log in" [style]="{width: '360px'}">
          <ng-template pTemplate="p-card-content">
            <div class="field">
              <label>Email</label>
              <input
                type="email"
                pInputText
                formControlName="email"
                class="w-full"
                name="email">
              <small
                class="block p-error pl-2 font-semibold"
                *ngIf="isEmailValid as message">
                {{ message }}
              </small>
            </div>
            <div class="field">
              <label>Password</label>
              <p-password class="w-full {{isValidPassword ? 'ng-invalid ng-dirty' : ''}}"
                          [feedback]="false" formControlName="password"
                          styleClass="p-password p-component p-inputwrapper p-input-icon-right"
                          [style]="{'width':'100%'}"
                          [inputStyle]="{'width':'100%'}"
                          [toggleMask]="true"/>
              <small class="block p-error pl-2 font-semibold"
                     *ngIf="isValidPassword as messages">
                {{ messages }}
              </small>
            </div>
          </ng-template>
          <ng-template pTemplate="footer">
            <div class="flex gap-3 mt-1">
              <p-button label="Login"
                        class="w-full"
                        styleClass="w-full"
                        [disabled]="form.invalid"
                        type="submit"
                        [loading]="loading"
              />
            </div>
            <div class="mt-2 ml-2">
              Not a member? <a routerLink="/auth/sign-up">
              <span class="text-blue-600>Register">Register</span>
            </a>
            </div>
          </ng-template>
        </p-card>
      </form>
    </div>
  `,
  styles: ``,
  // providers: [MessageService]
})
export class LogInComponent {
  loading: boolean = false;

  formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup<LogInForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  get isEmailValid(): string | boolean {
    const control = this.form.get('email');

    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('required')
        ? 'This field is required'
        : 'Enter a valid email';
    }

    return false;
  }

  get isValidPassword(): any {
    const control = this.form.get('password');
    const isInvalid = control?.invalid && control.touched;
    if (isInvalid) {
      return control.hasError('required')
        ? 'This field is required'
        : 'Enter a valid password';
    }
  }

  async login() {
    if (this.form.invalid) return;

    this.load(true);

    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };
    try {
      await this.authService.logInWithEmailAndPassword(credential);
      this.load(false);
      this.authService.showSuccess('Successfully logged in');
      setTimeout(() => {
        this.router.navigateByUrl('/') }, 1500);
    } catch (error) {
      this.authService.showError(`Unable to log in: ${error}`);
      this.load(false);
    }
  }


  load(style: boolean) {
    this.loading = style;
  }

}
