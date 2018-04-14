# Tyson
[![Coverage Status](https://coveralls.io/repos/github/hyperloris/tyson/badge.svg?branch=master)](https://coveralls.io/github/hyperloris/tyson?branch=master)

Tyson is a TypeScript serialization/deserialization library to convert objects from/to JSON.

## Installation
You can install `tyson` using [npm](http://npmjs.org):
```console
npm install --save @hyperloris/tyson
```

## Usage
You don't need any particular configuration to use this libray, 
the only thing to do is instantiate the main class and then you are ready to go:

```typescript
const tyson = new Tyson();
let target: MyType = tyson.fromJson(json, MyType);
let json = tyson.toJson(target);
```

## Documentation
An extensive documentation can be found [here](http://hyperloris.github.io/tyson).

## License
MIT
