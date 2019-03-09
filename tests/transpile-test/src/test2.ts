import 'reflect-metadata';

function dec() {
  console.log('decorator!');
}

function argDeco() {
  console.log('decorator!');
}

function argDeco2() {
  console.log('decorator!');
}

function methodDecorator() {
  console.log('methodDecorator!');
}

class Reference {

}

@dec
class Test {
  @dec
  x: number = 2;

  @dec
  y: number = 5;

  method2(@argDeco { argument }: Reference, @argDeco2 arg2: number) {
    console.log('@dec argument: number');
  }
  //
  // @dec
  // func() {
  //   console.log('func');
  // }
}

const x: Test = null;
new Test();
