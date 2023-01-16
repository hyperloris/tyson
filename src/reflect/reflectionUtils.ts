import { Constants } from '../constants';
import { JsonPropertyMetadata } from './jsonPropertyMetadata';

export class ReflectionUtils {
  /**
   * Returns the {@link JsonProperty} metadata of the specified property, or undefined if they are not present.
   *
   * @static
   * @param {*} target the target object on which the metadata is defined
   * @param {string} propertyKey the property key for the target
   * @returns the metadata value for the metadata key if found; otherwise, undefined.
   * @memberof ReflectionUtils
   */
  public static getJsonPropertyMetadata(target: any, propertyKey: string): JsonPropertyMetadata | undefined {
    const metadata = Reflect.getMetadata(Constants.JSON_PROPERTY_METADATA_KEY, target, propertyKey);
    if (!metadata) {
      return undefined;
    }
    return new JsonPropertyMetadata(
      metadata.name,
      metadata.type || ReflectionUtils.getType(target, propertyKey),
      metadata.access,
      metadata.required,
      metadata.ignoreType,
    );
  }

  /**
   * This method returns the type of the specified object as injected by the compiler at design-time.
   *
   * @static
   * @param {*} target the target object
   * @param {string} propertyKey the property key for the target
   * @returns the injected type
   * @memberof ReflectionUtils
   */
  public static getType(target: any, propertyKey: string): any {
    return Reflect.getMetadata('design:type', target, propertyKey);
  }

  /**
   * This method returns the type name of the specified object.
   * A little hack, because some browsers do not support constructor.name (guess who?).
   *
   * @static
   * @param {*} target the target object
   * @returns the type name
   * @memberof ReflectionUtils
   */
  public static getTypeName(target: any): string {
    return target instanceof Array
      ? Constants.ARRAY_TYPE
      : target
          .toString()
          .trim()
          .split(/[\s\()]/g)[1];
  }

  /**
   * This method generate a "readable hash" of the specified object.
   * This hash is used as a key to save type adapters in the cache and to compare {@link TypeToken}.
   * Eg.
   * City -> City
   * [String] -> Array:(String)
   * [Number, Number, Boolean] -> Array:(Number+Number+Boolean)
   * [String, [Number, User], [User]] -> Array:(String+Array:(Number+User))+Array:(User)))
   *
   * This format is very helpful for debugging purposes.
   *
   * @static
   * @param {*} target the target object
   * @returns the generated hash of the target
   * @memberof ReflectionUtils
   */
  public static getTypeHash(target: any): string {
    let res = '';
    if (target instanceof Array) {
      res += 'Array:(';
    } else {
      return ReflectionUtils.getTypeName(target);
    }

    for (let i = 0; i < target.length; i++) {
      const type = target[i];
      if (i !== 0) res += '+';
      if (type instanceof Array) {
        res += this.getTypeHash(type) + ')';
      } else {
        res += ReflectionUtils.getTypeName(type);
      }
    }
    return res + ')';
  }
}
