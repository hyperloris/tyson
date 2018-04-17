<div align="center">
  <img style="margin:32px" src="https://github.com/hyperloris/tyson/blob/master/static/img/tyson-logo.png" />
  <div>
    <a href="https://www.npmjs.com/package/@hyperloris/tyson">
      <img src="https://img.shields.io/npm/v/@hyperloris/tyson.svg?style=flat-square" />
    </a>
    <a href="https://travis-ci.org/hyperloris/tyson">
      <img src="https://img.shields.io/travis/hyperloris/tyson/master.svg?style=flat-square" />
    </a>
    <a href="https://coveralls.io/github/hyperloris/tyson?branch=master">
      <img src="https://img.shields.io/coveralls/github/hyperloris/tyson.svg?style=flat-square" />
    </a>
    <a href="https://github.com/hyperloris/tyson/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/hyperloris/tyson.svg?style=flat-square" />
    </a>
  </div>
</div>

> Tyson is a TypeScript serialization/deserialization library to convert objects to/from JSON.

## Inspiration
The library is inspired by the [Gson](https://github.com/google/gson) library.

## Installation
You can install `tyson` using [npm](http://npmjs.org):
```console
npm install --save @hyperloris/tyson
```

## Usage
The primary class to use is [`Tyson`](https://hyperloris.github.io/tyson/classes/tyson.html) which you can just create by calling `new Tyson()`. There is also a class [`TysonBuilder`](https://hyperloris.github.io/tyson/classes/tysonbuilder.html) available that can be used to create a Tyson instance with various settings (e.g. register a custom type adapter).

### Requirements
There are two requirements to be met in order to make the library work properly:
- Properties need to be preceded by the [`@JsonProperty`](https://hyperloris.github.io/tyson/globals.html#jsonproperty) annotation
- Properties need to have a default value (e.g. `undefined`)

### A nice example
Let's start with a JSON rappresenting a city:
```json
{
  "name": "Bologna",
  "population": 388884,
  "monuments": ["Piazza Maggiore", "Palazzo Re Enzo"],
  "mayor": {
    "full_name": "Virginio Merola",
    "birthdate": "1955-02-14T00:00:00"
  }
}
```

Now we need a couple of TypeScript classes:
```typescript
export class User {
  @JsonProperty("full_name")
  name: string = undefined;
  @JsonProperty({ type: Date })
  birthdate: Date = undefined;
}

export class City {
  @JsonProperty()
  name: string = undefined;
  @JsonProperty()
  population: number = undefined;
  @JsonProperty({ name: "monuments", type: [String] })
  private _monuments: string[] = undefined;
  @JsonProperty("mayor")
  private _mayor: User = undefined;
}
```

At this point we are ready to use the library:
```typescript
const tyson = new Tyson();
const city = tyson.fromJson(json, City);
const json = tyson.toJson(city);
```

## Documentation
Tyson [API](http://hyperloris.github.io/tyson): generated with [TypeDoc](http://typedoc.org) at every release.

## License
MIT
