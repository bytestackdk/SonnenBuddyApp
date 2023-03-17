export class CustomRegex {
  static get ipRegex() {
    return new RegExp(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/gi);
  }
}
