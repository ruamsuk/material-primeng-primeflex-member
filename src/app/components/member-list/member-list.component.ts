import { Component, inject, model, OnDestroy, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { Member } from '../../models/member.model';
import { AuthService } from '../../services/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ImportsModule } from '../../imposts';
import { ThaiDatePipe } from '../../pipe/thai-date.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MembersDialogComponent } from '../members-dialog/members-dialog.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MembersDetailComponent } from '../members-detail/members-detail.component';
import { MemberService } from '../../services/member.service';
import { take } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';

@UntilDestroy({arrayName: 'subscriptions'})
@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    HomeComponent,
    ImportsModule,
    ThaiDatePipe,
    MatProgressSpinner,
  ],
  template: `
    @if (loading) {
      <div class="loading-shade">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>
    }

    <div class="flex justify-content-center align-items-center">
      <div class="card shadow-2 mt-3" [style]="{ width: '600px' }">
        <div
          class="flex align-items-center justify-content-center anuphon bg-black-alpha-10 shadow-1">
          <span class="text-blue-600 font-bold md:text-3xl xl:text-2xl line-height-4">
            รายชื่อสมาชิก นอร.25
          </span>
        </div>
        <p-table
          #dt [value]="members"
          dataKey="id"
          [rows]="6"
          [breakpoint]="'960px'"
          [rowsPerPageOptions]="[5, 10, 30]"
          [loading]="loading"
          [paginator]="true"
          [globalFilterFields]="['firstname', 'lastname', 'province']"
          styleClass="p-datatable-striped"
          [tableStyle]="{ 'min-width': '25rem' }">

          <ng-template pTemplate="caption">
            <div class="flex align-items-center justify-content-between">
              <span>
                <p-button (click)="openNew()" [disabled]="!canDo" size="small" icon="pi pi-plus"/>
              </span>
              <p-iconField iconPosition="left" class="ml-auto">
                <p-inputIcon>
                  <i class="pi pi-search"></i>
                </p-inputIcon>
                <input
                  pInputText
                  pTooltip="ค้นหาชื่อ หรือนามสกุล หรือจังหวัด"
                  tooltipPosition="bottom"
                  placeholder="ค้นหา ชื่อ หรือนามสกุล..."
                  type="text"
                  (input)="dt.filterGlobal(getValue($event), 'contains')"
                >
              </p-iconField>
            </div>
          </ng-template>
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="firstname"
                  class="anuphon pl-6 md:pl-6 sm:pl-0 " style="width: 65%;">
                <div class="flex align-items-center sm:pl-6 md:pl-0">
                  ยศ ชื่อ นามสกุล
                  <p-sortIcon field="firstname"/>
                </div>
              </th>
              <th class="anuphon pl-6 md:pl-6 sm:pl-0">
                <div class="flex align-items-center">
                  Action.
                </div>
              </th>
          </ng-template>
          <ng-template pTemplate="body" let-member>
            <tr [ngClass]="{'row-status': member.alive == 'เสียชีวิตแล้ว'}">
              <td [ngClass]="{'isAlive': member.alive == 'เสียชีวิตแล้ว'}"
                  class="sarabun text-md text-black-alpha-90" style="padding-left: 3rem;">
                {{ member.rank }}{{ member.firstname }} {{ member.lastname }}
              </td>
              <td>
                <p-button class="mr-1"
                          pTooltip="รายละเอียด"
                          tooltipPosition="bottom"
                          [outlined]="true"
                          size="small"
                          [rounded]="true" severity="info"
                          icon="pi pi-list" (click)="showDialog(member)"/>

                @if (canDo) {
                  <p-button class="mr-1"
                            pTooltip="แก้ไขข้อมูล"
                            tooltipPosition="bottom"
                            [outlined]="true"
                            size="small"
                            [rounded]="true" severity="success"
                            icon="pi pi-pencil" (click)="onUpdate(member)"/>
                  <p-button
                    pTooltip="ลบข้อมูล"
                    tooltipPosition="bottom"
                    [outlined]="true"
                    size="small"
                    [rounded]="true" severity="danger"
                    icon="pi pi-trash" (click)="deleteItem(member)"/>
                }

                <!-- template -->
                <!--<p-button
                  [outlined]="true"
                  size="small"
                  severity="info"
                  icon="pi pi-android" (click)="showDialog(member)"/>-->
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: `

    .isAlive {
      color: #0a0af2 !important;
      font-weight: 500 !important;
    }

    :host ::ng-deep .row-status {
      background-color: rgba(0, 0, 255, 0.05) !important;
    }

    th {
      background-color: #eceaea;
      margin-left: 1rem !important;
    }

    :host ::ng-deep input {
      font-family: 'Sarabun', sans-serif !important;
    }

    :host ::ng-deep .p-dropdown-items {
      font-family: 'Sarabun', sans-serif !important;
    }
  `,
})
export class MemberListComponent implements OnInit, OnDestroy {
  memberService = inject(AuthService);
  userService = inject(MemberService);
  data = model('');
  dialog = inject(MatDialog);
  firestore = inject(Firestore);

  dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;
  canDo: boolean = true;

  members!: Member[];
  member!: Member;
  layout: string = 'list';
  loading: boolean = false;
  rank: string[] = [
    'ร.ต.อ.', 'พ.ต.ต.', 'พ.ต.ท.', 'พ.ต.อ.'
  ];

  ngOnInit() {
    this.loadMembers();
    this.checkRole();
  }

  private checkRole() {
    this.userService.userProfile$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.canDo = user?.role == 'admin';

      }
    //  console.log(user?.email, ' D: ', user?.displayName, ' ', user?.role, ' ', user?.uid);
    });
  }

  loadMembers() {
    this.loading = true;
    this.memberService
      .loadMembers()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe({
        next: (member: Member[]) => {
          this.members = member;
          this.loading = false;
        },
        error: (err: Error) => {
          this.memberService.showError(`Unable to load member ${err}`);
        },
        complete: () => this.loading = false
      });
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  deleteItem(data: Member) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete Member',
        message: 'Are you sure you want to delete this member?',
      }
    });
    confirmDialog.afterClosed()
      .subscribe((result: any) => {
        if (result) {
          let id = data.id;
          this.memberService
            .deleteMember(id)
            .subscribe({
              next: () => {
                this.memberService.showWarn('Deleted Member successfully.');
              },
              complete: () => {
                // nothing
              },
              error: (err: Error) => {
                this.memberService.showError(`Unable to Delete Member: ${err}`);
              }
            });
        }
      });
  }

  onUpdate(data: any) {
    this.dialog.open(MembersDialogComponent, {
      data: data
    });
  }

  openNew() {
    this.dialog.open(MembersDialogComponent, {});
  }

  /** MatDialog */
  // onDetail(member: any) {
  //   this.dialog.open(MemberDetailComponent, {data: member});
  // }

  /** PrimeNG Dialog */
  showDialog(member: any) {
    this.ref = this.dialogService
      .open(MembersDetailComponent, {
        data: member,
        header: 'รายละเอียดสมาชิก',
        width: '40vw',
        contentStyle: {overflow: 'auto'},
        breakpoints: {
          '960px': '90vw',
          '640': '85vw',
          '390': '95vw'
        }
      });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

}
