"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metadataCall = metadataCall;
exports.applyFieldDecorators = applyFieldDecorators;

var _typescriptBabelDecorators = require("./typescript-babel-decorators");

var t = _interopRequireWildcard(require("@babel/types"));

var _typeForAnnotation = require("./type-for-annotation");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function metadataCall(key, arg) {
  const metadataCallArgs = [t.stringLiteral(key), arg];
  return t.callExpression(t.identifier('akessrfljlrgqgd_metadata'), metadataCallArgs);
}

function applyFieldDecorators(decorators) {
  const metadataCallArgs = [t.stringLiteral('design:type'), (0, _typeForAnnotation.typeForAnnotation)(decorators[0].field.typeAnnotation)];
  const metadataCall = t.callExpression(t.identifier('akessrfljlrgqgd_metadata'), metadataCallArgs);
  const classPrototype = t.memberExpression(decorators[0].classDeclaration.id, t.identifier('prototype'));
  const args = t.arrayExpression([...decorators.map(decorator => decorator.decorator.expression), metadataCall]);
  const decorateExpression = t.callExpression(t.identifier('akessrfljlrgqgd_decorate'), [args, classPrototype, t.stringLiteral(decorators[0].field.key.name), t.identifier('void 0')]);
  return decorateExpression;
}