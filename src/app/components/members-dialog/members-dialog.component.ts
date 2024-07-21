import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MembersListComponent } from '../members-list/members-list.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImportsModule } from '../../imposts';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import { MatToolbar } from '@angular/material/toolbar';
import { NgForOf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-members-dialog',
  standalone: true,
  imports: [
    ImportsModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    MatSuffix,
    MatToolbar,
    NgForOf,
    ReactiveFormsModule,
    MatDialogClose
  ],
  template: `
    <div class="flex justify-content-center align-items-center mt-3 ">
      <h2 class="tasadith text-3xl font-bold {{ data ? 'text-orange-600' : 'text-green-600'}} mat-dialog-title">
        {{ data ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่' }}
      </h2>
    </div>

    <form [formGroup]="memForm" (ngSubmit)="onSubmit()">
      <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700 ml-4 mr-4">
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
          <!-- v.18 -->
          <mat-radio-group
            aria-labelledby="example" formControlName="alive">
            @for (stat of status; track $index) {
              <mat-radio-button class="" [value]="stat">{{ stat }}</mat-radio-button>
            }
          </mat-radio-group>
        </div>
      </mat-dialog-content>
      <div mat-dialog-actions>
        <button mat-button type="button" [mat-dialog-close]="true">Cancel</button>
        <button [disabled]="memForm.invalid" mat-button type="submit">{{ data ? 'Update' : 'Save' }}</button>
      </div>
    </form>
  `,
  styles: `
    .mdc-label {
      font-family: 'Sarabun', sans-serif !important;
    }
    `
})
export class MembersDialogComponent implements OnInit {
  memForm: FormGroup<any>;
  isAlive!: boolean;
  rank: string[] = [
    'ร.ต.อ.', 'พ.ต.ต.', 'พ.ต.ท.', 'พ.ต.อ.'
  ];
  status : string[] = ['ยังมีชีวิต', 'เสียชีวิตแล้ว'];
  _isAlive!: string;

  constructor(
    public dialogRef: MatDialogRef<MembersListComponent>,
    public authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.memForm = new FormGroup<any>({
      id: new FormControl(null),
      rank: new FormControl(''),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      birthdate: new FormControl(''),
      address: new FormControl(''),
      district: new FormControl(''),
      phone: new FormControl(''),
      province: new FormControl(''),
      zip: new FormControl(''),
      alive: new FormControl(true),
    });
  }

  ngOnInit() {
    if (this.data) {
      this.memForm.setValue({
        id: this.data.id,
        rank: this.data.rank,
        firstname: this.data.firstname,
        lastname: this.data.lastname,
        birthdate: this.data.birthdate.toDate(),
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

  onSubmit() {
    const memData = this.memForm.value;
    console.log(this.memForm.controls['alive'].value);

    if (this.data) {
      this.authService
        .updateMember(memData)
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

  closeClick() {
    this.dialogRef.close();
  }
}
