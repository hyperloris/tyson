import { Constants } from "../constants";
import { DeserializationError } from "./../exceptions/deserializationError";
import { PropertyMetadata } from "./../reflect/propertyMetadata";
import { ReflectionUtils } from "../reflect/reflectionUtils";
import { TypeAdapter } from "../typeAdapter";
import { TypeAdapterFactory } from "../typeAdapterFactory";
import { TypeToken, ClassType } from "../reflect/typeToken";
import { Tyson } from "../tyson";

export class ObjectTypeAdapter extends TypeAdapter<any> {
  static readonly FACTORY: TypeAdapterFactory = {
    create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined {
      if (typeof typeToken.type === Constants.FUNCTION_TYPE_LOWERCASE) {
        return new ObjectTypeAdapter(tyson, typeToken);
      }
      return undefined;
    }
  };

  private _tyson: Tyson;
  private _typeToken: TypeToken<any>;
  private _metadataMap: Map<string, PropertyMetadata<any>>;

  constructor(tyson: Tyson, typeToken: TypeToken<any>) {
    super();
    this._tyson = tyson;
    this._typeToken = typeToken;
    this._metadataMap = new Map();
    this.reflect();
  }

  protected _fromJson(json: any): any {
    const obj = new (this._typeToken.type as ClassType<any>)();
    for (let entry of Array.from(this._metadataMap.entries())) {
      const objKey = entry[0];
      const metadata = entry[1];
      const jsonKey = metadata.name || objKey;
      const innerJson = json[jsonKey];
      const typeToken = new TypeToken(metadata.type);

      if (!json.hasOwnProperty(jsonKey)) {
        continue;
      }

      try {
        obj[objKey] = this._tyson.getAdapter(typeToken).fromJson(innerJson);
      } catch (err) {
        if (err instanceof DeserializationError) {
          throw new DeserializationError(
            `Property '${objKey}' of ${obj.constructor.name} does not match type of '${jsonKey}'.`,
            json
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
    for (let key in src) {
      const metadata = this._metadataMap.get(key);

      if (metadata) {
        const jsonKey = metadata.name || key;
        const typeToken = new TypeToken(metadata.type);
        const value = this._tyson.getAdapter(typeToken).toJson(src[key]);

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
  private reflect(): void {
    const obj = new (this._typeToken.type as ClassType<any>)();
    for (let key of Object.keys(obj)) {
      const metadata = ReflectionUtils.getMetadata(obj, key);

      if (!metadata) {
        continue;
      }

      // If there is no type we take the one injected by the compiler
      if (metadata.type === undefined) {
        metadata.type = ReflectionUtils.getType(obj, key);
      }

      this._metadataMap.set(key, metadata);
    }
  }
}
