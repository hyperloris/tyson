import { TypeAdapter } from "./typeAdapter";
import { TypeToken } from "./reflect/typeToken";
import { Tyson } from "./tyson";

/**
 * Creates type adapters for set of related types. Type adapter factories are 
 * most useful when several types share similar structure in their JSON form.
 * 
 * If a factory cannot support a given type, it must return undefined when 
 * that type is passed to {@link TypeAdapterFactory.create}. Factories should 
 * expect create() to be called on them for many types and should return undefined 
 * for most of those types.
 * 
 * As with type adapters, factories must be registered with a {@link TysonBuilder} 
 * for them to take effect:
 * <pre>
 * const tysonBuilder = new TysonBuilder();
 *   .registerTypeAdapterFactory(new MyTypeAdapterFactory())
 *   .build();
 * </pre>
 *
 * @export
 * @interface TypeAdapterFactory
 */
export interface TypeAdapterFactory {
  create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined;
}
