import { Constants } from "../Constants";
import { PropertyMetadata } from "../reflect/PropertyMetadata";

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
