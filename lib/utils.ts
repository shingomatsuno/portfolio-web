import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatInTimeZone } from 'date-fns-tz';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormat(
  date: Date | string | number,
  format = 'yyyy/MM/dd',
): string {
  try {
    return formatInTimeZone(date, 'Asia/Tokyo', format);
  } catch (e) {
    console.log(date);
    return '';
  }
}

export function getAge(birthday: string) {
  // 今日の日付データを取得
  const today = new Date();

  // 生年月日の日付データを取得
  const birthdate = new Date(birthday);

  // 今年の誕生日の日付データを取得
  const currentYearBirthday = new Date(
    today.getFullYear(),
    birthdate.getMonth(),
    birthdate.getDate(),
  );

  // 生まれた年と今年の差を計算
  let age = today.getFullYear() - birthdate.getFullYear();

  // 今日の日付と今年の誕生日を比較
  if (today < currentYearBirthday) {
    // 今年誕生日を迎えていない場合、1を引く
    return age - 1;
  }

  // 年齢の値を返す
  return age;
}
