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
 * With this type adapter installed, Tyson will convert a JSON
 * like [44.498955, 11.327591] to a Point object and vice-versa.
 *
 * To use a custom type adapter with Tyson, you must register it
 * with a {@link TysonBuilder}:
 * <pre>
 * const tyson = new TysonBuilder()
 *   .registerTypeAdapter(Point, new PointAdapter())
 *   .build();
 * </pre>
 *
 * @export
 * @interface TypeAdapter
 * @template T
 */
export abstract class TypeAdapter<T> {
  public fromPlain(json: any): T | T[] | undefined {
    if (json === null) {
      return undefined;
    }
    return this._fromPlain(json);
  }

  public toPlain(src: T): any {
    if (src === null || src === undefined) {
      return null;
    } else {
      return this._toPlain(src);
    }
  }

  protected abstract _fromPlain(json: any): T | T[];
  protected abstract _toPlain(src: T): any;
}
