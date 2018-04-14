import { Constants } from "../constants";
import { DeserializationError } from "./../exceptions/deserializationError";
import { PropertyMetadata } from "./../reflect/propertyMetadata";
import { ReflectionUtils } from "../reflect/reflectionUtils";
import { TypeAdapter } from "../typeAdapter";
import { TypeAdapterFactory } from "../typeAdapterFactory";
import { TypeToken } from "../reflect/typeToken";
import { Tyson } from "../tyson";

export class ObjectTypeAdapter implements TypeAdapter<any> {
  static readonly FACTORY: TypeAdapterFactory = {
    create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined {
      if (typeToken.name === Constants.OBJECT_TYPE) {
        return new ObjectTypeAdapter(tyson, typeToken);
      }
      return undefined;
    }
  };

  private _tyson: Tyson;
  private _typeToken: TypeToken<any>;
  private _objectMap: Map<string, PropertyMetadata<any>>;

  constructor(tyson: Tyson, typeToken: TypeToken<any>) {
    this._tyson = tyson;
    this._typeToken = typeToken;
    this._objectMap = new Map();
    this.reflect();
  }

  public write(src: any): any {
    const jsonObj: any = {};
    for (let key in src) {
      const metadata = this._objectMap.get(key);
      if (metadata === undefined) {
        jsonObj[key] = src[key];
      } else {
        const jsonKey = metadata.name || key;
        const typeToken = new TypeToken(metadata.type);
        jsonObj[jsonKey] = this._tyson.getAdapter(typeToken).write(src[key]);
      }
    }
    return jsonObj;
  }

  public read(json: any): any {
    const obj = new (this._typeToken.type as { new(): any; })();
    for (let entry of Array.from(this._objectMap.entries())) {
      const objKey = entry[0];
      const metadata = entry[1];

      if (metadata === undefined) {
        // If there are no metadata, there is nothing to do
        obj[objKey] = json[objKey];
      } else {
        const jsonKey = metadata.name || objKey;
        const innerJson = json[jsonKey];
        const typeToken = new TypeToken(metadata.type);

        try {
          obj[objKey] = this._tyson.getAdapter(typeToken).read(innerJson);
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
    }
    return obj;
  }

  /**
   * This method extracts all the metadata of the class and saves them in a map.
   * In this way the reflection operations are performed only once when the adapter is created.
   */
  private reflect(): void {
    const obj = new (this._typeToken.type as { new(): any; })();
    for (let key of Object.keys(obj)) {
      const metadata = ReflectionUtils.getMetadata(obj, key);

      if (metadata === undefined) {
        this._objectMap.set(key, metadata);
        continue;
      }

      // If there is no type we take the one injected by the compiler
      if (metadata.type === undefined) {
        metadata.type = ReflectionUtils.getType(obj, key);
      }

      this._objectMap.set(key, metadata);
    }
  }
}
