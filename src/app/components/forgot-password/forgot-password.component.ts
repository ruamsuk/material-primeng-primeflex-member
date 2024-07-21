import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImportsModule } from '../../imposts';
import { MatError, MatInputModule } from '@angular/material/input';

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
  styles: ``
})
export class ForgotPasswordComponent {
  authService = inject(AuthService); //inject(AngularFireAuth);
  router = inject(Router);
  ref = inject(DynamicDialogRef);

  resetPassword(email: string) {
    const auth = firebase.auth();
    auth.sendPasswordResetEmail(email)
      .then((response) => {
        this.authService.showSuccess('ส่งอีเมล์สำหรับพลาสเวิร์ดใหม่แล้ว');
        this.router.navigateByUrl('/auth/login');
        this.ref.close();
      }).catch((error) => {
        this.authService.showError(`${error}`);
    })
      .finally();
  }

  hide() {
    this.ref.close();
  }

}
