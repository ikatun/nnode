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
;

const fieldDeco = (...args) => {};

class TestClass {
  constructor() {
    this.field1 = void 0;
  }

}

akessrfljlrgqgd_decorate([fieldDeco, akessrfljlrgqgd_metadata("design:type", typeof _reference.Reference === "undefined" ? Object : _reference.Reference)], TestClass.prototype, "field1", void 0)