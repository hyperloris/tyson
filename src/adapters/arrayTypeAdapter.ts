import { TypeToken } from '../reflect/typeToken';
import { TypeAdapter } from '../typeAdapter';
import { Tyson } from '../tyson';
import { TypeAdapterFactory } from './../typeAdapterFactory';

export class ArrayTypeAdapter extends TypeAdapter<any> {
  static readonly FACTORY: TypeAdapterFactory = {
    create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined {
      if (typeToken.type instanceof Array) {
        return new ArrayTypeAdapter(tyson, typeToken);
      }
      return undefined;
    },
  };

  private _tyson: Tyson;
  private _typeToken: TypeToken<any>;

  constructor(tyson: Tyson, typeToken: TypeToken<any>) {
    super();
    this._tyson = tyson;
    this._typeToken = typeToken;
  }

  protected _fromPlain(json: any): any[] {
    return this.convertSingleOrMultiTypeArray(true, json);
  }

  protected _toPlain(src: any): any[] {
    return this.convertSingleOrMultiTypeArray(false, src);
  }

  private convertSingleOrMultiTypeArray(isFrom: boolean, inArray: any[]): any[] {
    const array = [];
    const types = this._typeToken.type as any[];
    if (types.length === 1) {
      const adapter = this._tyson.getAdapter(new TypeToken(types[0]));
      for (const value of inArray) {
        array.push(isFrom ? adapter.fromPlain(value) : adapter.toPlain(value));
      }
    } else {
      for (const i in types) {
        const adapter = this._tyson.getAdapter(new TypeToken(types[i]));
        array.push(isFrom ? adapter.fromPlain(inArray[i]) : adapter.toPlain(inArray[i]));
      }
    }
    return array;
  }
}
