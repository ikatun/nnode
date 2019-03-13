"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyParamDecoratorExpression = applyParamDecoratorExpression;

var t = _interopRequireWildcard(require("@babel/types"));

var _applyFieldDecorators = require("./apply-field-decorators");

var _typeForAnnotation = require("./type-for-annotation");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const paramCall = paramDecorator => t.callExpression(t.identifier('param'), [t.numericLiteral(paramDecorator.index), paramDecorator.decorator.expression]);

function applyParamDecoratorExpression(methodDecorators, paramDecorators, classDeclaration, method) {
  const methodDecoratorsExpression = methodDecorators.map(methodDeco => methodDeco.decorator.expression);
  const paramsDecoratorsExpressions = paramDecorators.map(paramCall);
  const paramCalls = t.arrayExpression([...methodDecoratorsExpression, ...paramsDecoratorsExpressions, (0, _applyFieldDecorators.metadataCall)('design:type', t.identifier('Function')), (0, _applyFieldDecorators.metadataCall)('design:paramtypes', t.arrayExpression(method.params.map(param => (0, _typeForAnnotation.typeForAnnotation)(param.typeAnnotation)))), (0, _applyFieldDecorators.metadataCall)('design:returntype', (0, _typeForAnnotation.typeForAnnotation)(method.returnType))]);
  return t.callExpression(t.identifier('decorate'), [paramCalls, t.memberExpression(classDeclaration.id, t.identifier('prototype')), t.stringLiteral(method.key.name), t.identifier('null')]);
}