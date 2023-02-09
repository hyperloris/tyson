import { Type } from '../interfaces';
import { ReflectionUtils } from './reflectionUtils';

/**
 * A simple container for the type
 *
 * @export
 * @class TypeToken
 * @template T
 */
export class TypeToken<T = any> {
  private _type: Type<T> | any[];
  private _hash: string;

  constructor(type: Type<T> | any[]) {
    this._type = type;
    this._hash = ReflectionUtils.getTypeHash(type);
  }

  public get type(): Type<T> | any[] {
    return this._type;
  }

  public get hash(): string {
    return this._hash;
  }
}
