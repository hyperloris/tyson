import { Constants } from "../constants";
import { DeserializationError } from "./../exceptions/deserializationError";
import { TypeAdapter } from "../typeAdapter";
import { TypeAdapterFactory } from "../typeAdapterFactory";
import { TypeToken, ClassType } from "../reflect/typeToken";
import { Tyson } from "../tyson";

class BOOLEAN extends TypeAdapter<boolean> {
  protected _fromJson(json: any): boolean {
    if (typeof json !== Constants.BOOLEAN_TYPE_LOWERCASE) {
      throw new DeserializationError(`Value '${json}' does not match the expected type: boolean.`);
    }
    return json;
  }
  protected _toJson(src: boolean) {
    return src;
  }
}

class NUMBER extends TypeAdapter<number> {
  protected _fromJson(json: any): number {
    if (typeof json !== Constants.NUMBER_TYPE_LOWERCASE) {
      throw new DeserializationError(`Value '${json}' does not match the expected type: number.`);
    }
    return json;
  }
  protected _toJson(src: number) {
    return src;
  }
}

class STRING extends TypeAdapter<string> {
  protected _fromJson(json: any): string {
    if (typeof json !== Constants.STRING_TYPE_LOWERCASE) {
      throw new DeserializationError(`Value '${json}' does not match the expected type: string.`);
    }
    return json;
  }
  protected _toJson(src: string) {
    return src;
  }
}

class DATE extends TypeAdapter<Date> {
  protected _fromJson(json: any): Date {
    return new Date(json);
  }
  protected _toJson(src: Date) {
    return src.getTime();
  }
}

export class TypeAdapters {
  static BOOLEAN_FACTORY = TypeAdapters.newFactory(Boolean, new BOOLEAN());
  static NUMBER_FACTORY = TypeAdapters.newFactory(Number, new NUMBER());
  static STRING_FACTORY = TypeAdapters.newFactory(String, new STRING());
  static DATE_FACTORY = TypeAdapters.newFactory(Date, new DATE());

  static newFactory<TT>(type: ClassType<TT> | TypeToken<TT>, typeAdapter: TypeAdapter<TT>): TypeAdapterFactory {
    let factory: TypeAdapterFactory;
    if (type instanceof TypeToken) {
      factory = {
        create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined {
          return type.hash === typeToken.hash ? (typeAdapter as any) as TypeAdapter<T> : undefined;
        }
      };
    } else {
      factory = {
        create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined {
          return typeToken.equalsByType(type) ? (typeAdapter as any) as TypeAdapter<T> : undefined;
        }
      };
    }
    return factory;
  }
}
