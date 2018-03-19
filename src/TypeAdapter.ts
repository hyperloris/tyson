export interface TypeAdapter<T> {
  write(): void;
  read(json: any): T | T[];
}
