import { Reference } from './reference'
import { BuilderFormat } from './enum';

const classDeco = (...args) => {
  console.log('classDeco', BuilderFormat);
};
const methodDeco = (...args) => {};
const fieldDeco = (...args) => {};
const argsDeco = (...args) => {};
const argsDeco2 = (...args) => {};


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
  field3: BuilderFormat;

  @fieldDeco
  @fieldDeco
  field4: Reference;

  @fieldDeco
  field5: 'A' | 'B' | 'C';
}
