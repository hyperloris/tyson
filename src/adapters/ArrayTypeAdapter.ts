import { Constants } from "../Constants";
import { TypeAdapter } from "../TypeAdapter";
import { TypeAdapterFactory } from "./../TypeAdapterFactory";
import { TypeToken } from "../reflect/TypeToken";
import { Tyson } from "../Tyson";
import { ReflectionUtils } from "../reflect/ReflectionUtils";

export class ArrayTypeAdapter<E> implements TypeAdapter<E> {
  static readonly FACTORY: TypeAdapterFactory = {
    create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined {
      if (typeToken.type instanceof Array) {
        // Nasted arrays are not supported right now
        if (typeToken.type.length === 1) {
          const nestedTypeToken = new TypeToken(typeToken.type[0]);
          const typeAdapter = tyson.getAdapter(nestedTypeToken);
          return new ArrayTypeAdapter(typeAdapter);
        }
      }
      return undefined;
    }
  };

  private _typeAdapter: TypeAdapter<any>;

  constructor(typeAdapter: TypeAdapter<any>) {
    this._typeAdapter = typeAdapter;
  }

  write(): void {
    throw new Error("Method not implemented.");
  }

  read(json: any): E[] {
    const array = new Array<E>();
    for (let e of json) {
      array.push(this._typeAdapter.read(e));
    }
    return array;
  }
}
