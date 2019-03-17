export enum BuilderFormat {
  A6 = 'A6',
  T1 = 'T1',
}

const deco: any = () => undefined;

@deco
class TestClass {
  @deco
  field: BuilderFormat;
}

console.log('enum', BuilderFormat, typeof BuilderFormat);
