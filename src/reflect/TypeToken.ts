import { Constants } from "../Constants";
import { ReflectionUtils } from "./ReflectionUtils";

export class TypeToken<T> {
  private _type: {new(): T; } | {new(): T; }[];
  private _name: string;
  private _hash: string;

  constructor(type: {new(): T; } | {new(): T; }[], name?: string) {
    this._type = type;
    this._name = name || this.generateName();
    this._hash = this.generateHash();
  }

  public static get<T>(type: {new(): T; }): TypeToken<T> {
    return new TypeToken(type, ReflectionUtils.getTypeName(type));
  }

  public get type(): {new(): T; } | {new(): T; }[] {
    return this._type;
  }

  public get name(): string {
    return this._name;
  }

  public get hash(): string {
    return this._hash;
  }

  public equalsByType(other: TypeToken<any>): boolean {
    return ReflectionUtils.getTypeName(this._type) === ReflectionUtils.getTypeName(other.type);
  }

  private generateName(): string {
    const typeName = ReflectionUtils.getTypeName(this._type);
    return ReflectionUtils.isBasicType(typeName) ? typeName : Constants.OBJECT_TYPE;
  }

  private generateHash(): string {
    let hash = this._type instanceof Array ? Constants.ARRAY_TYPE : "";
    hash += ReflectionUtils.getTypeName(this._type);
    hash += this._name;
    return hash;
  }
}
