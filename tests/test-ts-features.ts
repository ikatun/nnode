import { writeFileSync } from 'fs';

function dec(...args) {
  console.log('decorator!');
}

class Test {
  @dec
  x = 2;

  @dec
  func(): number {
    console.log('func');

    return 2;
  }
}

const x: Test = null;
new Test();

const obj1 = {a: 'a', b: 'b'};
const obj2 = {a: 'a', c: 'c'};
const obj3 = { ...obj1, ...obj2 };
const { a } = obj3;
console.log(a);

console.log(writeFileSync);
