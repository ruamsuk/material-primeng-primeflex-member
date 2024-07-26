import { Component, inject, model, OnDestroy, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ImportsModule } from '../../imposts';
import { MemberService } from '../../services/member.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserDetailComponent } from '../users/user-detail/user-detail.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ImportsModule,
    NgClass,
    PrimeTemplate,
    NgIf,
    ToastModule
  ],
  template: `
    <p-toast/>
    <div class="card">
      <p-menubar [model]="items">
        <ng-template pTemplate="start">
          <svg width="33" height="35" viewBox="0 0 33 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.1934 0V0V0L0.0391235 5.38288L2.35052 25.3417L15.1934 32.427V32.427V32.427L28.0364 25.3417L30.3478 5.38288L15.1934 0Z"
              fill="var(--primary-color)"/>
            <mask id="mask0_1_36" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="31"
                  height="33">
              <path
                d="M15.1934 0V0V0L0.0391235 5.38288L2.35052 25.3417L15.1934 32.427V32.427V32.427L28.0364 25.3417L30.3478 5.38288L15.1934 0Z"
                fill="var(--primary-color-text)"/>
            </mask>
            <g mask="url(#mask0_1_36)">
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M15.1935 0V3.5994V3.58318V20.0075V20.0075V32.427V32.427L28.0364 25.3417L30.3478 5.38288L15.1935 0Z"
                    fill="var(--primary-color)"/>
            </g>
            <path
              d="M19.6399 15.3776L18.1861 15.0547L19.3169 16.6695V21.6755L23.1938 18.4458V12.9554L21.4169 13.6013L19.6399 15.3776Z"
              fill="var(--primary-color-text)"/>
            <path
              d="M10.5936 15.3776L12.0474 15.0547L10.9166 16.6695V21.6755L7.03966 18.4458V12.9554L8.81661 13.6013L10.5936 15.3776Z"
              fill="var(--primary-color-text)"/>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.3853 16.9726L12.6739 15.0309L13.4793 15.5163H16.7008L17.5061 15.0309L18.7947 16.9726V24.254L17.8283 25.7103L16.7008 26.843H13.4793L12.3518 25.7103L11.3853 24.254V16.9726Z"
              fill="var(--primary-color-text)"
            />
            <path d="M19.3168 24.7437L21.4168 22.6444V20.5451L19.3168 22.3214V24.7437Z"
                  fill="var(--primary-color-text)"/>
            <path d="M10.9166 24.7437L8.81662 22.6444V20.5451L10.9166 22.3214V24.7437Z"
                  fill="var(--primary-color-text)"/>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.0167 5.68861L11.7244 8.7568L13.8244 14.8932H14.7936V5.68861H13.0167ZM15.4397 5.68861V14.8932H16.5706L18.5091 8.7568L17.2167 5.68861H15.4397Z"
              fill="var(--primary-color-text)"
            />
            <path d="M13.8244 14.8932L6.87813 12.3094L5.90888 8.27235L11.8859 8.7568L13.9859 14.8932H13.8244Z"
                  fill="var(--primary-color-text)"/>
            <path d="M16.5706 14.8932L23.5169 12.3094L24.4861 8.27235L18.3476 8.7568L16.4091 14.8932H16.5706Z"
                  fill="var(--primary-color-text)"/>
            <path d="M18.8321 8.27235L22.2245 7.94938L19.9629 5.68861H17.7013L18.8321 8.27235Z"
                  fill="var(--primary-color-text)"/>
            <path d="M11.4013 8.27235L8.00893 7.94938L10.2705 5.68861H12.5321L11.4013 8.27235Z"
                  fill="var(--primary-color-text)"/>
          </svg>
        </ng-template>
        <ng-template pTemplate="item" let-item let-root="root">
          <ng-container>
            <a [routerLink]="item.route" class="p-menuitem-link">
              <span [class]="item.icon"></span>
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </ng-container>
        </ng-template>
        <ng-template pTemplate="end">
          <div *ngIf="user$ | async as user">
            <div class="flex align-items-center gap-2">
              <span id="user" (click)="userDialog(user)"
                    class="text-blue-600 sarabun">
                User: {{ user.displayName ? user.displayName : user.email }}
              </span>
              @if (user.role) {
                <span class="text-red-500">
                  [{{ user.role | uppercase }}]
                </span>
              }
              <p-button
                [text]="true"
                size="small"
                icon="pi pi-sign-out"
                severity="secondary"
                pTooltip="Log out"
                tooltipPosition="right"
                (click)="authService.logout()"
              />
            </div>
          </div>

        </ng-template>
      </p-menubar>
    </div>
  `,
  styles: `
    #user:hover {
      cursor: pointer;
    }
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  items: MenuItem[] | undefined;
  userDetail: string | undefined | null = null;

  dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;

  authService = inject(AuthService);
  memberService = inject(MemberService);
  router = inject(Router);
  user$ = this.memberService.userProfile$;
  data = model('');

  ngOnInit() {
    /**  user is logged in or not */
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email,
          displayName: user.displayName, password: ''
        });
        this.userDetail = this.authService.currentUserSig()?.email
          ? this.authService.currentUserSig()?.email
          : this.authService.currentUserSig()?.displayName;
      } else {
        this.authService.currentUserSig.set(null);
      }
      // console.log(this.authService.currentUserSig());
    });

    this.items = [
      {
        label: 'Home',
        route: 'landing',
        icon: 'pi pi-home'
      },
      {
        label: 'Members',
        icon: 'pi pi-users',
        command: () => {
          this.router.navigate(['/member']);
        }
      },
      // {
      //   label: 'Credit',
      //   route: '/credit',
      //   icon: 'pi pi-credit-card',
      // },
      {
        label: 'Logout', command: () => this.logout(),
        icon: 'pi pi-sign-out',
      }
    ];

  }

  //

  async logout() {
    await this.authService.logout().catch();
  }

  userDialog(user: any) {
    this.ref = this.dialogService.open(UserDetailComponent, {
      data: user,
      header: 'รายละเอียดผู้ใช้งาน',
      width: '50vw',
      contentStyle: {overflow: 'auto'},
      breakpoints: {
        '960px': '75vw',
        '640': '100vw',
        '390': '100vw'
      }
    });
  }

  ngOnDestroy() {
    if (this.ref) this.ref.close();
  }
}
