import { Access } from '../annotations/jsonProperty';
import { Constants } from '../constants';
import { JsonPropertyMetadata } from '../reflect/jsonPropertyMetadata';
import { ReflectionUtils } from '../reflect/reflectionUtils';
import { ClassType, TypeToken } from '../reflect/typeToken';
import { TypeAdapter } from '../typeAdapter';
import { TypeAdapterFactory } from '../typeAdapterFactory';
import { Tyson } from '../tyson';
import { DeserializationError } from './../exceptions/deserializationError';

export class ObjectTypeAdapter extends TypeAdapter<any> {
  static readonly FACTORY: TypeAdapterFactory = {
    create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined {
      if (typeof typeToken.type === Constants.FUNCTION_TYPE_LOWERCASE) {
        return new ObjectTypeAdapter(tyson, typeToken);
      }
      return undefined;
    },
  };

  private _tyson: Tyson;
  private _typeToken: TypeToken<any>;
  private _jsonPropertyMetadataMap: Map<string, JsonPropertyMetadata>;

  constructor(tyson: Tyson, typeToken: TypeToken<any>) {
    super();
    this._tyson = tyson;
    this._typeToken = typeToken;
    this._jsonPropertyMetadataMap = new Map();
    this.loadMetadata();
  }

  protected _fromJson(json: any): any {
    const obj = new (this._typeToken.type as ClassType<any>)();
    for (const entry of Array.from(this._jsonPropertyMetadataMap.entries())) {
      const objKey = entry[0];
      const metadata = entry[1];
      const jsonKey = metadata.name || objKey;
      const innerJson = json[jsonKey];
      const typeToken = new TypeToken(metadata.type);

      // These are all blocking checks
      const existsOnJson = json.hasOwnProperty(jsonKey);
      if (metadata.access === Access.TOJSON_ONLY || !existsOnJson) {
        if (!existsOnJson && metadata.required) {
          throw new DeserializationError(
            `Property '${objKey}' of ${obj.constructor.name} is set as required, but missing on the JSON.`,
          );
        } else {
          continue;
        }
      }

      try {
        obj[objKey] = metadata.ignoreType ? innerJson : this._tyson.getAdapter(typeToken).fromJson(innerJson);
      } catch (err) {
        if (err instanceof DeserializationError) {
          throw new DeserializationError(
            `Property '${objKey}' of ${obj.constructor.name} does not match type of '${jsonKey}'.`,
            json,
          );
        } else {
          throw err;
        }
      }
    }
    return obj;
  }

  protected _toJson(src: any): any {
    const obj: any = {};
    for (const key in src) {
      const metadata = this._jsonPropertyMetadataMap.get(key);

      if (metadata && metadata.access !== Access.FROMJSON_ONLY) {
        const jsonKey = metadata.name || key;
        const typeToken = new TypeToken(metadata.type);
        const value = metadata.ignoreType ? src[key] : this._tyson.getAdapter(typeToken).toJson(src[key]);

        // The default behavior is to ignore properties with a null or undefined values,
        // unless it is set differently with the builder.
        if (value === null && !this._tyson.serializeNulls) {
          continue;
        }

        obj[jsonKey] = value;
      }
    }
    return obj;
  }

  /**
   * This method extracts all the metadata of the class and saves them in a map.
   * In this way the reflection operations are performed only once when the adapter is created.
   */
  private loadMetadata(): void {
    const obj = new (this._typeToken.type as ClassType<any>)();
    for (const key of Object.keys(obj)) {
      const metadata = ReflectionUtils.getJsonPropertyMetadata(obj, key);
      if (!metadata) {
        continue;
      }

      this._jsonPropertyMetadataMap.set(key, metadata);
    }
  }
}
