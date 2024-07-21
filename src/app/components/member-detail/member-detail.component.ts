import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from '@angular/material/dialog';
import { CountAgeService } from '../../services/count-age.service';
import { Member } from '../../models/member.model';
import { MatButtonModule } from '@angular/material/button';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { ThaiDatePipe } from '../../pipe/thai-date.pipe';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDivider } from '@angular/material/divider';
import { MatTable } from '@angular/material/table';
import { ImportsModule } from '../../imposts';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    MatDialogClose,
    MatDialogActions,
    MatButtonModule,
    MatChipOption,
    MatChipListbox,
    ThaiDatePipe,
    MatDialogContent,
    MatDialogTitle,
    MatToolbarModule,
    MatDivider,
    MatTable,
    ImportsModule
  ],
  template: `
    <mat-toolbar>
        <span class="text-3xl font-bold text-primary-900 tasadith py-4 px-4">
        รายละเอียดสมาชิก
        </span>
    </mat-toolbar>

    <mat-dialog-content class="px-6">
      <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700">
      <table class="table-striped">
        <tr>
          <th>ยศ ชื่อ สกุล:</th>
          <td>
            {{ users.rank }}{{ users.firstname }} {{ users.lastname }}
          </td>
        </tr>
        <tr>
          <th>วันเกิด:</th>
          <td>
            {{ users.birthdate | thaiDate }}
          </td>
        </tr>
        <tr>
          <th>ที่อยู่:</th>
          <td>{{ users.address }}</td>
        </tr>
        <tr>
          <th>อำเภอ จังหวัด:</th>
          <td>{{ users.district }} {{ users.province }}</td>
        </tr>
        <tr>
          <th>โทรศัพท์:</th>
          <td>{{ users.phone }}</td>
        </tr>
        <tr>
          <th>อายุ:</th>
          <td>
            <mat-chip-listbox>
              <mat-chip-option color="accent" selected class="sarabun font-semibold">{{ age }}</mat-chip-option>
            </mat-chip-listbox>
          </td>
        </tr>
        <tr class="">
          <th>สถานะ:</th>
          <td>
        <span class="{{users.alive == 'เสียชีวิตแล้ว' ? 'text-orange-600' : 'text-green-600'}} font-semibold">
          {{ users.alive }}
        </span>
          </td>
        </tr>
      </table>
      <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700">
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button [mat-dialog-close]="true" mat-stroked-button>Close</button>
    </mat-dialog-actions>
  `,
  styles: `
    table {
      border-collapse: collapse;
      font-family: 'Sarabun', sans-serif;
      font-size: 18px;
      margin-bottom: 1rem;
      color: #212529;
      width: 100%;
    }

    .table th,
    .table td {
      padding: 2rem;
      vertical-align: top;
      border-top: 1px solid #c7cacb;
      overflow: hidden;
    }

    table th {
      text-align: right;
      padding-right: 5px;
      height: 2rem;
    }

    .table-striped tbody tr:nth-of-type(odd) {
      background-color: rgba(0, 0, 0, 0.05);
    }

    #close {
      width: 100px;
    }
  `
})
export class MemberDetailComponent {
  users!: Member;
  age!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: any,
    private dialogRef: MatDialogRef<MemberDetailComponent>,
    private countAge: CountAgeService
  ) {
    if (this.user) {
      this.users = this.user;
      this.age = countAge.getAge(this.user.birthdate);
    }
  }
}
