export class DeserializationError extends Error {
  private _json: string | undefined;

  constructor(message?: string, json?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this._json = json;
  }

  get json(): string | undefined {
    return this._json;
  }
}
