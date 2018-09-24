import { ClassType } from "../reflect/typeToken";
import { Constants } from "../constants";

export enum Access {
  FROMJSON_ONLY = "FROMJSON_ONLY",
  TOJSON_ONLY = "TOJSON_ONLY"
}

export interface JsonPropertyOptions {
  name?: string;
  type?: ClassType<any> | any[];
  access?: Access;
}

/**
 * An annotation that indicates this property should be serialized/deserialized
 * following the specified name and/or type.
 *
 * Here is an example:
 * <pre>
 * class MyClass {
 *   @JsonProperty("name")
 *   a: string = undefined;
 *   @JsonProperty({ name: "name1", type: [Number] })
 *   b: number[] = undefined;
 * }
 *
 * { "name": "value", "name1": [4, 8, 15, 16, 23, 42] } // The corresponding JSON
 * </pre>
 *
 * @export
 * @param {(JsonPropertyOptions | string)} [options]
 * @returns {*}
 */
export function JsonProperty(options?: JsonPropertyOptions | string): any {
  if (typeof options === "string") {
    return Reflect.metadata(Constants.JSON_PROPERTY_METADATA_KEY, {
      name: options,
      type: undefined,
      access: undefined
    });
  } else {
    return Reflect.metadata(Constants.JSON_PROPERTY_METADATA_KEY, {
      name: options ? options.name : undefined,
      type: options ? options.type : undefined,
      access: options ? options.access : undefined
    });
  }
}
