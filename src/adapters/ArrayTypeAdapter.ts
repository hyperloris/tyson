import { Constants } from "../Constants";
import { ReflectionUtils } from "../reflect/ReflectionUtils";
import { TypeAdapter } from "../TypeAdapter";
import { TypeAdapterFactory } from "./../TypeAdapterFactory";
import { TypeToken } from "../reflect/TypeToken";
import { Tyson } from "../Tyson";

export class ArrayTypeAdapter<E> implements TypeAdapter<E> {
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

  write(): void {
    throw new Error("Method not implemented.");
  }

  read(json: any): E[] {
    const array = new Array<E>();
    for (let e of json) {
      array.push(this._tyson.getAdapter(this._typeToken).read(e));
    }
    return array;
  }
}
