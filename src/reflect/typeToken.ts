import { ReflectionUtils } from "./reflectionUtils";

export type ClassType<T> = {
  new (...args: any[]): T;
};

/**
 * A simple container for the type
 *
 * @export
 * @class TypeToken
 * @template T
 */
export class TypeToken<T> {
  private _type: ClassType<T> | any[];
  private _hash: string;

  constructor(type: ClassType<T> | any[]) {
    this._type = type;
    this._hash = ReflectionUtils.getTypeHash(type);
  }

  public get type(): ClassType<T> | any[] {
    return this._type;
  }

  public get hash(): string {
    return this._hash;
  }
}
