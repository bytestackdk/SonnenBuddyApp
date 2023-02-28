export interface ITimeSpan {
  year?: number;
  month?: number;
  week?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
}

const s: ITimeSpan = {
  year: 31536000,
  month: 2592000,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

export const prefixZero = (hoursOrMinutes: number) => {
  return hoursOrMinutes.toString().padStart(2, '0');
};

export const getTimespan = (date1: Date, date2: Date) => {
  let difference = Math.abs(date1.getTime() - date2.getTime()) / 1000;
  const timespan: ITimeSpan = {};

  Object.keys(s).forEach((key) => {
    timespan[key] = Math.floor(difference / s[key]);
    difference -= timespan[key] * s[key];
  });

  return timespan;
};

export const timeToNumber = (time: string) => {
  const [hh, mm] = time.split(':');
  const hours = parseInt(hh, 10);
  const minutes = parseInt(mm, 10);

  return hours * 4 + minutes / 15;
};

export const numberToTime = (value: number) => {
  const date = new Date(0);

  date.setMinutes(value * 15);

  const hours = prefixZero(date.getUTCHours());
  const minutes = prefixZero(date.getUTCMinutes());

  return value > 0 && hours === '00' && minutes === '00' ? '24:00' : `${hours}:${minutes}`;
};

export const timeSpanToLabel = (timespan: ITimeSpan) => {
  if (timespan.day > 0) {
    return `${timespan.day} day(s)`;
  }

  if (timespan.hour > 0) {
    return `${timespan.hour} hour(s)`;
  }

  return `${timespan.minute.toString()} min(s)`;
};
