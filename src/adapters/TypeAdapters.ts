import { Constants } from "../Constants";
import { DeserializationError } from "./../exceptions/DeserializationError";
import { TypeAdapter } from "../TypeAdapter";
import { TypeAdapterFactory } from "../TypeAdapterFactory";
import { TypeToken } from "../reflect/TypeToken";
import { Tyson } from "../Tyson";

export class TypeAdapters {

  static readonly BOOLEAN: TypeAdapter<boolean> = {
    write(src: boolean): any {
      return src;
    },
    read(json: any): boolean {
      if (typeof json !== Constants.BOOLEAN_TYPE_LOWERCASE) {
        throw new DeserializationError(
          `Value '${json}' does not match the expected type: boolean.`
        );
      }
      return json;
    }
  };

  static readonly NUMBER: TypeAdapter<number> = {
    write(src: number): any {
      return src;
    },
    read(json: any): number {
      if (typeof json !== Constants.NUMBER_TYPE_LOWERCASE) {
        throw new DeserializationError(
          `Value '${json}' does not match the expected type: number.`
        );
      }
      return json;
    }
  };

  static readonly STRING: TypeAdapter<string> = {
    write(src: string): any {
      return src;
    },
    read(json: any): string {
      if (typeof json !== Constants.STRING_TYPE_LOWERCASE) {
        throw new DeserializationError(
          `Value '${json}' does not match the expected type: string.`
        );
      }
      return json;
    }
  };

  static BOOLEAN_FACTORY = TypeAdapters.newFactory(Boolean, TypeAdapters.BOOLEAN);
  static NUMBER_FACTORY = TypeAdapters.newFactory(Number, TypeAdapters.NUMBER);
  static STRING_FACTORY = TypeAdapters.newFactory(String, TypeAdapters.STRING);

  static newFactory<TT>(type: {new(): TT; } | TypeToken<TT>, typeAdapter: TypeAdapter<TT>): TypeAdapterFactory {
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
