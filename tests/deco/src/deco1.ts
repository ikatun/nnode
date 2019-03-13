const classDeco = (...args) => {};
const methodDeco = (...args) => {};
const fieldDeco = (...args) => {};
const argsDeco = (...args) => {};
const argsDeco2 = (...args) => {};

class Reference {}

@classDeco
@classDeco
class TestClass {
  @methodDeco
  @methodDeco
  method(@argsDeco arg: string): number {
  }

  method2(@argsDeco @argsDeco2 arg1: number, @argsDeco arg2: { x: string; y: number }): Reference {
  }

  @fieldDeco
  @fieldDeco
  field1: number;

  @fieldDeco
  @fieldDeco
  field2: { x: string; y: number };

  @fieldDeco
  @fieldDeco
  field3: Reference;
}
