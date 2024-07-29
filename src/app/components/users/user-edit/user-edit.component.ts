import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MemberService } from '../../../services/member.service';
import { ImageUploadService } from '../../../services/image-upload.service';
import { concatMap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { UserProfile } from '../../../models/user-profile.model';
import { ImportsModule } from '../../../imposts';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { getStorage } from '@angular/fire/storage';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { getAuth } from '@angular/fire/auth';

@Component({
  imports: [
    AsyncPipe,
    NgIf,
    Button,
    ReactiveFormsModule,
    ImportsModule
  ],
  providers: [
    AngularFireStorageModule
  ],
  selector: 'app-user-edit',
  standalone: true,
  styles: `
    .profile-image > img {
      border-radius: 100%;
      object-fit: cover;
      object-position: center;
    }

    .profile-image {
      position: relative;
    }

    .profile-image > #in {
      position: absolute;
      bottom: 10px;
      left: 80%;
    }

    .container-form {
      max-width: 600px;
    }

    .row {
      display: flex;
      gap: 16px;
    }

    .field > label {
      color: #000000;
      margin-left: 5px;
    }

    .p-inputtext {
      font-family: 'Sarabun', sans-serif !important;
    }

  `,
  template: `
    <div *ngIf="user$ | async as user" class="">
      <div class="flex justify-content-center">
        <div class="profile-image">
          <img [src]="userPhoto" alt="profile photo" width="120" height="120">
          <p-button
            id="in"
            icon="pi pi-pencil"
            severity="success"
            [rounded]="true"
            [raised]="true"
            class="profile-image"
            (click)="inputField.click()"/>
        </div>
        <input #inputField
               type="file"
               hidden="hidden"
               (change)="uploadImage($event, user)">
      </div>

      <div class="card flex flex-wrap flex-column justify-content-center mt-3">

        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
          <div class="field">
            <label for="display">Display Name</label>
            <input class="w-full" type="text" pInputText id="display" formControlName="displayName">
          </div>
          <div class="field">
            <label for="first">First Name</label>
            <input class="w-full" type="text" pInputText id="first" formControlName="firstName">
          </div>
          <div class="field">
            <label for="last">Last Name</label>
            <input class="w-full" type="text" pInputText id="last" formControlName="lastName">
          </div>
          <div class="field">
            <label for="phone">Phone</label>
            <input class="w-full" type="text" pInputText id="phone" formControlName="phone">
          </div>
          <div class="field">
            <label for="address">Address</label>
            <input class="w-full" type="text" pInputText id="address" formControlName="address">
          </div>
          @if (!Email) {
            <div class="field">
              <p (click)="sendEmail()"
                 class="text-orange-500 font-semibold cursor-pointer">
                <i class="pi pi-check-circle"></i>
                Click here to verify your email.
              </p>
            </div>
          }
          <div class="field">
            <hr class="h-px bg-gray-200 border-0">
            <div class="flex mt-3">
              <p-button label="Cancel"
                        severity="secondary"
                        styleClass="w-full"
                        class="w-full mr-2" (onClick)="close(false)"/>
              <p-button label="Save"
                        styleClass="w-full"
                        class="w-full" (onClick)="saveProfile()"/>
            </div>
          </div>
        </form>
      </div>

    </div><!--/ ngIf -->

  `
})
export class UserEditComponent implements OnDestroy {
  authService = inject(AuthService);
  userService = inject(MemberService);
  imageService = inject(ImageUploadService);
  ref = inject(DynamicDialogRef);
  storage = getStorage();

  user$ = this.userService.userProfile$;
  userProfile$ = this.authService.user$;
  userPhoto: any;
  Email: boolean | undefined;


  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });

  constructor() {
    this.callProfile();
  }

  callProfile() {
    this.userService.userProfile$.subscribe((user) => {
      this.profileForm.patchValue({...user});
    });

    this.userProfile$.subscribe((res: any) => {
      const auth = getAuth();
      this.Email = auth.currentUser?.emailVerified;
      if (res) {
        this.userPhoto = res?.photoURL || '/images/dummy-user.png';
      }
    });
  }

  uploadImage(event: any, user: UserProfile) {
    this.imageService
      .uploadImage(
        event.target.files[0],
        `images/profiles/${user.uid}`
      )
      .pipe(
        concatMap((photoURL: string) =>
          this.authService.updateProfileData({uid: user.uid, photoURL}))
      )
      .subscribe({
        next: () => {
        },
        error: (e) => {
          this.authService.showError(`Error uploading profile picture: ${e.message}`);
        },
        complete: () => {
          this.authService.showSuccess('Uploaded profile picture');
        }
      });
  }

  saveProfile() {
    const profileData = this.profileForm.value;

    this.userService
      .updateUser(profileData)
      .subscribe({
        next: () => {
          // nothing here
        },
        complete: () => {
          this.authService.showSuccess('Profile saved successfully');
          this.close(true);
        },
        error: (err: Error) => {
          this.authService.showError(`Error saving profile: ${err.message}`);
        }
      });
  }

  close(b: boolean) {
    this.ref.close(b);
  }

  ngOnDestroy() {
    if (this.ref) this.ref.close();
  }

  sendEmail() {
    this.userService.sendVerifyEmail()
      .then(() => {
        this.authService.showSuccess('Email successfully sent');
      })
      .catch((err: Error) => {
        this.authService.showError(`Error sending email: ${err.message}`);
      })
      .finally();
  }
}
