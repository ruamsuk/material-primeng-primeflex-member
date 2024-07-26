import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImportsModule } from '../../imposts';
import { MatError, MatInputModule } from '@angular/material/input';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';

import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    JsonPipe,
    AsyncPipe,
    NgIf,
    ImportsModule,
    MatInputModule,
    MatError
  ],
  template: `
    <div class="card flex justify-content-center">
      <div class="flex align-items-center gap-3 mb-3">
        <input #emailReset
               pInputText
               id="email"
               class="flex-auto" placeholder="อีเมล์ที่ลงทะเบียนไว้"
               autocomplete="off"
        />
      </div>
    </div>
    <div class="flex justify-content-center">
      <p class="sarabun text-red-500">กรอกอีเมล์ที่ลงทะเบียนไว้ในระบบ</p>
    </div>
    <div class="flex justify-content-center w-full">
      <p-button class="mr-2"
                label="ยกเลิก" (click)="hide()"
                size="small" severity="secondary"/>
      <p-button
        label="ส่งอีเมล์" (click)="resetPassword(emailReset.value)"
        size="small" severity="info"/>
    </div>
  `,
  styles: ``,
  providers: [
    {
      provide: FIREBASE_OPTIONS, useValue: environment.firbaseConfig
    },
  ]
})
export class ForgotPasswordComponent {
  authService = inject(AuthService);
  router = inject(Router);
  ref = inject(DynamicDialogRef);

  async resetPassword(email: string) {

    await firebase.auth().sendPasswordResetEmail(email).then(() => {
      this.authService.showSuccess('ส่งอีเมล์สำหรับพาสเวิร์ดใหม่แล้ว');
      this.router.navigateByUrl('/auth/login').then();
      this.ref.close();
    }).catch((error) => {
      this.authService.showError(`${error.message}`);
    });
  }

  hide() {
    this.ref.close();
  }

}
