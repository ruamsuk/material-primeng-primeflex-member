import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { UserProfile } from '../models/user-profile.model';
import { Observable, of, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  auth = inject(AuthService);
  firestore = inject(Firestore);

  get userProfile$(): Observable<UserProfile | null > {
    return this.auth.currentUser$
      .pipe(switchMap((user: User | null) => {
          if (user?.uid) {
            const ref = doc(this.firestore, 'users', user?.uid);
            return docData(ref);
          } else {
            return of(null);
          }
        })
      );
  }

  // userProfile(): Observable<UserProfile> {
  //   const userId = this.auth.currentUserSig()?.id;
  //   const ref = doc(this.firestore, 'users', 'userId');
  //
  //   return docData(ref) as Observable<UserProfile>;
  // }

  constructor() {
  }
}
