import { Constants } from "../constants";
import { PropertyMetadata } from "./propertyMetadata";

export class ReflectionUtils {
  public static getMetadata<T>(target: any, propertyKey: string): PropertyMetadata<T> {
    return Reflect.getMetadata(Constants.JSON_PROPERTY_METADATA_KEY, target, propertyKey);
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
