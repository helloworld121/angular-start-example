export class UserModel {

  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date) {
  }

  // code that will be executen wenn calling ".token" on the object
  get token(): string {
    // no token available or token expired
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }


}
