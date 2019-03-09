import 'reflect-metadata';

function classDeco() {
  console.log('decorator!');
}

function argDeco() {
  console.log('decorator!');
}

const argDeco2 = () => () => {
  console.log('decorator!');
}

function methodDecorator() {
  console.log('methodDecorator!');
}

class Reference {

}

@classDeco
class Test {
  @dec
  x: number = 2;

  @dec
  y: number = 5;

  method2(@argDeco2('filters', { nullable: true }) filters: Reference) {
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

console.log(Reflect.getMetadata("design:paramtypes", Test, 'method2'));
