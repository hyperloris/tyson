import { Access } from '../annotations/jsonProperty';
import { ClassType } from './typeToken';

export class JsonPropertyMetadata {
  constructor(
    public name: string,
    public type: ClassType<any> | any[],
    public access: Access,
    public required: boolean,
    public ignoreType: boolean,
  ) {}
}
