import { TypeAdapter } from "./TypeAdapter";
import { TypeToken } from "./reflect/TypeToken";
import { Tyson } from "./Tyson";

export interface TypeAdapterFactory {
  create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined;
}
