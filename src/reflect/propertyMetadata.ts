import { ClassType } from "./typeToken";

export interface PropertyMetadata<T> {
  name?: string;
  type: ClassType<T> | ClassType<T>[];
}
