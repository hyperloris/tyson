/**
 * Converts TypeScript objects to and from JSON.
 * If the default conversion is not appropriate for a type,
 * extend this class to customize the conversion.
 *
 * Here is an example:
 * <pre>
 * class PointAdapter implements TypeAdapter<Point> {
 *   fromJson(json: any): Point {
 *     return new Point(json[0], json[1]);
 *   }
 *   toJson(src: Point): any {
 *     return [src.lat, src.lon];
 *   }
 * }
 * </pre>
 *
 * @export
 * @interface TypeAdapter
 * @template T
 */
export interface TypeAdapter<T> {
  fromJson(json: any): T | T[];
  toJson(src: T): any;
}
