/**
 * Converts TypeScript objects to and from JSON.
 * If the default conversion is not appropriate for a type,
 * extend this class to customize the conversion.
 *
 * Here is an example:
 * <pre>
 * class PointAdapter extends TypeAdapter<Point> {
 *   protected _fromJson(json: any): Point {
 *     return new Point(json[0], json[1]);
 *   }
 *   protected _toJson(src: Point): any {
 *     return [src.lat, src.lon];
 *   }
 * }
 * </pre>
 *
 * @export
 * @interface TypeAdapter
 * @template T
 */
export abstract class TypeAdapter<T> {
  public fromJson(json: any): T | T[] | undefined {
    if (json === null) {
      return undefined;
    }
    return this._fromJson(json);
  }

  public toJson(src: T): any {
    if (src === null || src === undefined) {
      return null;
    } else {
      return this._toJson(src);
    }
  }

  protected abstract _fromJson(json: any): T | T[];
  protected abstract _toJson(src: T): any;
}
