import { ArrayTypeAdapter } from "./adapters/ArrayTypeAdapter";
import { Constants } from "./Constants";
import { ObjectTypeAdapter } from "./adapters/ObjectTypeAdapter";
import { TypeAdapter } from "./TypeAdapter";
import { TypeAdapterFactory } from "./TypeAdapterFactory";
import { TypeAdapters } from "./adapters/TypeAdapters";
import { TypeToken } from "./reflect/TypeToken";
import { TysonBuilder } from "./TysonBuilder";
import "reflect-metadata";

/**
 * This is the main class. Tyson is typically used by first constructing a
 * Tyson instance and then invoking toJson or fromJson methods on it.
 *
 * Here is an example:
 * Tyson tyson = new Tyson();
 * const myObj = tyson.fromJson(json, MyClass); // deserializes json into myObj
 * const json = tyson.toJson(myObj); // serializes myObj to json
 *
 * @export
 * @class Tyson
 */
export class Tyson {
  private _factories: Array<TypeAdapterFactory>;
  private _typeTokenCache: Map<string, TypeAdapter<any>>;

  /**
   * Creates an instance of Tyson.
   *
   * @param {TysonBuilder} [builder]
   * @memberof Tyson
   */
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

  /**
   * This method deserializes the specified JSON into an object|array of the specified type.
   *
   * @template T the type of the desired object|array
   * @param json the JSON object|array used during deserialization
   * @param type a class|array of T
   * @returns an object|array of type T. Returns undefined if json or type are undefined.
   * @memberof Tyson
   */
  public fromJson<T>(json: {}, type: {new(): T; }): T;
  public fromJson<T>(json: any[], type: {new(): T; }[]): T[];
  public fromJson<T>(json: any, type: any): any {
    if (json === undefined || type === undefined) {
      return undefined;
    }

    const typeToken = new TypeToken(type);
    return this.getAdapter(typeToken).read(json);
  }

  /**
   * This method serializes the specified object, into its equivalent JSON representation.
   *
   * @param src the object|array for which JSON representation is to be created
   * @returns JSON representation of src
   * @memberof Tyson
   */
  public toJson(src: any[]): any[];
  public toJson(src: any): {};
  public toJson(src: any): any {
    if (src === undefined) {
      return undefined;
    }

    const typeToken = new TypeToken(src.constructor);
    return this.getAdapter(typeToken).write(src);
  }

  /**
   * Returns the type adapter for the specified typeToken.
   * This method uses a cache to avoid re-creating a new adapter
   * for a previously requested TypeToken.
   *
   * @template T
   * @param {TypeToken<T>} typeToken
   * @returns {TypeAdapter<T>} a TypeAdapter of T
   * @throws Will throw an error if Tyson cannot deserialize / serialize typeToken
   * @memberof Tyson
   */
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
