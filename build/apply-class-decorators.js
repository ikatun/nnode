"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyClassDecorators = applyClassDecorators;

var t = _interopRequireWildcard(require("@babel/types"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function applyClassDecorators(decorators) {
  const args = t.arrayExpression(decorators.map(decorator => decorator.decorator.expression));
  const className = decorators[0].classDeclaration.id;
  const decorateExpression = t.callExpression(t.identifier('akessrfljlrgqgd_decorate'), [args, className]);
  return t.assignmentExpression('=', className, decorateExpression);
}