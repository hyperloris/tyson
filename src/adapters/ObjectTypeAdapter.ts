import { Constants } from "../Constants";
import { DeserializationError } from "./../exceptions/DeserializationError";
import { PropertyMetadata } from "./../reflect/PropertyMetadata";
import { ReflectionUtils } from "../reflect/ReflectionUtils";
import { TypeAdapter } from "../TypeAdapter";
import { TypeAdapterFactory } from "../TypeAdapterFactory";
import { TypeToken } from "../reflect/TypeToken";
import { Tyson } from "../Tyson";

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

  public write(): void {
    throw new Error("Method not implemented.");
  }

  public read(json: any): any {
    const obj = new (this._typeToken.type as { new(): any; })();
    for (let entry of Array.from(this._objectMap.entries())) {
      const objKey = entry[0];
      const metadata = entry[1];

      // If there are no metadata, there is nothing we can do
      if (metadata === undefined) {
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
