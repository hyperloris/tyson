import { Access, JsonProperty } from '../src/annotations/jsonProperty';
import { Tyson } from '../src/tyson';

describe('Tyson', () => {
  it('should be instantiable', () => {
    expect(new Tyson()).toBeInstanceOf(Tyson);
  });
});

describe('Running fromJson|toJson', () => {
  it('on class with no annotations', () => {
    class City {
      name: string = undefined;
      population: number = undefined;
      beautiful: boolean = undefined;
    }

    const city = new City();
    city.name = 'Bologna';
    city.population = 388884;
    city.beautiful = true;

    const json = {
      name: 'Bologna',
      population: 388884,
      beautiful: true,
    };

    const tyson = new Tyson();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.name).toBe(undefined);
    expect(xcity.population).toBe(undefined);
    expect(xcity.beautiful).toBe(undefined);

    const xjson = tyson.toJson(city);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual({});
  });

  it('on class with functions, accessors and no annotations', () => {
    class City {
      private _name: string = undefined;
      private _population: number = undefined;
      private _beautiful: boolean = undefined;

      constructor(name: string, population: number, beautiful: boolean) {
        this._name = name;
        this._population = population;
        this._beautiful = beautiful;
      }

      public get name(): string {
        return this._name;
      }

      public get population(): number {
        return this._population;
      }

      public isBeautiful(): boolean {
        return this._beautiful;
      }
    }

    const city = new City('Bologna', 388884, true);

    const json = {
      _name: 'Bologna',
      _population: 388884,
      _beautiful: true,
    };

    const tyson = new Tyson();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.name).toBe(undefined);
    expect(xcity.population).toBe(undefined);
    expect(xcity.isBeautiful()).toBe(undefined);

    const xjson = tyson.toJson(city);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual({});
  });

  it('on class with primitive typed properties annotated with JsonProperty()', () => {
    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty()
      population: number = undefined;
      @JsonProperty()
      beautiful: boolean = undefined;

      getDescription(): string {
        return `${this.name} has ${this.population} inhabitants.`;
      }
    }

    const city = new City();
    city.name = 'Bologna';
    city.population = 388884;
    city.beautiful = true;

    const json = {
      name: 'Bologna',
      population: 388884,
      beautiful: true,
    };

    const tyson = new Tyson();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.beautiful).toBe(true);
    expect(xcity.getDescription()).toBe('Bologna has 388884 inhabitants.');

    const xjson = tyson.toJson(city);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual({
      name: 'Bologna',
      population: 388884,
      beautiful: true,
    });
  });

  it('on class with primitive typed properties annotated with JsonProperty(name)', () => {
    class City {
      @JsonProperty('nam')
      name: string = undefined;
      @JsonProperty('ppltn')
      population: number = undefined;
      @JsonProperty('awesome')
      beautiful: boolean = undefined;

      getDescription(): string {
        return `${this.name} has ${this.population} inhabitants.`;
      }
    }

    const city = new City();
    city.name = 'Bologna';
    city.population = 388884;
    city.beautiful = true;

    const json = {
      nam: 'Bologna',
      ppltn: 388884,
      awesome: true,
    };

    const tyson = new Tyson();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.beautiful).toBe(true);
    expect(xcity.getDescription()).toBe('Bologna has 388884 inhabitants.');

    const xjson = tyson.toJson(city);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual({
      nam: 'Bologna',
      ppltn: 388884,
      awesome: true,
    });
  });

  it('on class with a property of type Date annotated with JsonProperty(type)', () => {
    class Park {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty('stars')
      rating: number = undefined;
      @JsonProperty({ type: Date })
      lastCleanup: Date = undefined;
    }

    const park = new Park();
    park.name = 'Giardini Lunetta Gamberini';
    park.rating = 4.1;
    park.lastCleanup = new Date('01/01/2018');

    const json = {
      name: 'Giardini Lunetta Gamberini',
      stars: 4.1,
      lastCleanup: '01/01/2018',
    };

    const tyson = new Tyson();

    const xpark = tyson.fromJson(json, Park);
    expect(xpark).toBeInstanceOf(Park);
    expect(xpark.name).toBe('Giardini Lunetta Gamberini');
    expect(xpark.rating).toBe(4.1);
    expect(xpark.lastCleanup.getTime()).toBe(new Date('01/01/2018').getTime());

    const xjson = tyson.toJson(park);
    expect(xjson).not.toBeInstanceOf(Park);
    expect(xjson).toEqual({
      name: 'Giardini Lunetta Gamberini',
      stars: 4.1,
      lastCleanup: new Date('01/01/2018').getTime(),
    });
  });

  it('on class with some properties annotated with JsonProperty(access)', () => {
    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty({ access: Access.FROMJSON_ONLY })
      population: number = undefined;
      @JsonProperty({ access: Access.TOJSON_ONLY })
      beautiful: boolean = undefined;
    }

    const city = new City();
    city.name = 'Bologna';
    city.population = 388884;
    city.beautiful = true;

    const json = {
      name: 'Bologna',
      population: 388884,
      beautiful: true,
    };

    const tyson = new Tyson();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.name).toBe('Bologna');
    expect(xcity.population).toBe(388884);
    expect(xcity.beautiful).toBe(undefined);

    const xjson = tyson.toJson(city);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual({
      name: 'Bologna',
      beautiful: true,
    });
  });

  it('on class with arrays of primitive types annotated with JsonProperty(name+type)', () => {
    class City {
      @JsonProperty({ name: '_fractions', type: [String] })
      fractions: string[] = undefined;
      @JsonProperty({ name: '_temperatures', type: [Number] })
      temperatures: number[] = undefined;
      @JsonProperty({ name: '_tdays', type: [Boolean] })
      tdays: boolean[] = undefined;
    }

    const city = new City();
    city.fractions = ['Barbiano', 'Bertalìa', 'Borgo Panigale'];
    city.temperatures = [20.7, 24.9, 27, 30.6, 34.9, 37.3];
    city.tdays = [false, false, false, false, false, true, true];

    const json = {
      _fractions: ['Barbiano', 'Bertalìa', 'Borgo Panigale'],
      _temperatures: [20.7, 24.9, 27, 30.6, 34.9, 37.3],
      _tdays: [false, false, false, false, false, true, true],
    };

    const tyson = new Tyson();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.fractions[0]).toBe('Barbiano');
    expect(xcity.temperatures[4]).toBe(34.9);
    expect(xcity.tdays[6]).toBe(true);

    const xjson = tyson.toJson(city);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual({
      _fractions: ['Barbiano', 'Bertalìa', 'Borgo Panigale'],
      _temperatures: [20.7, 24.9, 27, 30.6, 34.9, 37.3],
      _tdays: [false, false, false, false, false, true, true],
    });
  });

  it('on class with 1 child object annotated with JsonProperty', () => {
    class User {
      @JsonProperty('ID')
      id: number = undefined;
      @JsonProperty('_name')
      name: string = undefined;
    }

    class City {
      @JsonProperty('_name')
      name: string = undefined;
      @JsonProperty({ name: 'fractions', type: [String] })
      wards: string[] = undefined;
      @JsonProperty()
      mayor: User = undefined;
    }

    const city = new City();
    city.name = 'Bologna';
    city.wards = ['Barbiano', 'Bertalìa', 'Borgo Panigale'];
    city.mayor = new User();
    city.mayor.id = 35;
    city.mayor.name = 'Virginio Merola';

    const json = {
      _name: 'Bologna',
      fractions: ['Barbiano', 'Bertalìa', 'Borgo Panigale'],
      mayor: {
        ID: 35,
        _name: 'Virginio Merola',
      },
    };

    const tyson = new Tyson();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.name).toBe('Bologna');
    expect(xcity.wards).toHaveLength(3);
    expect(xcity.wards[1]).toBe('Bertalìa');
    expect(xcity.mayor).toBeInstanceOf(User);
    expect(xcity.mayor.id).toBe(35);
    expect(xcity.mayor.name).toBe('Virginio Merola');

    const xjson = tyson.toJson(city);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual({
      _name: 'Bologna',
      fractions: ['Barbiano', 'Bertalìa', 'Borgo Panigale'],
      mayor: {
        ID: 35,
        _name: 'Virginio Merola',
      },
    });
  });

  it('on class with an array of objects annotated with JsonProperty', () => {
    class User {
      @JsonProperty('ID')
      id: number = undefined;
      @JsonProperty('_name')
      name: string = undefined;
    }

    class City {
      @JsonProperty('_name')
      name: string = undefined;
      @JsonProperty({ type: [User] })
      mayors: User[] = undefined;
    }

    const mayor1 = new User();
    mayor1.id = 35;
    mayor1.name = 'Virginio Merola';

    const mayor2 = new User();
    mayor2.id = 41;
    mayor2.name = 'Flavio Delbono';

    const mayor3 = new User();
    mayor3.id = 23;
    mayor3.name = 'Sergio Cofferati';

    const city = new City();
    city.name = 'Bologna';
    city.mayors = [mayor1, mayor2, mayor3];

    const json = {
      _name: 'Bologna',
      mayors: [
        {
          ID: 35,
          _name: 'Virginio Merola',
        },
        {
          ID: 41,
          _name: 'Flavio Delbono',
        },
        {
          ID: 23,
          _name: 'Sergio Cofferati',
        },
      ],
    };

    const tyson = new Tyson();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.mayors).toHaveLength(3);
    expect(xcity.mayors[2]).toBeInstanceOf(User);
    expect(xcity.mayors[2].id).toBe(23);

    const xjson = tyson.toJson(city);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual({
      _name: 'Bologna',
      mayors: [
        {
          ID: 35,
          _name: 'Virginio Merola',
        },
        {
          ID: 41,
          _name: 'Flavio Delbono',
        },
        {
          ID: 23,
          _name: 'Sergio Cofferati',
        },
      ],
    });
  });

  it('on class with multi-type arrays annotated with JsonProperty', () => {
    class User {
      @JsonProperty('ID')
      id: number = undefined;
      @JsonProperty('_name')
      name: string = undefined;
    }

    class City {
      @JsonProperty({ type: [Number, Number, Boolean] })
      territory: any[] = undefined;
      @JsonProperty({ type: [String, [Number, User], [User]] })
      information: any[] = undefined;
    }

    const mayor1 = new User();
    mayor1.id = 35;
    mayor1.name = 'Virginio Merola';

    const mayor2 = new User();
    mayor2.id = 41;
    mayor2.name = 'Flavio Delbono';

    const mayor3 = new User();
    mayor3.id = 23;
    mayor3.name = 'Sergio Cofferati';

    const city = new City();
    city.territory = [44.498955, 11.327591, false];
    city.information = ['Italy', [35, mayor1], [mayor2, mayor3]];

    const json = {
      territory: [44.498955, 11.327591, false],
      information: [
        'Italy',
        [
          35,
          {
            ID: 35,
            _name: 'Virginio Merola',
          },
        ],
        [
          {
            ID: 41,
            _name: 'Flavio Delbono',
          },
          {
            ID: 23,
            _name: 'Sergio Cofferati',
          },
        ],
      ],
    };

    const tyson = new Tyson();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.territory).toHaveLength(3);
    expect(xcity.territory[0]).toBe(44.498955);
    expect(xcity.territory[2]).toBe(false);
    expect(xcity.information).toHaveLength(3);
    expect(xcity.information[0]).toBe('Italy');
    expect(xcity.information[1]).toHaveLength(2);
    expect(xcity.information[1][1]).toBeInstanceOf(User);
    expect(xcity.information[1][1].id).toBe(35);
    expect(xcity.information[2]).toHaveLength(2);
    expect(xcity.information[2][1].name).toBe('Sergio Cofferati');

    const xjson = tyson.toJson(city);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual({
      territory: [44.498955, 11.327591, false],
      information: [
        'Italy',
        [
          35,
          {
            ID: 35,
            _name: 'Virginio Merola',
          },
        ],
        [
          {
            ID: 41,
            _name: 'Flavio Delbono',
          },
          {
            ID: 23,
            _name: 'Sergio Cofferati',
          },
        ],
      ],
    });
  });

  it('on class with a mixed combination of types starting from an array', () => {
    class Monument {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty()
      completed: number = undefined;
    }

    class User {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty({ type: Date })
      birthdate: Date = undefined;
    }

    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty()
      population: number = undefined;
      @JsonProperty({ type: [String] })
      fractions: string[] = undefined;
      @JsonProperty({ type: [Monument] })
      monuments: Monument[] = undefined;
      @JsonProperty()
      mayor: User = undefined;
    }

    const monument1 = new Monument();
    monument1.name = 'Basilica di San Petronio';
    monument1.completed = 1663;

    const monument2 = new Monument();
    monument2.name = 'Università di Bologna';
    monument2.completed = 1088;

    const monument3 = new Monument();
    monument3.name = 'Duomo di Milano';
    monument3.completed = 1932;

    const mayor1 = new User();
    mayor1.name = 'Virginio Merola';
    mayor1.birthdate = new Date('02/14/1955');

    const mayor2 = new User();
    mayor2.name = 'Giuseppe Sala';
    mayor2.birthdate = new Date('05/28/1958');

    const mayor3 = new User();
    mayor3.name = 'Virginia Raggi';
    mayor3.birthdate = new Date('07/18/1978');

    const city1 = new City();
    city1.name = 'Bologna';
    city1.population = 388884;
    city1.fractions = ['Barbiano', 'Bertalìa', 'Borgo Panigale'];
    city1.monuments = [monument1, monument2];
    city1.mayor = mayor1;

    const city2 = new City();
    city2.name = 'Milano';
    city2.population = 1365156;
    city2.fractions = ['Arese', 'Assago', 'Baranzate'];
    city2.monuments = [monument3];
    city2.mayor = mayor2;

    const city3 = new City();
    city3.name = 'Roma';
    city3.population = 2874605;
    city3.fractions = ['Albano Laziale', 'Anguillara Sabazia', 'Ardea'];
    city3.monuments = [];
    city3.mayor = mayor3;

    const json = [
      {
        name: 'Bologna',
        population: 388884,
        fractions: ['Barbiano', 'Bertalìa', 'Borgo Panigale'],
        monuments: [
          { name: 'Basilica di San Petronio', completed: 1663 },
          { name: 'Università di Bologna', completed: 1088 },
        ],
        mayor: {
          name: 'Virginio Merola',
          birthdate: '02/14/1955',
        },
      },
      {
        name: 'Milano',
        population: 1365156,
        fractions: ['Arese', 'Assago', 'Baranzate'],
        monuments: [{ name: 'Duomo di Milano', completed: 1932 }],
        mayor: {
          name: 'Giuseppe Sala',
          birthdate: '05/28/1958',
        },
      },
      {
        name: 'Roma',
        population: 2874605,
        fractions: ['Albano Laziale', 'Anguillara Sabazia', 'Ardea'],
        monuments: [],
        mayor: {
          name: 'Virginia Raggi',
          birthdate: '07/18/1978',
        },
      },
    ];

    const tyson = new Tyson();

    const xcities = tyson.fromJson(json, City);
    expect(xcities).toHaveLength(3);
    expect(xcities[0]).toBeInstanceOf(City);
    expect(xcities[0].fractions).toHaveLength(3);
    expect(xcities[1].fractions[2]).toBe('Baranzate');
    expect(xcities[1].monuments).toHaveLength(1);
    expect(xcities[1].monuments[0]).toBeInstanceOf(Monument);
    expect(xcities[1].monuments[0].name).toBe('Duomo di Milano');
    expect(xcities[2].mayor).toBeInstanceOf(User);
    expect(xcities[2].mayor.birthdate.getTime()).toBe(new Date('07/18/1978').getTime());

    const xjson = tyson.toJson([city1, city2, city3], [City]);
    expect(xjson).toHaveLength(3);
    expect(xjson).toEqual([
      {
        name: 'Bologna',
        population: 388884,
        fractions: ['Barbiano', 'Bertalìa', 'Borgo Panigale'],
        monuments: [
          { name: 'Basilica di San Petronio', completed: 1663 },
          { name: 'Università di Bologna', completed: 1088 },
        ],
        mayor: {
          name: 'Virginio Merola',
          birthdate: new Date('02/14/1955').getTime(),
        },
      },
      {
        name: 'Milano',
        population: 1365156,
        fractions: ['Arese', 'Assago', 'Baranzate'],
        monuments: [{ name: 'Duomo di Milano', completed: 1932 }],
        mayor: {
          name: 'Giuseppe Sala',
          birthdate: new Date('05/28/1958').getTime(),
        },
      },
      {
        name: 'Roma',
        population: 2874605,
        fractions: ['Albano Laziale', 'Anguillara Sabazia', 'Ardea'],
        monuments: [],
        mayor: {
          name: 'Virginia Raggi',
          birthdate: new Date('07/18/1978').getTime(),
        },
      },
    ]);
  });

  it('should ignore the annotated properties that are missing on the json', () => {
    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty()
      population: number = undefined;
      @JsonProperty()
      beautiful: boolean = undefined;
    }

    const json = {
      name: 'Bologna',
      description: 'The capital of the Emilia-Romagna',
    };

    const xcity = new Tyson().fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.name).toBe('Bologna');
    expect(xcity.population).toBe(undefined);
    expect(xcity.beautiful).toBe(undefined);
  });

  it('should fail because a property is set as required, but missing on the json', () => {
    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty()
      population: number = undefined;
      @JsonProperty({ required: true })
      beautiful: boolean = undefined;
    }

    const json = {
      name: 'Bologna',
      population: 388884,
    };

    const tyson = new Tyson();

    try {
      tyson.fromJson(json, City);
    } catch (err) {
      expect(err.message).toEqual("Property 'beautiful' of City is set as required, but missing on the JSON.");
    }
  });

  it('should ignore the type of some properties during conversions', () => {
    class User {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty({ type: Date })
      birthdate: Date = undefined;
    }

    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty({ ignoreType: true })
      population: number = undefined;
      @JsonProperty({ ignoreType: true })
      mayor: User = undefined;
    }

    const json = {
      name: 'Bologna',
      population: '388884',
      mayor: {
        name: 'Virginio Merola',
        birthdate: '02/14/1955',
      },
    };

    const tyson = new Tyson();

    const xcity = tyson.fromJson(json, City);
    expect(xcity).toBeInstanceOf(City);
    expect(xcity.name).toBe('Bologna');
    expect(xcity.population).toBe('388884');
    expect(xcity.mayor).not.toBeInstanceOf(User);
    expect(xcity.mayor.name).toBe('Virginio Merola');
    expect(xcity.mayor.birthdate).not.toBeInstanceOf(Date);
    expect(xcity.mayor.birthdate).toBe('02/14/1955');

    const xjson = tyson.toJson(xcity);
    expect(xjson).not.toBeInstanceOf(City);
    expect(xjson).toEqual({
      name: 'Bologna',
      population: '388884',
      mayor: {
        name: 'Virginio Merola',
        birthdate: '02/14/1955',
      },
    });
  });

  it('should fail because the provided class types do not match the ones in the json', () => {
    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty()
      population: number = undefined;
      @JsonProperty()
      beautiful: boolean = undefined;
    }

    const json1 = {
      name: true,
      population: 388884,
      beautiful: true,
    };

    const json2 = {
      name: 'Bologna',
      population: '388884',
      beautiful: true,
    };

    const json3 = {
      name: 'Bologna',
      population: 388884,
      beautiful: 42,
    };

    const tyson = new Tyson();

    try {
      tyson.fromJson(json1, City);
    } catch (err) {
      expect(err.message).toEqual("Property 'name' of City does not match type of 'name'.");
    }
    try {
      tyson.fromJson(json2, City);
    } catch (err) {
      expect(err.message).toEqual("Property 'population' of City does not match type of 'population'.");
    }
    try {
      tyson.fromJson(json3, City);
    } catch (err) {
      expect(err.message).toEqual("Property 'beautiful' of City does not match type of 'beautiful'.");
    }
  });

  it('should convert nulls to undefineds', () => {
    class City {
      @JsonProperty()
      name: string = undefined;
      @JsonProperty()
      population: number = undefined;
      @JsonProperty()
      beautiful: boolean = undefined;
      @JsonProperty()
      website = 'http://bologna.it';
      @JsonProperty({ type: [String] })
      fractions: string[] = undefined;
    }

    const json = {
      name: 'Bologna',
      population: null,
      beautiful: true,
      website: null,
      fractions: ['Barbiano', null, 'Borgo Panigale'],
    };

    const xcity = new Tyson().fromJson(json, City);
    expect(xcity.name).toBe('Bologna');
    expect(xcity.population).toBe(undefined);
    expect(xcity.beautiful).toBe(true);
    expect(xcity.website).toBe(undefined);
    expect(xcity.fractions[1]).toBe(undefined);
    expect(xcity.fractions[2]).toBe('Borgo Panigale');
  });

  it('should not serialize nulls', () => {
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
    city.name = 'Bologna';
    city.fractions = ['Barbiano', undefined, 'Borgo Panigale', null];

    const xjson = new Tyson().toJson(city);
    expect(xjson).toEqual({
      name: 'Bologna',
      fractions: ['Barbiano', null, 'Borgo Panigale', null],
    });
  });
});
