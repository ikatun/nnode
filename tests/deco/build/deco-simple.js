"use strict";

var _reference = require("./reference");


var akessrfljlrgqgd_decorate = function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var akessrfljlrgqgd_metadata = function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var akessrfljlrgqgd_param = function (paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
};
var akessrfljlrgqgd_determineType = function(t) {
  if (t === undefined) {
    return Object;
  }
  if (typeof t === 'function') {
    return t;
  }
  if (typeof t === 'object') {
    var values = Object.values(t);
    if (!values.length) {
    console.log('Undetermined enum', t);
      return Object;
    }
    if (values.filter(function(value) { return typeof value === 'string'; }).length === values.length) {
      return String;
    }
    if (values.filter(function(value) { return typeof value === 'number'; }).length === values.length) {
      return Number;
    }
    console.log('Undetermined enum', t);
    return Object;
  }
}
;

const fieldDeco = (...args) => {};

class TestClass {
  constructor() {
    this.field1 = void 0;
  }

}

akessrfljlrgqgd_decorate([fieldDeco, akessrfljlrgqgd_metadata("design:type", akessrfljlrgqgd_determineType(typeof _reference.Reference === "undefined" ? undefined : _reference.Reference))], TestClass.prototype, "field1", void 0)