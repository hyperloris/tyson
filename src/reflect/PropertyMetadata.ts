export interface PropertyMetadata<T> {
  name?: string;
  type: {new(): T; } | {new(): T; }[];
}
