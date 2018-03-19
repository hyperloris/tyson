import { TypeAdapter } from "./TypeAdapter";
import { TypeAdapterFactory } from "./TypeAdapterFactory";
import { TypeAdapters } from "./adapters/TypeAdapters";
import { TypeToken } from "./reflect/TypeToken";
import { Tyson } from "./Tyson";

export class TysonBuilder {
  private _factories: Array<TypeAdapterFactory>;

  constructor() {
    this._factories = new Array();
  }

  public get factories() {
    return this._factories;
  }

  public registerTypeAdapter<T>(type: {new(): T; }, typeAdapter: TypeAdapter<T>): TysonBuilder {
    this._factories.push(TypeAdapters.newFactory(TypeToken.get(type), typeAdapter));
    return this;
  }

  public registerTypeAdapterFactory(factory: TypeAdapterFactory): TysonBuilder {
    this._factories.push(factory);
    return this;
  }

  public build(): Tyson {
    return new Tyson(this);
  }
}
