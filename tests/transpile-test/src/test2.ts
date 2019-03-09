import 'reflect-metadata';

function dec() {
  console.log('decorator!');
}

function argDeco() {
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

  method2(@argDeco { argument }: Reference) {
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
