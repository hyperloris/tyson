import { TypeAdapter } from "./typeAdapter";
import { TypeAdapterFactory } from "./typeAdapterFactory";
import { TypeAdapters } from "./adapters/typeAdapters";
import { TypeToken } from "./reflect/typeToken";
import { Tyson } from "./tyson";

/**
 * Use this builder to construct a Tyson instance when you need to set configuration
 * options other than the default.
 *
 * Here is an example:
 * <pre>
 * const tyson = new TysonBuilder()
 *   .registerTypeAdapter(Point, pointAdapter)
 *   .registerTypeAdapter(User, userAdapter)
 *   .build();
 * </pre>
 *
 * @export
 * @class TysonBuilder
 */
export class TysonBuilder {
  private _factories: Array<TypeAdapterFactory>;

  constructor() {
    this._factories = new Array();
  }

  public get factories() {
    return this._factories;
  }

  /**
   * This method register a new type adapter for a specific type.
   * You can use this to configure Tyson for custom serialization or deserialization.
   * If a type adapter was previously registered for the specified type,
   * it is overwritten (even the built-in).
   *
   * @template T
   * @param {{new(): T; }} type the type for the type adapter being registered
   * @param {TypeAdapter<T>} typeAdapter
   * @returns {TysonBuilder} a reference to this TysonBuilder
   * @memberof TysonBuilder
   */
  public registerTypeAdapter<T>(type: {new(): T; }, typeAdapter: TypeAdapter<T>): TysonBuilder {
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
   * Returns a new instance of Tyson configured with the options currently set in this builder.
   *
   * @returns {Tyson} a Tyson instance
   * @memberof TysonBuilder
   */
  public build(): Tyson {
    return new Tyson(this);
  }
}
