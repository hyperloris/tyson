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
      name: "Bologna",
      population: 388884,
      beautiful: true
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
      name: "Bologna",
      population: 388884,
      beautiful: true
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
      _name: "Bologna",
      ppltn: 388884,
      awesome: true,
      website: "http://bologna.it"
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
      _name: "Bologna",
      fractions: ["Barbiano", "Bertalìa", "Borgo Panigale"],
      mayor: {
        ID: 35,
        name: "Virginio Merola"
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
      _name: "Bologna",
      mayors: [
        {
          ID: 35,
          name: "Virginio Merola"
        },
        {
          ID: 41,
          name: "Flavio Delbono"
        },
        {
          ID: 23,
          name: "Sergio Cofferati"
        }
      ]
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

  it("Object with primitive types that differ from the json", () => {
    const json1 = {
      name: true,
      population: 388884,
      beautiful: true
    };

    const json2 = {
      name: "Bologna",
      population: "388884",
      beautiful: true
    };

    const json3 = {
      name: "Bologna",
      population: 388884,
      beautiful: 42
    };

    class City {
      @JsonProperty()
      private name: string = undefined;
      @JsonProperty()
      private population: number = undefined;
      @JsonProperty()
      private beautiful: boolean = undefined;
    }

    const tyson = new Tyson();
    try {
      tyson.fromJson(json1, City);
    } catch (err) {
      expect(err.message).toEqual(
        "Property 'name' of City does not match type of 'name'"
      );
    }
    try {
      tyson.fromJson(json2, City);
    } catch (err) {
      expect(err.message).toEqual(
        "Property 'population' of City does not match type of 'population'"
      );
    }
    try {
      tyson.fromJson(json3, City);
    } catch (err) {
      expect(err.message).toEqual(
        "Property 'beautiful' of City does not match type of 'beautiful'"
      );
    }
  });

  it("Array of objects with children and other arrays", () => {
    const json = [
      {
        name: "Bologna",
        population: 388884,
        fractions: ["Barbiano", "Bertalìa", "Borgo Panigale"],
        monuments: [
          { name: "Basilica di San Petronio", completed: 1663 },
          { name: "Università di Bologna", completed: 1088 },
          { name: "Fontana del Nettuno", completed: 1566 }
        ],
        mayor: {
          name: "Virginio Merola",
          age: 63
        }
      },
      {
        name: "Milano",
        population: 1365156,
        fractions: ["Arese", "Assago", "Baranzate"],
        monuments: [
          { name: "Duomo di Milano", completed: 1932 },
          { name: "Galleria Vittorio Emanuele II", completed: 1877 }
        ],
        mayor: {
          name: "Giuseppe Sala",
          age: 60
        }
      },
      {
        name: "Roma",
        population: 2874605,
        fractions: ["Albano Laziale", "Anguillara Sabazia", "Ardea"],
        monuments: [],
        mayor: {
          name: "Virginia Raggi",
          age: 40
        }
      }
    ];

    class Monument {
      private name: string = undefined;
      @JsonProperty("completed")
      private _completed: number = undefined;

      public toString(): string {
        return `name=${this.name}, completed=${this._completed}`;
      }
    }

    class User {
      @JsonProperty("name")
      private _name: string = undefined;
      @JsonProperty("age")
      private _age: number = undefined;

      public toString(): string {
        return `name=${this._name}, age=${this._age}`;
      }
    }

    class City {
      @JsonProperty("name")
      private _name: string = undefined;
      @JsonProperty("population")
      private _population: number = undefined;
      @JsonProperty({ name: "fractions", type: [String] })
      private _fractions: string[] = undefined;
      @JsonProperty({ name: "monuments", type: [Monument] })
      private _monuments: Monument[] = undefined;
      @JsonProperty({ name: "mayor", type: User })
      private _mayor: User = undefined;

      get fractions(): string[] {
        return this._fractions;
      }

      get monuments(): Monument[] {
        return this._monuments;
      }

      get mayor(): User {
        return this._mayor;
      }
    }

    const cities = new Tyson().fromJson(json, [City]);
    expect(cities).toHaveLength(3);
    expect(cities[1].fractions).toHaveLength(3);
    expect(cities[1].fractions[2]).toBe("Baranzate");
    expect(cities[2].mayor.toString()).toBe("name=Virginia Raggi, age=40");
    expect(cities[0].monuments).toHaveLength(3);
    expect(cities[1].monuments).toHaveLength(2);
    expect(cities[2].monuments).toHaveLength(0);
    expect(cities[0].monuments[0].toString()).toBe(
      "name=Basilica di San Petronio, completed=1663"
    );
    expect(cities[1].monuments[1].toString()).toBe(
      "name=Galleria Vittorio Emanuele II, completed=1877"
    );
  });

  it("Tyson instance with 1 custom TypeAdapter registered", () => {
    const json = {
      _name: "Bologna",
      coords: [44.498955, 11.327591]
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
      write(): void {
        /* Empty */
      },
      read(json: any): Point {
        return new Point(json[0], json[1]);
      }
    };

    const tyson = new TysonBuilder()
      .registerTypeAdapter(Point, pointAdapter)
      .build();
    const city = tyson.fromJson(json, City);
    expect(city.getPoint().toString()).toBe("lat=44.498955, lon=11.327591");
  });
});

describe("Testing toJson vs", () => {
  // TODO
});
