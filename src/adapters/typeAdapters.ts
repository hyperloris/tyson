import { Constants } from '../constants';
import { Type } from '../interfaces';
import { TypeToken } from '../reflect/typeToken';
import { TypeAdapter } from '../typeAdapter';
import { TypeAdapterFactory } from '../typeAdapterFactory';
import { Tyson } from '../tyson';
import { DeserializationError } from './../exceptions/deserializationError';

class BOOLEAN extends TypeAdapter<boolean> {
  protected _fromPlain(json: any): boolean {
    if (typeof json !== Constants.BOOLEAN_TYPE_LOWERCASE) {
      throw new DeserializationError(`Value '${json}' does not match the expected type: boolean.`);
    }
    return json;
  }
  protected _toPlain(src: boolean) {
    return src;
  }
}

class NUMBER extends TypeAdapter<number> {
  protected _fromPlain(json: any): number {
    if (typeof json !== Constants.NUMBER_TYPE_LOWERCASE) {
      throw new DeserializationError(`Value '${json}' does not match the expected type: number.`);
    }
    return json;
  }
  protected _toPlain(src: number) {
    return src;
  }
}

class STRING extends TypeAdapter<string> {
  protected _fromPlain(json: any): string {
    if (typeof json !== Constants.STRING_TYPE_LOWERCASE) {
      throw new DeserializationError(`Value '${json}' does not match the expected type: string.`);
    }
    return json;
  }
  protected _toPlain(src: string) {
    return src;
  }
}

class DATE extends TypeAdapter<Date> {
  protected _fromPlain(json: any): Date {
    return new Date(json);
  }
  protected _toPlain(src: Date) {
    return src.getTime();
  }
}

export class TypeAdapters {
  static BOOLEAN_FACTORY = TypeAdapters.newFactory(Boolean, new BOOLEAN());
  static NUMBER_FACTORY = TypeAdapters.newFactory(Number, new NUMBER());
  static STRING_FACTORY = TypeAdapters.newFactory(String, new STRING());
  static DATE_FACTORY = TypeAdapters.newFactory(Date, new DATE());

  static newFactory<TT>(type: Type<TT> | TypeToken<TT>, typeAdapter: TypeAdapter<TT>): TypeAdapterFactory {
    if (!(type instanceof TypeToken)) {
      type = new TypeToken(type);
    }
    return {
      create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined {
        return typeToken.hash === (type as TypeToken<TT>).hash ? (typeAdapter as any) : undefined;
      },
    };
  }
}
