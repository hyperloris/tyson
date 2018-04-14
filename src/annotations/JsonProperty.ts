import { Constants } from "../Constants";
import { PropertyMetadata } from "../reflect/PropertyMetadata";

/**
 * An annotation that indicates this property should be serialized/deserialized
 * following the specified name and/or type.
 *
 * Here is an example:
 * class MyClass {
 *   @JsonProperty("name")
 *   a: string = undefined;
 *   @JsonProperty({ name: "name1", type: [Number] })
 *   b: number[] = undefined;
 * }
 *
 * { "name": "value", "name1": [4, 8, 15, 16, 23, 42] } // The corresponding JSON
 *
 * @export
 * @template T
 * @param {(PropertyMetadata<T> | string)} [metadata]
 * @returns {*}
 */
export function JsonProperty<T>(metadata?: PropertyMetadata<T> | string): any {
  if (typeof metadata === "string") {
    return Reflect.metadata(Constants.JSON_PROPERTY_METADATA_KEY, {
      name: metadata,
      type: undefined
    });
  } else {
    return Reflect.metadata(Constants.JSON_PROPERTY_METADATA_KEY, {
      name: metadata ? metadata.name : undefined,
      type: metadata ? metadata.type : undefined
    });
  }
}
