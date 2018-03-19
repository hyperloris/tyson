import { Constants } from "../Constants";
import { PropertyMetadata } from "./PropertyMetadata";

export class ReflectionUtils {
  public static getMetadata<T>(target: any, propertyKey: string): PropertyMetadata<T> {
    return Reflect.getMetadata(Constants.JSON_PROPERTY_METADATA_KEY, target, propertyKey);
  }

  public static getType(target: any, propertyKey: string): any {
    return Reflect.getMetadata("design:type", target, propertyKey);
  }

  public static getTypeName(target: any): string {
    return target instanceof Array ? Constants.ARRAY_TYPE : target.toString().trim().split(/[\s\()]/g)[1];
  }

  public static isBasicType(typeName: string): boolean {
    return [
      Constants.BOOLEAN_TYPE,
      Constants.NUMBER_TYPE,
      Constants.STRING_TYPE,
      Constants.ARRAY_TYPE
    ].indexOf(typeName) > -1;
  }
}
