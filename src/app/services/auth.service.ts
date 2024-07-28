import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword, updateProfile, user
} from '@angular/fire/auth';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';
import { concatMap, from, Observable, of } from 'rxjs';
import { Member } from '../models/member.model';
import firebase from 'firebase/compat/app';
import UserInfo = firebase.UserInfo;

export interface Credential {
  id?: string;
  email: string;
  password: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);
  router = inject(Router);
  firestore: Firestore = inject(Firestore);
  messageService = inject(MessageService);
  authState$ = authState(this.auth);
  currentUser$ = authState(this.auth);

  user$ = user(this.auth);
  /** user logged in or not */
  currentUserSig = signal<Credential | null | undefined>(undefined)

  // logInWithEmailAndPassword(credential: Credential) {
  //   return signInWithEmailAndPassword(
  //     this.auth,
  //     credential.email,
  //     credential.password
  //   );
  // }
  //

  signIn(credential: Credential): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.auth, credential.email, credential.password
    ).then(() => {});

    return from(promise);
  }

 async logout() {
   await this.auth.signOut().then(() => {
        this.router.navigateByUrl('/auth/login').finally()
      }
    );
  }

  constructor() {

  }

  /** Toast */
  showSuccess(msg: string): void {
    return this.messageService.add({severity: 'success', summary: 'Success', detail: `${msg}`, life: 4000});
  }

  showError(msg: string) {
    return this.messageService.add({severity: 'error', summary: 'Error', detail: `${msg}`, life: 4000});
  }

  showWarn(msg: string) {
    return this.messageService.add({severity: 'warn', summary:'Warn Message', detail: `${msg}`, life: 4000});
  }

  /** Members */
  loadMembers() {
    const dbInstance = collection(this.firestore, 'members');
    const memberQuery = query(
      dbInstance,
      orderBy('created', 'desc'));

    return collectionData(memberQuery, {idField: 'id'});
  }

  updateMember(member: Member): Observable<any> {
    const docInstance = doc(this.firestore, `members/${member.id}`);

    return from(updateDoc(docInstance, {...member, updated: new Date()}));
  }

  addMember(user: Member): Observable<any> {
    const docRef = collection(this.firestore, 'members');
    return from(addDoc(docRef, { ...user, created: new Date()}));
  }

  deleteMember(id: string | undefined): Observable<any> {
    const docRef = doc(this.firestore, `members/${id}`);
    return from(deleteDoc(docRef));
  }

  updateProfileData(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.auth.currentUser;
    return of(user).pipe(
      concatMap(user => {
        if (!user) throw new Error('Not Authenticated');

        return updateProfile(user, profileData);
      })
    );
  }

}
