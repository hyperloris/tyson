export interface PlainObject {
  [key: string]: Plain;
}

export type Plain = boolean | number | string | null | Array<Plain> | PlainObject;
