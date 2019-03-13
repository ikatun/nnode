"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _applyClassDecorators = require("./apply-class-decorators");

var _applyFieldDecorators = require("./apply-field-decorators");

var _applyParamDecoratorExpression = require("./apply-param-decorator-expression");

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

const toArgsDecorator = (classDeclaration, method, param) => decorator => {
  return {
    classDeclaration,
    decorator,
    method,
    param
  };
};

function _default() {
  return {
    visitor: {
      ClassDeclaration(path) {
        const classDeclaration = path.node;
        const classDecorators = mapMergeAndEmpty([], path.node.decorators, toClassDecorator(classDeclaration));
        const argsDecorators = [];
        const fieldDecorators = [];
        const fieldDecoratorExpressions = [];
        const paramDecoratorExpressions = [];
        path.node.body.body.map(bodyElement => {
          if ((bodyElement.type === 'ClassMethod' || bodyElement.type === 'ClassPrivateMethod') && bodyElement.decorators) {
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

        if (classDecorators.length > 0) {
          path.insertAfter((0, _applyClassDecorators.applyClassDecorators)(classDecorators));
        }

        for (var _i = 0; _i < fieldDecoratorExpressions.length; _i++) {
          const fieldDecoratorExpression = fieldDecoratorExpressions[_i];
          path.insertAfter(fieldDecoratorExpression);
        }

        for (var _i2 = 0; _i2 < paramDecoratorExpressions.length; _i2++) {
          const paramDecoratorExpression = paramDecoratorExpressions[_i2];
          path.insertAfter(paramDecoratorExpression);
        }
      },

      ClassExpression(path, state) {},

      ObjectExpression(path, state) {},

      AssignmentExpression(path, state) {}

    }
  };
}

;