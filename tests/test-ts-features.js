"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var InputArgType_1 = require("./InputArgType");
function dec() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log('decorator!');
}
var methodDecorator = function () { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log('methodDecorator!', args);
}; };
var fieldDeco = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log('fieldDeco', args);
};
//@ts-ignore
global.nnumber = Number;
var Test = /** @class */ (function () {
    function Test() {
        this.x = 2;
        this.y = 2;
    }
    Test.prototype.func = function () {
        console.log('func');
        return 2;
    };
    Test.prototype.myDecoratedMethod = function (_a) {
        var req = _a.req;
        console.log('method');
    };
    __decorate([
        fieldDeco,
        __metadata("design:type", Number)
    ], Test.prototype, "x", void 0);
    __decorate([
        dec,
        __metadata("design:type", Number)
    ], Test.prototype, "y", void 0);
    __decorate([
        dec,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Number)
    ], Test.prototype, "func", null);
    __decorate([
        dec,
        __param(0, methodDecorator(function () { return InputArgType_1.InputArgType; })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [InputArgType_1.InputArgType]),
        __metadata("design:returntype", void 0)
    ], Test.prototype, "myDecoratedMethod", null);
    Test = __decorate([
        dec
    ], Test);
    return Test;
}());
console.log('calling ctor');
var x = new Test();
var obj1 = { a: 'a', b: 'b' };
var obj2 = { a: 'a', c: 'c' };
var obj3 = __assign({}, obj1, obj2);
var a = obj3.a;
console.log(a);
console.log(fs_1.writeFileSync);
console.log('test');
console.log('metadata', Reflect.getMetadata('design:paramtypes', Test, 'myDecoratedMethod'));
