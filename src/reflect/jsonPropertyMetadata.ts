import { Access } from '../annotations/jsonProperty';
import { Type } from '../interfaces';

export class JsonPropertyMetadata {
  constructor(
    public name: string,
    public type: Type<any> | any[],
    public access: Access,
    public required: boolean,
    public ignoreType: boolean,
  ) {}
}
