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
