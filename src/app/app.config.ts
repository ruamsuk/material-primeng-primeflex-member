import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  ReCaptchaV3Provider,
  initializeAppCheck,
  provideAppCheck
} from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { MessageService } from 'primeng/api';
import { ThaiDatepickerModule } from './thai-datepicker/thai-datepicker.module';
import { DialogService } from 'primeng/dynamicdialog';
import firebase from 'firebase/compat/app';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

firebase.initializeApp(environment.firbaseConfig);


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firbaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAppCheck(() => {
      const provider = new ReCaptchaV3Provider(environment.recaptcha3SiteKey);
      return initializeAppCheck(undefined, {
        provider,
        isTokenAutoRefreshEnabled: true
      });
    }),
    provideAnimationsAsync(),
    importProvidersFrom(ThaiDatepickerModule),
    importProvidersFrom(AngularFireStorageModule),
    MessageService,
    DialogService,
    AngularFireAuthModule,
    { provide: FIREBASE_OPTIONS, useValue: initializeApp },
  ]
};
