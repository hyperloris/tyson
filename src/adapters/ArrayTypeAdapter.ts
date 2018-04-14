import { Constants } from "../Constants";
import { ReflectionUtils } from "../reflect/ReflectionUtils";
import { TypeAdapter } from "../TypeAdapter";
import { TypeAdapterFactory } from "./../TypeAdapterFactory";
import { TypeToken } from "../reflect/TypeToken";
import { Tyson } from "../Tyson";

export class ArrayTypeAdapter implements TypeAdapter<any> {
  static readonly FACTORY: TypeAdapterFactory = {
    create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined {
      if (typeToken.type instanceof Array) {
        // Nasted arrays are not supported right now
        if (typeToken.type.length === 1) {
          const nestedTypeToken = new TypeToken(typeToken.type[0]);
          return new ArrayTypeAdapter(tyson, nestedTypeToken);
        }
      }
      return undefined;
    }
  };

  private _tyson: Tyson;
  private _typeToken: TypeToken<any>;

  constructor(tyson: Tyson, typeToken: TypeToken<any>) {
    this._tyson = tyson;
    this._typeToken = typeToken;
  }

  write(src: any): any {
    const jsonArray: any = [];
    for (let e of src) {
      jsonArray.push(this._tyson.getAdapter(this._typeToken).write(e));
    }
    return jsonArray;
  }

  read(json: any): any[] {
    const array = new Array<any>();
    for (let e of json) {
      array.push(this._tyson.getAdapter(this._typeToken).read(e));
    }
    return array;
  }
}
