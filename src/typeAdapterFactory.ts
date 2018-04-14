import { TypeAdapter } from "./typeAdapter";
import { TypeToken } from "./reflect/typeToken";
import { Tyson } from "./tyson";

export interface TypeAdapterFactory {
  create<T>(tyson: Tyson, typeToken: TypeToken<T>): TypeAdapter<T> | undefined;
}
