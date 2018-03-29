import { ArrayTypeAdapter } from "./adapters/ArrayTypeAdapter";
import { Constants } from "./Constants";
import { ObjectTypeAdapter } from "./adapters/ObjectTypeAdapter";
import { TypeAdapter } from "./TypeAdapter";
import { TypeAdapterFactory } from "./TypeAdapterFactory";
import { TypeAdapters } from "./adapters/TypeAdapters";
import { TypeToken } from "./reflect/TypeToken";
import { TysonBuilder } from "./TysonBuilder";
import "reflect-metadata";

export class Tyson {
  private _factories: Array<TypeAdapterFactory>;
  private _typeTokenCache: Map<string, TypeAdapter<any>>;

  constructor(builder?: TysonBuilder) {
    this._factories = new Array();
    this._typeTokenCache = new Map();

    // Users' factories
    if (builder) { this._factories.push(...builder.factories); }

    // Adapters for basic types
    this._factories.push(TypeAdapters.BOOLEAN_FACTORY);
    this._factories.push(TypeAdapters.NUMBER_FACTORY);
    this._factories.push(TypeAdapters.STRING_FACTORY);
    this._factories.push(TypeAdapters.DATE_FACTORY);
    this._factories.push(ObjectTypeAdapter.FACTORY);
    this._factories.push(ArrayTypeAdapter.FACTORY);
  }

  public fromJson<T>(json: {}, classOfT: {new(): T; }): T;
  public fromJson<T>(json: any[], classOfT: {new(): T; }[]): T[];
  public fromJson<T>(json: any, classOfT: any): any {
    if (json === undefined || classOfT === undefined) {
      return undefined;
    }

    const typeToken = new TypeToken(classOfT);
    return this.getAdapter(typeToken).read(json);
  }

  public toJson<T>(src: T): {};
  public toJson<T>(src: T[]): any[];
  public toJson<T>(src: any): any {
    if (src === undefined) {
      return undefined;
    }

    const typeToken = new TypeToken(src.constructor);
    return this.getAdapter(typeToken).write(src);
  }

  public getAdapter<T>(typeToken: TypeToken<T>): TypeAdapter<T> {
    const cached = this._typeTokenCache.get(typeToken.hash);
    if (cached !== undefined) {
      return cached;
    }

    for (let factory of this._factories) {
      const candidate = factory.create(this, typeToken);
      if (candidate !== undefined) {
        this._typeTokenCache.set(typeToken.hash, candidate);
        return candidate;
      }
    }
    throw new Error("Tyson cannot handle " + typeToken);
  }
}
