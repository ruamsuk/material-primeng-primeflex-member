import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImportsModule } from '../../../imposts';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    ImportsModule
  ],
  template: `
    <hr class="h-px bg-gray-200 border-0">
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
    <div class="flex justify-content-end">
      <p-button
        label="Close"
        [text]="true"
        severity="success" (onClick)="close()"/>
    </div>
  `,
  styles: ``
})
export class UserDetailComponent {
  auth = inject(AuthService);
  ref = inject(DynamicDialogRef);
  userData = inject(DynamicDialogConfig);
  user!: any;

  constructor() {
    if (this.userData.data) {
      this['user'] = this.userData.data;
    }
  }

  close() {
    this.ref.close();
  }
}
