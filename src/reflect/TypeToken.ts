import { Constants } from "../Constants";
import { ReflectionUtils } from "./ReflectionUtils";

export class TypeToken<T> {
  private _type: {new(): T; } | {new(): T; }[];
  private _name: string;
  private _hash: string;

  constructor(type: {new(): T; } | {new(): T; }[], name?: string) {
    this._type = type;
    this._name = name || this.generateName();
    this._hash = ReflectionUtils.getTypeName(this._type) + this._name;
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

  public equalsByType<TT>(other: { new (): TT }): boolean {
    return (
      ReflectionUtils.getTypeName(this._type) ===
      ReflectionUtils.getTypeName(other)
    );
  }

  private generateName(): string {
    if (this._type instanceof Array) {
      return ReflectionUtils.getTypeName(this._type[0]);
    } else {
      const typeName = ReflectionUtils.getTypeName(this._type);
      return ReflectionUtils.isBasicType(typeName)
        ? typeName
        : Constants.OBJECT_TYPE;
    }
  }
}
