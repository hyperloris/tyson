import { Constants } from "../constants";
import { DeserializationError } from "./../exceptions/deserializationError";
import { TypeAdapter } from "../typeAdapter";
import { TypeAdapterFactory } from "../typeAdapterFactory";
import { TypeToken } from "../reflect/typeToken";
import { Tyson } from "../tyson";

export class TypeAdapters {
  static readonly BOOLEAN: TypeAdapter<boolean> = {
    fromJson(json: any): boolean {
      if (typeof json !== Constants.BOOLEAN_TYPE_LOWERCASE) {
        throw new DeserializationError(`Value '${json}' does not match the expected type: boolean.`);
      }
      return json;
    },
    toJson(src: boolean): any {
      return src;
    }
  };

  static readonly NUMBER: TypeAdapter<number> = {
    fromJson(json: any): number {
      if (typeof json !== Constants.NUMBER_TYPE_LOWERCASE) {
        throw new DeserializationError(`Value '${json}' does not match the expected type: number.`);
      }
      return json;
    },
    toJson(src: number): any {
      return src;
    }
  };

  static readonly STRING: TypeAdapter<string> = {
    fromJson(json: any): string {
      if (typeof json !== Constants.STRING_TYPE_LOWERCASE) {
        throw new DeserializationError(`Value '${json}' does not match the expected type: string.`);
      }
      return json;
    },
    toJson(src: string): any {
      return src;
    }
  };

  static readonly DATE: TypeAdapter<Date> = {
    fromJson(json: any): Date {
      return new Date(json);
    },
    toJson(src: Date): any {
      return src.getTime();
    }
  };

  static BOOLEAN_FACTORY = TypeAdapters.newFactory(Boolean, TypeAdapters.BOOLEAN);
  static NUMBER_FACTORY = TypeAdapters.newFactory(Number, TypeAdapters.NUMBER);
  static STRING_FACTORY = TypeAdapters.newFactory(String, TypeAdapters.STRING);
  static DATE_FACTORY = TypeAdapters.newFactory(Date, TypeAdapters.DATE);

  static newFactory<TT>(type: { new (): TT } | TypeToken<TT>, typeAdapter: TypeAdapter<TT>): TypeAdapterFactory {
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
