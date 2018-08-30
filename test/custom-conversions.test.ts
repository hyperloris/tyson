import { JsonProperty } from "../src/annotations/jsonProperty";
import { TypeAdapter } from "../src/typeAdapter";
import { TysonBuilder } from "../src/tysonBuilder";

describe("Testing Tyson with different builder configurations", () => {
  it("should convert the Point object according to the custom registered adapter", () => {
    class Point {
      lat: number = undefined;
      lon: number = undefined;
    }

    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty("coords")
      point: Point = undefined;
    }

    const city = new City();
    city.name = "Bologna";
    city.point = new Point();
    city.point.lat = 44.498955;
    city.point.lon = 11.327591;

    const json = {
      name: "Bologna",
      coords: [44.498955, 11.327591]
    };

    class PointAdapter extends TypeAdapter<Point> {
      protected _fromJson(json: any): Point {
        const point = new Point();
        point.lat = json[0];
        point.lon = json[1];
        return point;
      }
      protected _toJson(src: Point) {
        return [src.lat, src.lon];
      }
    }

    const tyson = new TysonBuilder()
      .registerTypeAdapter(Point, new PointAdapter())
      .build();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.point).toBeInstanceOf(Point);
    expect(xcity.point.lat).toBe(44.498955);
    expect(xcity.point.lon).toBe(11.327591);

    const xjson = tyson.toJson(city);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual(
      {
        name: "Bologna",
        coords: [44.498955, 11.327591]
      }
    );
  });

  it("should serialize nulls", () => {
    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty()
      population: number = undefined;
      @JsonProperty()
      beautiful: boolean = undefined;
      @JsonProperty({ type: [String] })
      fractions: string[] = undefined;
    }

    const city = new City();
    city.name = "Bologna";
    city.fractions = ["Barbiano", undefined, "Borgo Panigale", null];

    const tyson = new TysonBuilder()
      .enableNullsSerialization()
      .build();

    const xcity = tyson.toJson(city);
    expect(xcity).not.toBeInstanceOf(City);
    expect(xcity).toEqual(
      {
        name: "Bologna",
        population: null,
        beautiful: null,
        fractions: ["Barbiano", null, "Borgo Panigale", null]
      }
    );
  });
});