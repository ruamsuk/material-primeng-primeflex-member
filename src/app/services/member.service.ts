import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { UserProfile } from '../models/user-profile.model';
import { from, Observable, of, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';
import User = firebase.User;
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class MemberService {
  auth = inject(AuthService);
  afAuth = inject(AngularFireAuth);
  firestore = inject(Firestore);

  get userProfile$(): Observable<UserProfile | null > {
    return this.auth.currentUser$
      .pipe(switchMap((user: User | null) => {
          if (user?.uid) {
            const ref = doc(this.firestore, 'users', user?.uid);
            return docData(ref) as Observable<UserProfile>;
          } else {
            return of(null);
          }
        })
      );
  }

  async sendVerifyEmail(): Promise<void | undefined> {
    return await this.afAuth.currentUser.then((user) => {
      return user?.sendEmailVerification();
    });
  }

  // userProfile(): Observable<UserProfile> {
  //   const userId = this.auth.currentUserSig()?.id;
  //   const ref = doc(this.firestore, 'users', 'userId');
  //
  //   return docData(ref) as Observable<UserProfile>;
  // }

  constructor() {
  }

  updateUser(user: any) {
    const ref = doc(this.firestore, 'users', `${user.uid}`);
    return from(updateDoc(ref, {...user}));
  }
}
