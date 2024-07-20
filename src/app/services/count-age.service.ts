import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CountAgeService {

  constructor() { }

  getAge(DayOfBirth: any) {

    const setDayBirth = moment(DayOfBirth.toDate());
    const setNowDate = moment();

    const yearData = setNowDate.diff(setDayBirth, 'years', true); // อายุมีเศษ
    const yearReal = setNowDate.diff(setDayBirth, 'years'); //  อายุเต็ม
    const monthDiff = Math.floor((yearData - yearReal) * 12); // หาจำนวนเดือน

    return yearReal + ' ปี ' + monthDiff + ' ด.';
  }
}
