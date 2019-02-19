function dec() {
  console.log('decorator!');
}

class Test {
  @dec
  x = 2;

  @dec
  func() {
    console.log('func');
  }
}

const x: Test = null;
new Test();

const obj1 = {a: 'a', b: 'b'};
const obj2 = {a: 'a', c: 'c'};
const obj3 = { ...obj1, ...obj2 };
const { a } = obj3;
console.log(a);
