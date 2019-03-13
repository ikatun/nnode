const classDeco = (...args) => {};

const methodDeco = (...args) => {};

const fieldDeco = (...args) => {};

const argsDeco = (...args) => {};

const argsDeco2 = (...args) => {};


var decorate = function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var metadata = function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var param = function (paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
};

class Reference {}


var decorate = function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var metadata = function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var param = function (paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
};

class TestClass {
  constructor() {
    this.field1 = void 0;
    this.field2 = void 0;
    this.field3 = void 0;
  }

  method(arg) {}

  method2(arg1, arg2) {}

}

decorate([fieldDeco, fieldDeco, metadata("design:type", Number)], TestClass.prototype, "field1", void 0)
decorate([fieldDeco, fieldDeco, metadata("design:type", Object)], TestClass.prototype, "field2", void 0)
decorate([fieldDeco, fieldDeco, metadata("design:type", typeof Reference === "undefined" ? Object : Reference)], TestClass.prototype, "field3", void 0)
decorate([methodDeco, methodDeco, param(0, argsDeco), metadata("design:type", Function), metadata("design:paramtypes", [String]), metadata("design:returntype", Number)], TestClass.prototype, "method", null)
decorate([param(0, argsDeco), param(0, argsDeco2), param(1, argsDeco), metadata("design:type", Function), metadata("design:paramtypes", [Number, Object]), metadata("design:returntype", typeof Reference === "undefined" ? Object : Reference)], TestClass.prototype, "method2", null)
TestClass = decorate([classDeco, classDeco], TestClass)