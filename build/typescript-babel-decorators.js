"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var t = _interopRequireWildcard(require("@babel/types"));

var _applyClassDecorators = require("./apply-class-decorators");

var _applyFieldDecorators = require("./apply-field-decorators");

var _applyParamDecoratorExpression = require("./apply-param-decorator-expression");

var _decoratingHelpersTemplate = require("./decorating-helpers-template");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function mapMergeAndEmpty(ys, xs, f) {
  if (xs === null || xs === undefined) {
    return [];
  }

  const returnValue = xs.map(f);
  xs.length = 0;
  ys.push(...returnValue);
  return returnValue;
}

const toClassDecorator = classDeclaration => decorator => {
  return {
    classDeclaration,
    decorator
  };
};

const toMethodDecorator = (classDeclaration, method) => decorator => {
  return {
    classDeclaration,
    decorator,
    method
  };
};

const toFieldDecorator = (classDeclaration, field) => decorator => {
  return {
    classDeclaration,
    decorator,
    field
  };
};

function _default() {
  let hadDecorators = false;
  return {
    visitor: {
      ClassDeclaration(path) {
        const classDeclaration = path.node;
        const classDecorators = mapMergeAndEmpty([], path.node.decorators, toClassDecorator(classDeclaration));
        const fieldDecoratorExpressions = [];
        const paramDecoratorExpressions = [];
        path.node.body.body.map(bodyElement => {
          if (bodyElement.type === 'ClassMethod' || bodyElement.type === 'ClassPrivateMethod') {
            const methodDecorators = mapMergeAndEmpty([], bodyElement.decorators, toMethodDecorator(classDeclaration, bodyElement));
            const paramDecorators = [];
            bodyElement.params.map((param, index) => {
              if (param.type !== 'MemberExpression' && param.type !== 'TSParameterProperty') {
                paramDecorators.push(...mapMergeAndEmpty([], param.decorators, decorator => ({
                  decorator,
                  index
                })));
              }
            });

            if (paramDecorators.length > 0) {
              paramDecoratorExpressions.push((0, _applyParamDecoratorExpression.applyParamDecoratorExpression)(methodDecorators, paramDecorators, classDeclaration, bodyElement));
            }
          }

          if (bodyElement.type === 'ClassProperty' && bodyElement.decorators) {
            const fieldDecorators = mapMergeAndEmpty([], bodyElement.decorators, toFieldDecorator(classDeclaration, bodyElement));

            if (fieldDecorators.length > 0) {
              fieldDecoratorExpressions.push((0, _applyFieldDecorators.applyFieldDecorators)(fieldDecorators));
            }
          }
        });
        const decoratorsExpressions = [...fieldDecoratorExpressions, ...paramDecoratorExpressions, ...(classDecorators.length > 0 ? [(0, _applyClassDecorators.applyClassDecorators)(classDecorators)] : [])];
        path.insertAfter(decoratorsExpressions);

        if (decoratorsExpressions.length > 0) {
          hadDecorators = true;
        }
      },

      Program: {
        exit(path) {
          if (hadDecorators) {
            path.node.body.unshift(t.expressionStatement(t.identifier(_decoratingHelpersTemplate.decoratingHelpersTemplate)));
          }
        }

      }
    }
  };
}

;