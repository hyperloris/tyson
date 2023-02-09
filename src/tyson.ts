import 'reflect-metadata';

import { ArrayTypeAdapter } from './adapters/arrayTypeAdapter';
import { ObjectTypeAdapter } from './adapters/objectTypeAdapter';
import { TypeAdapters } from './adapters/typeAdapters';
import { Constants } from './constants';
import { Plain, Type } from './interfaces';
import { TypeToken } from './reflect/typeToken';
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
   * Converts a plain (literal) object into a class instance.
   * This method also works with arrays.
   *
   * @param plain - The plain object or array to convert
   * @param type - The constructor function of the target class
   * @returns The converted instance(s) of the target class
   */
  public fromPlain<T>(plain: Plain[], type: Type<T>): T[];
  public fromPlain<T>(plain: Plain, type: Type<T>): T;
  public fromPlain<T>(plain: Plain, type: Type<T>): T | T[] | undefined {
    const targetType = Array.isArray(plain) ? [type] : type;
    const typeToken = new TypeToken(targetType);
    return this.getAdapter(typeToken).fromPlain(plain);
  }

  /**
   * Converts a class instance to a plain (literal) object.
   * This method also works with arrays.
   *
   * @param src - The class instance(s) to convert
   * @param type - The constructor function of the target class.
   * If not specified, the type will be determined from the `src` parameter.
   * @returns The converted plain object or array
   */
  public toPlain(src: unknown[], type?: Type): Plain[];
  public toPlain(src: unknown, type?: Type): Plain;
  public toPlain(src: unknown, type?: Type): Plain {
    const targetType = type || (src as any).constructor;
    const typeToken = new TypeToken(targetType);
    return this.getAdapter(typeToken).toPlain(src);
  }

  /**
   * Deserializes a JSON string to a class instance.
   *
   * @param json - The JSON string to deserialize
   * @param type - The constructor function of the target class
   * @returns The instance of the target class
   */
  public fromJson<T>(json: string, type: Type<T>): T {
    const plain: Plain = JSON.parse(json);
    return this.fromPlain(plain, type);
  }

  /**
   * Deserializes a JSON string (array) to an array of class instances.
   *
   * @param json - The JSON string to deserialize
   * @param type - The constructor function of the target class
   * @returns An array of instances of the target class
   */
  public fromJsonArray<T>(json: string, type: Type<T>): T[] {
    const plain: Plain[] = JSON.parse(json);
    return this.fromPlain(plain, type);
  }

  /**
   * Serializes a class instance to its JSON string representation.
   * This method also works with arrays.
   *
   * @param src - The class instance(s) to serialize
   * @param type - The constructor function of the target class.
   * If not specified, the type will be determined from the `src` parameter.
   * @returns The JSON string
   */
  public toJson(src: unknown, type?: Type): string {
    const plain = this.toPlain(src, type);
    return JSON.stringify(plain);
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
