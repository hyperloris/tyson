import 'reflect-metadata';

import { ArrayTypeAdapter } from './adapters/arrayTypeAdapter';
import { ObjectTypeAdapter } from './adapters/objectTypeAdapter';
import { TypeAdapters } from './adapters/typeAdapters';
import { Constants } from './constants';
import { ClassType, TypeToken } from './reflect/typeToken';
import { TypeAdapter } from './typeAdapter';
import { TypeAdapterFactory } from './typeAdapterFactory';
import { TysonBuilder } from './tysonBuilder';

/**
 * This is the main class. Tyson is typically used by first constructing a
 * Tyson instance and then invoking toJson or fromJson methods on it.
 *
 * Here is an example:
 * <pre>
 * const tyson = new Tyson(); // or builder
 * const target = new MyType();
 * const json = tyson.toJson(target); // serializes target to JSON
 * const target2 = tyson.fromJson(json, MyType); // deserializes JSON into target2
 * </pre>
 *
 * @export
 * @class Tyson
 */
export class Tyson {
  private _factories: Array<TypeAdapterFactory>;
  private _typeTokenCache: Map<string, TypeAdapter<any>>;
  private _serializeNulls = Constants.DEFAULT_SERIALIZE_NULLS;

  /**
   * Creates an instance of Tyson.
   *
   * @param {TysonBuilder} [builder]
   * @memberof Tyson
   */
  constructor(builder?: TysonBuilder) {
    this._factories = [];
    this._typeTokenCache = new Map();

    // Users' configs
    if (builder) {
      this._factories.push(...builder.factories);
      this._serializeNulls = builder.serializeNulls;
    }

    // Adapters for basic types
    this._factories.push(TypeAdapters.BOOLEAN_FACTORY);
    this._factories.push(TypeAdapters.NUMBER_FACTORY);
    this._factories.push(TypeAdapters.STRING_FACTORY);
    this._factories.push(TypeAdapters.DATE_FACTORY);
    this._factories.push(ObjectTypeAdapter.FACTORY);
    this._factories.push(ArrayTypeAdapter.FACTORY);
  }

  public get serializeNulls(): boolean {
    return this._serializeNulls;
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
  public fromJson<T>(json: any[], type: any[]): any[];
  public fromJson<T>(json: any[], type: ClassType<T>): T[];
  public fromJson<T>(json: object, type: ClassType<T>): T;
  public fromJson<T>(json: any[] | object, type: any[] | ClassType<T>): any[] | T[] | T | undefined {
    // If we are in the second case (any[] and ClassType),
    // we need to wrap the type into an array, in order to start
    // with the correct adapter. This allows us to keep the API cleaner.
    if (json instanceof Array && !(type instanceof Array)) {
      type = [type];
    }

    return this.getAdapter(new TypeToken(type)).fromJson(json);
  }

  /**
   * This method serializes the specified object, into its equivalent JSON representation.
   *
   * @param src the object|array for which JSON representation is to be created
   * @param type the specific type of src (required for arrays)
   * @returns JSON representation of src
   * @memberof Tyson
   */
  public toJson(src: any[], type: ClassType<any> | any[]): any[];
  public toJson(src: object, type?: ClassType<any>): any;
  public toJson(src: any[] | object, type?: ClassType<any> | any[]): any[] | any {
    const typeToken = new TypeToken(type || (src as any).constructor);
    return this.getAdapter(typeToken).toJson(src);
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

    for (const factory of this._factories) {
      const candidate = factory.create(this, typeToken);
      if (candidate !== undefined) {
        this._typeTokenCache.set(typeToken.hash, candidate);
        return candidate;
      }
    }
    throw new Error('Tyson cannot handle ' + typeToken.hash);
  }
}
