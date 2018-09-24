import { Constants } from "../constants";
import { JsonPropertyMetadata } from "./jsonPropertyMetadata";

export class ReflectionUtils {
  public static getJsonPropertyMetadata(target: any, propertyKey: string): JsonPropertyMetadata | undefined {
    const metadata = Reflect.getMetadata(Constants.JSON_PROPERTY_METADATA_KEY, target, propertyKey);
    if (!metadata) {
      return undefined;
    }
    return new JsonPropertyMetadata(
      metadata.name,
      metadata.type || ReflectionUtils.getType(target, propertyKey),
      metadata.access
    );
  }

  public static getType(target: any, propertyKey: string): any {
    return Reflect.getMetadata("design:type", target, propertyKey);
  }

  public static getTypeName(target: any): string {
    return target instanceof Array
      ? Constants.ARRAY_TYPE
      : target
          .toString()
          .trim()
          .split(/[\s\()]/g)[1];
  }

  public static getTypeHash(target: any): string {
    let res = "";
    if (target instanceof Array) {
      res += "Array:(";
    } else {
      return ReflectionUtils.getTypeName(target);
    }

    for (let i = 0; i < target.length; i++) {
      const type = target[i];
      if (i !== 0) res += "+";
      if (type instanceof Array) {
        res += this.getTypeHash(type) + ")";
      } else {
        res += ReflectionUtils.getTypeName(type);
      }
    }
    return res + ")";
  }
}
