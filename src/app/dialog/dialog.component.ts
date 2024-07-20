import { Component, Inject, inject, model, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { NgForOf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { ThaiDatepickerModule } from '../thai-datepicker/thai-datepicker.module';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { AuthService } from '../services/auth.service';
import { Member } from '../models/member.model';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogTitle,
    FormsModule,
    MatFormFieldModule,
    MatLabel,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    NgForOf,
    MatInputModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerModule,
    MatNativeDateModule,
    ThaiDatepickerModule,
    MatRadioGroup,
    MatRadioButton,
    MatDialogClose,
  ],
  template: `
    <mat-toolbar mat-dialog-title>

    </mat-toolbar>
    <form [formGroup]="memForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>ยศ</mat-label>
            <mat-select formControlName="rank">
              <mat-option *ngFor="let ran of rank" [value]="ran" class="sarabun">
                {{ ran }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>ชื่อ</mat-label>
            <input matInput
                   placeholder="ชื่อ (ไม่ต้องใส่ยศ)"
                   type="text"
                   formControlName="firstname"
                   autocomplete="off">
          </mat-form-field>
        </div>
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>นามสกุล</mat-label>
            <input matInput
                   placeholder="นามสกุล"
                   formControlName="lastname"
                   autocomplete="off">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>วันเดือนปีเกิด</mat-label>
            <input matInput
                   placeholder="วันเดือนปีเกิด"
                   [matDatepicker]="picker"
                   formControlName="birthdate">
            <mat-datepicker-toggle matIconSuffix [for]="picker">
            </mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>ที่อยู่</mat-label>
            <input matInput
                   formControlName="address"
                   placeholder="บ้านเลขที่ ถนน ตำบล"
                   autocomplete="off">
          </mat-form-field>
        </div>
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>อำเภอ</mat-label>
            <input matInput
                   formControlName="district"
                   autocomplete="off">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>จังหวัด</mat-label>
            <input matInput
                   formControlName="province"
                   autocomplete="off">
          </mat-form-field>
        </div>
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>รหัสไปรษณีย์</mat-label>
            <input matInput
                   formControlName="zip"
                   autocomplete="off">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>โทรศัพท์</mat-label>
            <input matInput
                   formControlName="phone"
                   autocomplete="off">
          </mat-form-field>
        </div>
        <div class="row">
          <mat-radio-group aria-label="Select an option" formControlName="alive">
            <mat-label>สถานะ</mat-label>
            <mat-radio-button value="มีชีวิตอยู่" [checked]="isAlive">มีชีวิตอยู่</mat-radio-button>
            <mat-radio-button value="เสียชีวิตแล้ว" [checked]="!isAlive">เสียชีวิตแล้ว</mat-radio-button>
          </mat-radio-group>
        </div>
      </mat-dialog-content>
      <div mat-dialog-actions>
        <button [disabled]="memForm.invalid" mat-button type="button" [mat-dialog-close]="true">Cancel</button>
        <button [disabled]="memForm.invalid" mat-button type="submit">{{ data ? 'Update' : 'Save' }}</button>
      </div>
    </form>
  `,
  styles: `
    form > input .mat-input {
      font-family: 'Sarabun', sans-serif !important;
      font-size: 16px !important;
    }
  `,
  providers: [
    {
      provide: MAT_DIALOG_DATA, useValue: {}
    },
    {
      provide: MatDialogRef, useValue: {}
    }
  ]
})
export class DialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<DialogComponent>);
  public data = inject<Member>(MAT_DIALOG_DATA);
  // group = model(this.data);
  authService = inject(AuthService);
  memForm: FormGroup;

  isAlive!: boolean;
  rank: string[] = [
    'ร.ต.อ.', 'พ.ต.ต.', 'พ.ต.ท.', 'พ.ต.อ.'
  ];


  constructor() {
    this.memForm = new FormGroup({
      id: new FormControl(null),
      rank: new FormControl(''),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      birthdate: new FormControl(''),
      address: new FormControl(''),
      district: new FormControl(''),
      province: new FormControl(''),
      zip: new FormControl(''),
      phone: new FormControl(''),
      alive: new FormControl(true),
    });
  }

  ngOnInit() {
    console.log(this.data.firstname);
    if (this.data) {
      this.memForm.patchValue({
        id: this.data.id,
        rank: this.data.rank,
        firstname: this.data.firstname,
        lastname: this.data.lastname,
        birthdate: this.data.birthdate, //.toDate(),
        address: this.data.address,
        district: this.data.district,
        phone: this.data.phone,
        province: this.data.province,
        zip: this.data.zip,
        alive: this.data.alive
      });
      this.isAlive = this.data.alive == 'ยังมีชีวิต';
    } else {
      this.isAlive = true;
    }

  }

  closeClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.memForm.invalid) return;

    const memData = this.memForm.value;

    if (this.data) {
      this.authService
        .addMember(memData)
        .subscribe({
          next: () => {
            this.authService.showSuccess('Updated successfully.');
          },
          error: (err: Error) => {
            this.authService.showError(`Unable to Updated member: ${err}`);
          },
          complete: () => {
            this.closeClick();
          },
        });
    } else {
      this.authService
        .addMember(memData)
        .subscribe({
          next: () => {
            this.authService.showSuccess('Add member successfully.');
          },
          error: (err: Error) => {
            this.authService.showError(`Unable to Add member: ${err}`);
          },
          complete: () => {
            this.closeClick();
          }
        });
    }
  }

}
