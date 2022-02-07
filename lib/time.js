export function millisToMinutesAndSecond(ms){
  const minute = Math.floor(ms / 60000);
  const second = ((ms % 60000) / 1000).toFixed(0);
  return second == 60 ? minute + 1 + ":00" : minute + ":" + (second < 10 ? "0" : "") + second;
}

export function millisToHourMinutes(ms){
  const hour = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minute = Math.floor((ms / (1000 * 60)) % 60);
  return hour + " jam " + (minute < 10 ? "0" : "") + minute + " mnt";
}