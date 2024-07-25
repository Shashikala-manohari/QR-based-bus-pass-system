export function Getgreeting() {
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour < 12) {
    return 'Good morning ';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good afternoon ';
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'Good evening ';
  } else {
    return 'Hello ';
  }
}
