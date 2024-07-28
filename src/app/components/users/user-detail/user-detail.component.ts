import { Component, inject, OnDestroy } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImportsModule } from '../../../imposts';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { Footer } from 'primeng/api';
import { MemberService } from '../../../services/member.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    ImportsModule
  ],
  template: `

    <hr class="h-px bg-gray-200 border-0">
    <div class="flex justify-content-end">
      <p-button class="sarabun"
                icon="pi pi-external-link"
                label="แก้ไขข้อมูล"
                [outlined]="true"
                severity="success"
                (click)="editDialog()"
      />
    </div>
    <table class="table-striped">
      <tr>
        <th>DisplayName:</th>
        <td>
          {{ user.displayName }}
        </td>
      </tr>
      <tr>
        <th>Name:</th>
        <td>
          {{ user.firstName }} {{ user.lastName }}
        </td>
      </tr>
      <tr>
        <th>Email:</th>
        <td>{{ user.email }}</td>
      </tr>
      <tr>
        <th>Phone:</th>
        <td>{{ user.phone }}</td>
      </tr>
      <tr>
        <th>Role:</th>
        <td>
        <span class="text-orange-500 font-bold">
          {{ user.role }}
        </span>
        </td>
      </tr>
    </table>
    <hr class="h-px bg-gray-200 border-0">

  `,
  styles: ``
})
export class UserDetailComponent implements OnDestroy {
  userService = inject(MemberService);
  dialogService = inject(DialogService);
  ref = inject(DynamicDialogRef);
  userData = inject(DynamicDialogConfig);
  user!: any;

  constructor() {
    if (this.userData.data) {
      this['user'] = this.userData.data;
    }
  }

  editDialog() {
    this.ref = this.dialogService.open(UserEditComponent, {
      header: 'แก้ไขข้อมูลผู้ใช้',
      width: '27vw',
      contentStyle: {overflow: 'auto'},
      breakpoints: {
        '1199px': '55vw',
        '960px': '55vw',
        '640': '90vw',
        '390': '95vw'
      },
      modal: true,
      dismissableMask: false,
      data: this.userData,
      closable: true
    });

    this.ref.onClose
      .pipe(take(1))
      .subscribe(() => {
        this['user'] = this.userService.userProfile$.subscribe((user) => {
          this.user = user;
        });
    });
  }

  ngOnDestroy() {
    if (this.ref) { this.ref.close() }
  }
}
