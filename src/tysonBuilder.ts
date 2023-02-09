import { TypeAdapters } from './adapters/typeAdapters';
import { Constants } from './constants';
import { Type } from './interfaces';
import { TypeToken } from './reflect/typeToken';
import { TypeAdapter } from './typeAdapter';
import { TypeAdapterFactory } from './typeAdapterFactory';
import { Tyson } from './tyson';

/**
 * Use this builder to construct a Tyson instance when you need to set configuration
 * options other than the default.
 *
 * Here is an example:
 * <pre>
 * const tyson = new TysonBuilder()
 *   .registerTypeAdapter(Point, pointAdapter)
 *   .registerTypeAdapter(User, userAdapter)
 *   .enableNullsSerialization()
 *   .build();
 * </pre>
 *
 * @export
 * @class TysonBuilder
 */
export class TysonBuilder {
  private _factories: Array<TypeAdapterFactory>;
  private _serializeNulls = Constants.DEFAULT_SERIALIZE_NULLS;

  constructor() {
    this._factories = [];
  }

  public get factories() {
    return this._factories;
  }

  public get serializeNulls() {
    return this._serializeNulls;
  }

  /**
   * This method register a new type adapter for a specific type.
   * You can use this to configure Tyson for custom serialization or deserialization.
   * If a type adapter was previously registered for the specified type,
   * it is overwritten (even the built-in).
   *
   * @template T
   * @param {Type<T>} type the type for the type adapter being registered
   * @param {TypeAdapter<T>} typeAdapter
   * @returns {TysonBuilder} a reference to this TysonBuilder
   * @memberof TysonBuilder
   */
  public registerTypeAdapter<T>(type: Type<T>, typeAdapter: TypeAdapter<T>): TysonBuilder {
    this._factories.push(TypeAdapters.newFactory(new TypeToken(type), typeAdapter));
    return this;
  }

  /**
   * Register a factory.
   *
   * @param {TypeAdapterFactory} factory
   * @returns {TysonBuilder} a reference to this TysonBuilder
   * @memberof TysonBuilder
   */
  public registerTypeAdapterFactory(factory: TypeAdapterFactory): TysonBuilder {
    this._factories.push(factory);
    return this;
  }

  /**
   * Configure Tyson to serialize null fields. By default, Tyson omits all fields that are null
   * during serialization.
   *
   * @returns {TysonBuilder} a reference to this TysonBuilder
   * @memberof TysonBuilder
   */
  public enableNullsSerialization(): TysonBuilder {
    this._serializeNulls = true;
    return this;
  }

  /**
   * Returns a new instance of Tyson configured with the options currently set in this builder.
   *
   * @returns {Tyson} a Tyson instance
   * @memberof TysonBuilder
   */
  public build(): Tyson {
    return new Tyson(this);
  }
}
