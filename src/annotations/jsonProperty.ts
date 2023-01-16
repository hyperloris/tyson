import { Constants } from '../constants';
import { ClassType } from '../reflect/typeToken';

/**
 * Various options for property, specifying how property
 * may be accessed during serialization and deserialization.
 *
 * @export
 * @enum {number}
 */
export enum Access {
  /**
   * Access setting that means that the property may only be used
   * for deserialization: json -> class
   */
  FROMJSON_ONLY = 'FROMJSON_ONLY',

  /**
   * Access setting that means that the property may only be used
   * for serialization: class -> json
   */
  TOJSON_ONLY = 'TOJSON_ONLY',
}

/**
 * These are the options available for the {@link JsonProperty} annotation.
 *
 * @export
 * @interface JsonPropertyOptions
 */
export interface JsonPropertyOptions {
  /**
   * Indicates the name of the key on the JSON, this is very useful
   * if you need to have a different name on the class.
   * Eg. If you mark your private property with "_"
   */
  name?: string;

  /**
   * Specifies a type of the property.
   * This is mandatory for arrays (single and multi-type).
   * NOTE: if it's a Date object, you MUST specify the type!
   */
  type?: ClassType<any> | any[];

  /**
   * It can be used to force Tyson to ignore this property during
   * the serialization or deserialization process.
   */
  access?: Access;

  /**
   * Property that indicates whether a value is expected for property
   * during deserialization or not. If the value is missing on the JSON,
   * an exception is thrown.
   * Default value: false
   */
  required?: boolean;

  /**
   * Ignore the type of this property.
   * This means that during the deserialization process the content of the
   * json will be copied directly without any kind of check. The same thing
   * during serialization.
   * Default value: false
   */
  ignoreType?: boolean;
}

/**
 * An annotation that indicates this property should be serialized/deserialized
 * following the specified options.
 *
 * Here is an example:
 * <pre>
 * class City {
 *   @JsonProperty()
 *   name: string = undefined;
 *   @JsonProperty("_population")
 *   population: number = undefined;
 *   @JsonProperty({ access: Access.FROMJSON_ONLY })
 *   beautiful: boolean = undefined;
 * }
 * </pre>
 *
 * The following shows the output that is generated when serializing an instance of the
 * above example class:
 * <pre>
 * const city = new City();
 * city.name = "Bologna";
 * city.population = 388884;
 * city.beautiful = true;
 *
 * const tyson = new Tyson();
 * const json = tyson.toJson(city);
 * console.log(json);
 *
 * ===== OUTPUT =====
 * { name: "Bologna", _population: 388884 }
 * </pre>
 *
 * The following shows the result of the deserialization process:
 * <pre>
 * const city = tyson.fromJson({ name: "Bologna", _population: 388884, beautiful: true}, City);
 * expect(city).toBeInstanceOf(City);
 * expect(city.name).toBe("Bologna");
 * expect(city.population).toBe(388884);
 * expect(city.beautiful).toBe(true);
 * </pre>
 *
 * @export
 * @param {(JsonPropertyOptions | string)} [options]
 * @returns {*}
 */
export function JsonProperty(options?: JsonPropertyOptions | string): any {
  if (typeof options === 'string') {
    return Reflect.metadata(Constants.JSON_PROPERTY_METADATA_KEY, {
      name: options,
      type: undefined,
      access: undefined,
      required: undefined,
      ignoreType: undefined,
    });
  } else {
    return Reflect.metadata(Constants.JSON_PROPERTY_METADATA_KEY, {
      name: options ? options.name : undefined,
      type: options ? options.type : undefined,
      access: options ? options.access : undefined,
      required: options ? options.required : undefined,
      ignoreType: options ? options.ignoreType : undefined,
    });
  }
}
