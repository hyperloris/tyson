import { JsonProperty } from "../src/annotations/jsonProperty";
import { TypeAdapter } from "./../src/typeAdapter";
import { Tyson } from "../src/tyson";
import { TysonBuilder } from "./../src/tysonBuilder";

describe("Tyson test", () => {
  it("Tyson is instantiable", () => {
    expect(new Tyson()).toBeInstanceOf(Tyson);
  });
});

describe("Testing fromJson vs", () => {
  it("Simple class with no annotations", () => {
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

  it("Simple class with functions and no annotations", () => {
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

  it("Simple class with functions and JsonProperty annotation", () => {
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

  it("Class with functions, JsonProperty annotation and 1 child", () => {
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

  it("Class with functions, JsonProperty annotation and 1 array of children", () => {
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

  it("Class with primitive types that differ from the json", () => {
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
        "Property 'name' of City does not match type of 'name'."
      );
    }
    try {
      tyson.fromJson(json2, City);
    } catch (err) {
      expect(err.message).toEqual(
        "Property 'population' of City does not match type of 'population'."
      );
    }
    try {
      tyson.fromJson(json3, City);
    } catch (err) {
      expect(err.message).toEqual(
        "Property 'beautiful' of City does not match type of 'beautiful'."
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
      private _lat: number = undefined;
      private _lon: number = undefined;

      constructor(lat?: number, lon?: number) {
        this._lat = lat;
        this._lon = lon;
      }

      get lat(): number {
        return this._lat;
      }

      get lon(): number {
        return this._lon;
      }

      public toString(): string {
        return `lat=${this._lat}, lon=${this._lon}`;
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

    class PointAdapter extends TypeAdapter<Point> {
      protected _fromJson(json: any): Point {
        return new Point(json[0], json[1]);
      }
      protected _toJson(src: Point) {
        return [src.lat, src.lon];
      }
    }

    const tyson = new TysonBuilder()
      .registerTypeAdapter(Point, new PointAdapter())
      .build();
    const city = tyson.fromJson(json, City);
    expect(city.getPoint().toString()).toBe("lat=44.498955, lon=11.327591");
  });

  it("Nulls with default Tyson instance", () => {
    const json = {
      name: "Bologna",
      population: null,
      beautiful: true,
      website: null,
      fractions: ["Barbiano", null, "Borgo Panigale"]
    };

    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty()
      population: number = undefined;
      @JsonProperty()
      beautiful: boolean = undefined;
      @JsonProperty()
      website: string = "http://bologna.it";
      @JsonProperty({ type: [String] })
      fractions: string[] = undefined;
    }

    const city = new Tyson().fromJson(json, City);
    expect(city.name).toBe("Bologna");
    expect(city.population).toBe(undefined);
    expect(city.beautiful).toBe(true);
    expect(city.website).toBe(undefined);
    expect(city.fractions[1]).toBe(undefined);
    expect(city.fractions[2]).toBe("Borgo Panigale");
  });

  it("A large and complex dataset", () => {
    const json = {};
    for (let c of ["a", "b", "c", "d"]) {
      json[c] = [];
      for (let i = 0; i < 1000; i++) {
        json[c].push(
          {
            str: c + i,
            num: i,
            bol: i % 2 === 0,
            date: "03/29/2018",
            obj: { p1: "poiuyt" },
            astr: ["qwerty", "asdfgh", "zxcvbn"],
            anum: [2, 3, 5, 7, 11, 13, 17, 19],
            abol: [true, false, false, true],
            aobj: [
              { p1: "lkjhgf" },
              { p1: "mnbvcx" }
            ]
          }
        );
      }
    }

    class Child {
      @JsonProperty("p1")
      p111: string = undefined;
    }

    class Base {
      str: string = undefined;
      @JsonProperty()
      num: number = undefined;
      @JsonProperty("bol")
      bolll: boolean = undefined;
      @JsonProperty({ type: Date })
      date: Date = undefined;
      @JsonProperty("obj")
      objjj: Child = undefined;
      @JsonProperty({ type: [String] })
      astr: string[] = undefined;
      @JsonProperty({ type: [Number] })
      anum: number[] = undefined;
      @JsonProperty({ type: [Boolean] })
      abol: boolean[] = undefined;
      @JsonProperty({ name: "aobj", type: [Child] })
      aobjjj: Child[] = undefined;
    }

    class Root {
      a: Base[] = undefined;
      @JsonProperty({ type: [Base] })
      b: Base[] = undefined;
      @JsonProperty({ name: "c", type: [Base] })
      cC: Base[] = undefined;
    }

    const tyson = new Tyson();
    const root = tyson.fromJson(json, Root);

    expect(root.a).toHaveLength(1000);
    expect(root.b).toHaveLength(1000);
    expect(root.cC).toHaveLength(1000);
    expect(root.a[150].str).toBe("a150");
    expect(root.b[500].bolll).toBe(true);
    expect(root.b[750].date.getTime()).toBe(new Date("03/29/2018").getTime());
    expect(root.b[999].objjj.p111).toBe("poiuyt");
    expect(root.cC[42].astr[2]).toBe("zxcvbn");
    expect(root.cC[99].aobjjj[0].p111).toBe("lkjhgf");
  });
});

describe("Testing toJson vs", () => {
  it("Simple class with no annotations", () => {
    class City {
      private name: string;
      private population: number;
      private beautiful: boolean;

      constructor(name: string, population: number, beautiful: boolean) {
        this.name = name;
        this.population = population;
        this.beautiful = beautiful;
      }
    }

    const city = new City("Bologna", 388884, true);
    const json = new Tyson().toJson(city);
    expect(json).toEqual({ name: "Bologna", population: 388884, beautiful: true });
  });

  it("Simple class with JsonProperty annotation", () => {
    class City {
      @JsonProperty()
      private name: string;
      @JsonProperty("people")
      private population: number;
      @JsonProperty("awesome")
      private beautiful: boolean;

      constructor(name: string, population: number, beautiful: boolean) {
        this.name = name;
        this.population = population;
        this.beautiful = beautiful;
      }
    }

    const city = new City("Bologna", 388884, true);
    const json = new Tyson().toJson(city);
    expect(json).toEqual({ name: "Bologna", people: 388884, awesome: true });
  });

  it("Class with children and arrays", () => {
    class Park {
      @JsonProperty("_name")
      name: string = undefined;
      @JsonProperty("stars")
      rating: number = undefined;
      @JsonProperty({ type: Date })
      lastCleanup: Date = undefined;
    }

    class City {
      @JsonProperty("_name")
      name: string = undefined;
      @JsonProperty()
      population: number = undefined;
      @JsonProperty()
      beautiful: boolean = undefined;
      @JsonProperty({ type: [String] })
      fractions: string[] = undefined;
      @JsonProperty({ type: [Park] })
      parks: Park[] = undefined;
    }

    const park1 = new Park();
    park1.name = "Giardini Lunetta Gamberini";
    park1.rating = 4.1;
    park1.lastCleanup = new Date("01/01/2018");

    const park2 = new Park();
    park2.name = "Giardini Margherita";
    park2.rating = 4.5;
    park2.lastCleanup = new Date("03/05/2018");

    const city = new City();
    city.name = "Bologna";
    city.population = 388884;
    city.beautiful = true;
    city.fractions = ["Barbiano", "Bertalìa", "Borgo Panigale"];
    city.parks = [park1, park2];

    const tyson = new Tyson();
    expect(tyson.toJson(city)).toEqual(
      {
        _name: "Bologna",
        population: 388884,
        beautiful: true,
        fractions: ["Barbiano", "Bertalìa", "Borgo Panigale"],
        parks: [
          {
            _name: "Giardini Lunetta Gamberini",
            stars: 4.1,
            lastCleanup: new Date("01/01/2018").getTime()
          },
          {
            _name: "Giardini Margherita",
            stars: 4.5,
            lastCleanup: new Date("03/05/2018").getTime()
          }
        ]
      }
    );
  });

  it("Nulls with default Tyson instance", () => {
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

    const json = new Tyson().toJson(city);
    expect(json).toEqual(
      {
        name: "Bologna",
        fractions: ["Barbiano", null, "Borgo Panigale", null]
      }
    );
  });

  it("Nulls with serialization enabled", () => {
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

    const tyson = new TysonBuilder().enableNullsSerialization().build();
    expect(tyson.toJson(city)).toEqual(
      {
        name: "Bologna",
        population: null,
        beautiful: null,
        fractions: ["Barbiano", null, "Borgo Panigale", null]
      }
    );
  });
});
