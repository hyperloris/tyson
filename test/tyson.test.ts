import { JsonProperty } from "../src/annotations/JsonProperty";
import { TypeAdapter } from "./../src/TypeAdapter";
import { Tyson } from "../src/Tyson";
import { TysonBuilder } from "./../src/TysonBuilder";

/**
 * Tyson test
 */
describe("Tyson test", () => {
  it("Tyson is instantiable", () => {
    expect(new Tyson()).toBeInstanceOf(Tyson);
  });
});

describe("Testing fromJson vs", () => {

  it("Simple object with no annotations", () => {
    const json = {
      "name": "Bologna",
      "population": 388884,
      "beautiful": true
    };

    class City {
      name: string = "";
      population: number = 0;
      beautiful: boolean = false;
    }

    const city = new Tyson().fromJson(json, City);
    expect(city.name).toBe("Bologna");
    expect(city.population).toBe(388884);
    expect(city.beautiful).toBe(true);
  });

  it("Simple object with functions and no annotations", () => {
    const json = {
      "name": "Bologna",
      "population": 388884,
      "beautiful": true
    };

    class City {
      private name: string = "";
      private population: number = 0;
      private beautiful: boolean = false;

      public isBeautiful(): boolean {
        return this.beautiful;
      }

      public getDescription(): string {
        return `${this.name} has ${this.population} inhabitants.`;
      }
    }

    const city = new Tyson().fromJson(json, City);
    expect(city.isBeautiful()).toBe(true);
    expect(city.getDescription()).toBe("Bologna has 388884 inhabitants.");
  });

  it("Simple object with functions and JsonProperty annotations", () => {
    const json = {
      "_name": "Bologna",
      "ppltn": 388884,
      "awesome": true,
      "website": "http://bologna.it",
    };

    class City {
      @JsonProperty("_name")
      name: string = "";
      @JsonProperty("ppltn")
      population: number = 0;
      @JsonProperty("awesome")
      private beautiful: boolean = false;
      private website: string = "";

      public isBeautiful(): boolean {
        return this.beautiful;
      }

      public getWebsite(): string {
        return this.website;
      }

      public getDescription(): string {
        return `${this.name} has ${this.population} inhabitants.`;
      }
    }

    const city = new Tyson().fromJson(json, City);
    expect(city.isBeautiful()).toBe(true);
    expect(city.getWebsite()).toBe("http://bologna.it");
    expect(city.getDescription()).toBe("Bologna has 388884 inhabitants.");
  });

  it("Object with functions, JsonProperty annotations and 1 child", () => {
    const json = {
      "_name": "Bologna",
      "fractions": ["Barbiano", "Bertalìa", "Borgo Panigale"],
      "mayor": {
        "ID": 35,
        "name": "Virginio Merola"
      }
    };

    class User {
      @JsonProperty("ID")
      private id: number = undefined;
      private name: string = undefined;

      public toString(): string {
        return `id=${this.id}, name=${this.name}`;
      }
    }

    class City {
      @JsonProperty("_name")
      private name: string = undefined;
      @JsonProperty({ name: "fractions", type: [String] })
      private wards: string[] = undefined;
      @JsonProperty()
      private mayor: User = undefined;

      public getName(): string {
        return this.name;
      }

      public getWards(): string[] {
        return this.wards;
      }

      public getMayor(): User {
        return this.mayor;
      }
    }

    const city = new Tyson().fromJson(json, City);
    expect(city.getName()).toBe("Bologna");
    expect(city.getWards()).toHaveLength(3);
    expect(city.getWards()[1]).toBe("Bertalìa");
    expect(city.getMayor().toString()).toBe("id=35, name=Virginio Merola");
  });

  it("Object with functions, JsonProperty annotations and 1 array of children", () => {
    const json = {
      "_name": "Bologna",
      "mayors": [{
        "ID": 35,
        "name": "Virginio Merola"
      }, {
        "ID": 41,
        "name": "Flavio Delbono"
      }, {
        "ID": 23,
        "name": "Sergio Cofferati"
      }]
    };

    class User {
      @JsonProperty("ID")
      private id: number = undefined;
      private name: string = undefined;

      public toString(): string {
        return `id=${this.id}, name=${this.name}`;
      }
    }

    class City {
      @JsonProperty("_name")
      private name: string = undefined;
      @JsonProperty({ type: [User] })
      private mayors: User[] = undefined;

      public getName(): string {
        return this.name;
      }

      public getMayors(): User[] {
        return this.mayors;
      }
    }

    const city = new Tyson().fromJson(json, City);
    expect(city.getMayors()).toHaveLength(3);
    expect(city.getMayors()[2].toString()).toBe("id=23, name=Sergio Cofferati");
  });

  it("Tyson instance with 1 custom TypeAdapter registered", () => {
    const json = {
      "_name": "Bologna",
      "coords": [44.498955, 11.327591]
    };

    class Point {
      private lat: number = undefined;
      private lon: number = undefined;

      constructor(lat?: number, lon?: number) {
        this.lat = lat;
        this.lon = lon;
      }

      public toString(): string {
        return `lat=${this.lat}, lon=${this.lon}`;
      }
    }

    class City {
      @JsonProperty("_name")
      private name: string = undefined;
      @JsonProperty("coords")
      private point: Point = undefined;

      public getPoint(): Point {
        return this.point;
      }
    }

    const pointAdapter: TypeAdapter<Point> = {
      write(): void { /* Empty */ },
      read(json: any): Point {
        return new Point(json[0], json[1]);
      }
    };

    const tyson = new TysonBuilder().registerTypeAdapter(Point, pointAdapter).build();
    const city = tyson.fromJson(json, City);
    expect(city.getPoint().toString()).toBe("lat=44.498955, lon=11.327591");
  });
});

describe("Testing toJson vs", () => {
  // TODO
});
