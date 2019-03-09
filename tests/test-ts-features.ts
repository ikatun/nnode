import { writeFileSync } from 'fs';
import { InputArgType, ISomething } from './InputArgType';

function dec(...args) {
  console.log('decorator!');
}

const methodDecorator = () => (...args) => {
  console.log('methodDecorator!', args);
}

const fieldDeco = (...args) => {
  console.log('fieldDeco', args)
}

//@ts-ignore
(global as any).nnumber = Number;

type nnumber = number;

@dec
class Test {
  @fieldDeco
  x: number = 2;

  @dec
  y: nnumber = 2;

  @dec
  func(): number {
    console.log('func');

    return 2;
  }

  @dec
  myDecoratedMethod(@methodDecorator(() => InputArgType) { req }: InputArgType) {
    console.log('method');
  }
}

console.log('calling ctor');
const x: Test = new Test();

const obj1 = {a: 'a', b: 'b'};
const obj2 = {a: 'a', c: 'c'};
const obj3 = { ...obj1, ...obj2 };
const { a } = obj3;
console.log(a);

console.log(writeFileSync);
console.log('test');

console.log('metadata',
  Reflect.getMetadata('design:paramtypes', Test, 'myDecoratedMethod')
);
