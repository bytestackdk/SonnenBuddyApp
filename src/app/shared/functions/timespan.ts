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

export function getTimespan(date1: Date, date2: Date) {
  let difference = Math.abs(date1.getTime() - date2.getTime()) / 1000;
  const timespan: ITimeSpan = {};

  Object.keys(s).forEach((key) => {
    timespan[key] = Math.floor(difference / s[key]);
    difference -= timespan[key] * s[key];
  });

  return timespan;
}
