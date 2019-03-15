import { Reference } from './reference'

const fieldDeco = (...args) => {};

class TestClass {
  @fieldDeco
  field1: Reference;
}
