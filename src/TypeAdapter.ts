export interface TypeAdapter<T> {
  write(src: T): any;
  read(json: any): T | T[];
}
